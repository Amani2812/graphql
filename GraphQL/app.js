// GraphQL endpoint
const API_URL = 'https://((DOMAIN))/api/graphql-engine/v1/graphql';

// My user ID - change this to your actual user ID
const MY_USER_ID = 1;

// Function to make GraphQL queries
async function queryGraphQL(query) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query })
        });
        
        const data = await response.json();
        console.log('GraphQL Response:', data);
        return data;
    } catch (error) {
        console.log('Error making GraphQL query:', error);
        return null;
    }
}

// Start loading data when page loads
window.addEventListener('load', function() {
    console.log('Starting GraphQL profile...');
    loadAllData();
});

async function loadAllData() {
    await getUserInfo();
    await getXPData();
    await getProjectsData();
    await createStatistics();
}

// Query 1: NORMAL QUERY - Get all users, then find mine
async function getUserInfo() {
    const query = `
        query {
            user {
                id
                login
            }
        }
    `;
    
    const result = await queryGraphQL(query);
    
    if (result && result.data && result.data.user) {
        // Find my user from the list
        let myUser = null;
        for (let i = 0; i < result.data.user.length; i++) {
            if (result.data.user[i].id === MY_USER_ID) {
                myUser = result.data.user[i];
                break;
            }
        }
        
        if (myUser) {
            document.getElementById('user-info').innerHTML = `
                <div class="info-card">
                    <h3>Welcome, ${myUser.login}!</h3>
                    <p><strong>User ID:</strong> ${myUser.id}</p>
                    <p><strong>Status:</strong> Active Student</p>
                </div>
            `;
        } else {
            document.getElementById('user-info').innerHTML = '<p>User not found</p>';
        }
    }
}

// Query 2: QUERY WITH ARGUMENTS - Get XP transactions for my user
async function getXPData() {
    const query = `
        query {
            transactions(where: {userId: {_eq: ${MY_USER_ID}}, type: {_eq: "xp"}}) {
                id
                amount
                createdAt
                path
            }
        }
    `;
    
    const result = await queryGraphQL(query);
    
    if (result && result.data && result.data.transactions) {
        const transactions = result.data.transactions;
        
        // Calculate total XP
        let totalXP = 0;
        for (let i = 0; i < transactions.length; i++) {
            totalXP = totalXP + transactions[i].amount;
        }
        
        // Calculate level (every 1000 XP = 1 level)
        const level = Math.floor(totalXP / 1000);
        const progressToNext = totalXP - (level * 1000);
        
        document.getElementById('xp-info').innerHTML = `
            <div class="info-card">
                <div class="big-number">${totalXP.toLocaleString()} XP</div>
                <div class="level-badge">Level ${level}</div>
                <p><strong>Progress to Level ${level + 1}:</strong> ${progressToNext}/1000 XP</p>
                <p><strong>Projects Completed:</strong> ${transactions.length}</p>
            </div>
        `;
    }
}

// Query 3: NESTED QUERY - Get progress with user information
async function getProjectsData() {
    const query = `
        query {
            progress(where: {userId: {_eq: ${MY_USER_ID}}}) {
                id
                grade
                path
                createdAt
                user {
                    id
                    login
                }
            }
        }
    `;
    
    const result = await queryGraphQL(query);
    
    if (result && result.data && result.data.progress) {
        const progressData = result.data.progress;
        
        // Count passed and failed projects
        let passed = 0;
        let failed = 0;
        
        for (let i = 0; i < progressData.length; i++) {
            if (progressData[i].grade >= 1) {
                passed = passed + 1;
            } else {
                failed = failed + 1;
            }
        }
        
        // Calculate success rate
        const successRate = passed > 0 ? (passed / (passed + failed) * 100).toFixed(1) : 0;
        
        document.getElementById('projects-info').innerHTML = `
            <div class="info-card">
                <h3>Project Statistics</h3>
                <p>✅ <strong>Passed:</strong> ${passed} projects</p>
                <p>❌ <strong>Failed:</strong> ${failed} projects</p>
                <p>📊 <strong>Total:</strong> ${progressData.length} projects</p>
                <p>🎯 <strong>Success Rate:</strong> <span class="audit-ratio">${successRate}%</span></p>
            </div>
        `;
    }
}

// Create the required statistics charts
async function createStatistics() {
    await drawXPChart();
    await drawSuccessChart();
}

// First Chart: XP Progress Over Time (Line Chart)
async function drawXPChart() {
    const query = `
        query {
            transactions(
                where: {userId: {_eq: ${MY_USER_ID}}, type: {_eq: "xp"}}, 
                order_by: {createdAt: asc}
            ) {
                amount
                createdAt
            }
        }
    `;
    
    const result = await queryGraphQL(query);
    
    if (!result || !result.data || !result.data.transactions) {
        return;
    }
    
    const transactions = result.data.transactions;
    const svg = document.getElementById('xp-chart');
    
    // Chart settings
    const width = 400;
    const height = 300;
    const padding = 50;
    
    // Clear the SVG
    svg.innerHTML = '';
    
    // Calculate cumulative XP for each transaction
    let cumulativeXP = 0;
    let points = [];
    
    for (let i = 0; i < transactions.length; i++) {
        cumulativeXP = cumulativeXP + transactions[i].amount;
        points.push({
            index: i,
            xp: cumulativeXP
        });
    }
    
    if (points.length === 0) return;
    
    // Find the maximum XP for scaling
    let maxXP = 0;
    for (let i = 0; i < points.length; i++) {
        if (points[i].xp > maxXP) {
            maxXP = points[i].xp;
        }
    }
    
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', padding);
    xAxis.setAttribute('y1', height - padding);
    xAxis.setAttribute('x2', width - padding);
    xAxis.setAttribute('y2', height - padding);
    xAxis.setAttribute('stroke', '#ccc');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', padding);
    yAxis.setAttribute('y1', padding);
    yAxis.setAttribute('x2', padding);
    yAxis.setAttribute('y2', height - padding);
    yAxis.setAttribute('stroke', '#ccc');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);
    
    // Draw the line chart
    let pathData = '';
    
    for (let i = 0; i < points.length; i++) {
        // Calculate x and y positions
        const x = padding + (points[i].index / (points.length - 1)) * (width - 2 * padding);
        const y = height - padding - (points[i].xp / maxXP) * (height - 2 * padding);
        
        // Build path data
        if (i === 0) {
            pathData = pathData + `M ${x} ${y}`;
        } else {
            pathData = pathData + ` L ${x} ${y}`;
        }
        
        // Add circles for each point
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#007acc');
        svg.appendChild(circle);
    }
    
    // Draw the line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#007acc');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
}

// Second Chart: Project Success Rate (Pie Chart)
async function drawSuccessChart() {
    const query = `
        query {
            progress(where: {userId: {_eq: ${MY_USER_ID}}}) {
                grade
            }
        }
    `;
    
    const result = await queryGraphQL(query);
    
    if (!result || !result.data || !result.data.progress) {
        return;
    }
    
    const progressData = result.data.progress;
    const svg = document.getElementById('success-chart');
    
    // Chart settings
    const size = 300;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 80;
    
    // Clear the SVG
    svg.innerHTML = '';
    
    // Count passed and failed
    let passed = 0;
    let failed = 0;
    
    for (let i = 0; i < progressData.length; i++) {
        if (progressData[i].grade >= 1) {
            passed = passed + 1;
        } else {
            failed = failed + 1;
        }
    }
    
    const total = passed + failed;
    if (total === 0) return;
    
    // Calculate angles
    const passedAngle = (passed / total) * 360;
    const failedAngle = (failed / total) * 360;
    
    // Draw passed slice (green)
    if (passed > 0) {
        const passedPath = createPieSlice(centerX, centerY, radius, 0, passedAngle);
        const passedSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        passedSlice.setAttribute('d', passedPath);
        passedSlice.setAttribute('fill', '#28a745');
        passedSlice.setAttribute('stroke', 'white');
        passedSlice.setAttribute('stroke-width', '2');
        svg.appendChild(passedSlice);
    }
    
    // Draw failed slice (red)
    if (failed > 0) {
        const failedPath = createPieSlice(centerX, centerY, radius, passedAngle, passedAngle + failedAngle);
        const failedSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        failedSlice.setAttribute('d', failedPath);
        failedSlice.setAttribute('fill', '#dc3545');
        failedSlice.setAttribute('stroke', 'white');
        failedSlice.setAttribute('stroke-width', '2');
        svg.appendChild(failedSlice);
    }
    
    // Add legend
    const passedText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    passedText.setAttribute('x', '20');
    passedText.setAttribute('y', '270');
    passedText.setAttribute('fill', '#28a745');
    passedText.setAttribute('font-size', '14');
    passedText.textContent = `✅ Passed: ${passed}`;
    svg.appendChild(passedText);
    
    const failedText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    failedText.setAttribute('x', '180');
    failedText.setAttribute('y', '270');
    failedText.setAttribute('fill', '#dc3545');
    failedText.setAttribute('font-size', '14');
    failedText.textContent = `❌ Failed: ${failed}`;
    svg.appendChild(failedText);
}

// Helper function to create pie slice paths
function createPieSlice(centerX, centerY, radius, startAngle, endAngle) {
    // Convert angles to radians and adjust so 0 degrees is at the top
    const startAngleRad = (startAngle - 90) * Math.PI / 180;
    const endAngleRad = (endAngle - 90) * Math.PI / 180;
    
    // Calculate start and end points
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    // Determine if this is a large arc (> 180 degrees)
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    
    // Create the path data
    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    return pathData;
}