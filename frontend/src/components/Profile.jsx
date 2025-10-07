import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import XPChart from './charts/XPChart';
import AuditChart from './charts/AuditChart';
import ProjectsChart from './charts/ProjectsChart';

const Profile = ({ user, onLogout }) => {
  const [profileData, setProfileData] = useState({
    user: null,
    transactions: [],
    progress: [],
    results: [],
    objects: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const executeGraphQLQuery = async (query, variables = {}) => {
    const token = localStorage.getItem('jwt_token');
    
    try {
      const response = await fetch('https://learn.01founders.co/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0]?.message || 'GraphQL query failed');
      }
      
      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Fetch user data
      const userQuery = `
        query {
          user {
            id
            login
            firstName
            lastName
            email
          }
        }
      `;
      
      // Fetch transactions (XP data)
      const transactionsQuery = `
        query {
          transaction(where: {type: {_eq: "xp"}}, order_by: {createdAt: asc}) {
            id
            type
            amount
            objectId
            createdAt
            path
          }
        }
      `;
      
      // Fetch progress data
      const progressQuery = `
        query {
          progress(order_by: {createdAt: desc}, limit: 50) {
            id
            userId
            objectId
            grade
            createdAt
            updatedAt
            path
          }
        }
      `;
      
      // Fetch results data
      const resultsQuery = `
        query {
          result(order_by: {createdAt: desc}, limit: 50) {
            id
            objectId
            grade
            type
            createdAt
            path
          }
        }
      `;

      const [userData, transactionData, progressData, resultData] = await Promise.all([
        executeGraphQLQuery(userQuery),
        executeGraphQLQuery(transactionsQuery),
        executeGraphQLQuery(progressQuery),
        executeGraphQLQuery(resultsQuery)
      ]);

      setProfileData({
        user: userData.user[0],
        transactions: transactionData.transaction || [],
        progress: progressData.progress || [],
        results: resultData.result || []
      });
      
      toast.success('Profile data loaded successfully');
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      setError('Failed to load profile data. Please try again.');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const calculateTotalXP = () => {
    return profileData.transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const calculateAuditRatio = () => {
    const passedProjects = profileData.results.filter(result => result.grade > 0).length;
    const totalProjects = profileData.results.length;
    return totalProjects > 0 ? ((passedProjects / totalProjects) * 100).toFixed(1) : 0;
  };

  const getRecentProjects = () => {
    return profileData.progress.slice(0, 5).map(p => ({
      ...p,
      name: p.path?.split('/').pop() || 'Unknown Project',
      status: p.grade > 0 ? 'PASS' : 'FAIL'
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchProfileData}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" data-testid="profile-title">
              {profileData.user?.firstName || profileData.user?.login || 'Profile'}
            </h1>
            <p className="text-slate-600">GraphQL Profile Dashboard</p>
          </div>
          <Button 
            onClick={onLogout} 
            variant="outline"
            data-testid="logout-button"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="user-info-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>User Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Login</p>
                  <p className="font-semibold" data-testid="user-login">
                    {profileData.user?.login}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-semibold" data-testid="user-email">
                    {profileData.user?.email || 'Not available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Full Name</p>
                  <p className="font-semibold" data-testid="user-name">
                    {profileData.user?.firstName && profileData.user?.lastName 
                      ? `${profileData.user.firstName} ${profileData.user.lastName}`
                      : 'Not available'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="xp-summary-card">
            <CardHeader>
              <CardTitle>XP Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900" data-testid="total-xp">
                    {calculateTotalXP().toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600">Total XP Earned</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Projects Completed</p>
                  <p className="text-lg font-semibold" data-testid="projects-count">
                    {profileData.transactions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="audit-summary-card">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-600">Success Rate</p>
                    <p className="font-semibold" data-testid="success-rate">
                      {calculateAuditRatio()}%
                    </p>
                  </div>
                  <Progress value={parseFloat(calculateAuditRatio())} className="h-2" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Attempts</p>
                  <p className="text-lg font-semibold" data-testid="total-attempts">
                    {profileData.results.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="projects">Recent Projects</TabsTrigger>
            <TabsTrigger value="xp-chart">XP Progress</TabsTrigger>
            <TabsTrigger value="audit-chart">Audit Ratio</TabsTrigger>
            <TabsTrigger value="projects-chart">Projects Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" data-testid="projects-tab">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecentProjects().map((project, index) => (
                    <div key={project.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={project.status === 'PASS' ? 'default' : 'destructive'}
                        data-testid={`project-status-${index}`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="xp-chart" data-testid="xp-chart-tab">
            <Card>
              <CardHeader>
                <CardTitle>XP Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <XPChart transactions={profileData.transactions} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-chart" data-testid="audit-chart-tab">
            <Card>
              <CardHeader>
                <CardTitle>Audit Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditChart results={profileData.results} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects-chart" data-testid="projects-chart-tab">
            <Card>
              <CardHeader>
                <CardTitle>Projects Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectsChart progress={profileData.progress} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;