// API Base URL
const API_URL = 'http://localhost:5000/api';

// Check admin authentication
function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Load Leadership Positions
async function loadLeadershipPositions() {
    try {
        const response = await fetch(`${API_URL}/leadership`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const positions = await response.json();
        
        const positionsContainer = document.getElementById('leadership-positions');
        positionsContainer.innerHTML = positions.map(position => `
            <div class="leadership-item">
                <h4>${position.position}</h4>
                <p>Current Leader: ${position.currentLeader.name}</p>
                <p>Start Date: ${new Date(position.currentLeader.startDate).toLocaleDateString()}</p>
                <button onclick="editLeadership('${position._id}')" class="btn secondary">Edit</button>
                <button onclick="deleteLeadership('${position._id}')" class="btn danger">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading leadership positions:', error);
    }
}

// Handle Leadership Form Submission
document.getElementById('leadership-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        position: formData.get('position'),
        currentLeader: {
            name: formData.get('currentLeader.name'),
            image: formData.get('currentLeader.image'),
            startDate: formData.get('currentLeader.startDate')
        },
        pastLeaders: Array.from(document.querySelectorAll('.past-leader-item')).map(item => ({
            name: item.dataset.name,
            startDate: item.dataset.startDate,
            endDate: item.dataset.endDate
        }))
    };

    try {
        const response = await fetch(`${API_URL}/leadership`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Leadership position saved successfully');
            loadLeadershipPositions();
            e.target.reset();
            document.getElementById('past-leaders-list').innerHTML = '';
        } else {
            alert('Error saving leadership position');
        }
    } catch (error) {
        console.error('Error saving leadership position:', error);
    }
});

// Add Past Leader
function addPastLeader() {
    const name = document.querySelector('.past-leader-name').value;
    const startDate = document.querySelector('.past-leader-start').value;
    const endDate = document.querySelector('.past-leader-end').value;

    if (!name || !startDate || !endDate) {
        alert('Please fill in all fields');
        return;
    }

    const pastLeadersList = document.getElementById('past-leaders-list');
    const leaderItem = document.createElement('div');
    leaderItem.className = 'past-leader-item';
    leaderItem.dataset.name = name;
    leaderItem.dataset.startDate = startDate;
    leaderItem.dataset.endDate = endDate;
    
    leaderItem.innerHTML = `
        <span>${name} (${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()})</span>
        <button onclick="this.parentElement.remove()" class="btn danger">Remove</button>
    `;

    pastLeadersList.appendChild(leaderItem);

    // Clear inputs
    document.querySelector('.past-leader-name').value = '';
    document.querySelector('.past-leader-start').value = '';
    document.querySelector('.past-leader-end').value = '';
}

// Load Members
async function loadMembers() {
    try {
        const response = await fetch(`${API_URL}/members`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const members = await response.json();
        
        const membersTable = document.getElementById('members-table');
        membersTable.innerHTML = members.map(member => `
            <tr>
                <td>${member.fullname}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${member.role}</td>
                <td>
                    <button onclick="editMember('${member._id}')" class="btn secondary">Edit</button>
                    <button onclick="deleteMember('${member._id}')" class="btn danger">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

// Handle Settings Form Submission
document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Settings saved successfully');
        } else {
            alert('Error saving settings');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
    }
});

// Navigation
document.querySelectorAll('.admin-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('href').substring(1);
        
        // Update active link
        document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show target section
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(target).style.display = 'block';
    });
});

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize
checkAdminAuth();
loadLeadershipPositions();
loadMembers(); 