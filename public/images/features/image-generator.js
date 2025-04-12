import fs from 'fs';

// Create event dashboard image (emerald theme)
const eventDashboard = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: bold 24px sans-serif; fill: white; }
    .subtitle { font: 16px sans-serif; fill: white; }
    .heading { font: bold 18px sans-serif; fill: #111827; }
    .stat-label { font: 14px sans-serif; fill: #6B7280; }
    .stat-value { font: bold 20px sans-serif; fill: #111827; }
    .table-heading { font: bold 12px sans-serif; fill: #374151; }
    .table-data { font: 12px sans-serif; fill: #111827; }
  </style>
  
  <!-- Header -->
  <rect width="600" height="60" fill="#059669"/>
  <text x="20" y="38" class="title">Specyf</text>
  <text x="100" y="38" class="subtitle">Event Dashboard</text>
  
  <!-- Main content -->
  <rect y="60" width="600" height="340" fill="white"/>
  <text x="20" y="90" class="heading">Annual Tech Conference 2023</text>
  
  <!-- Stat cards -->
  <rect x="20" y="110" width="170" height="70" rx="4" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1"/>
  <text x="30" y="135" class="stat-label">Total Guests</text>
  <text x="30" y="160" class="stat-value">248</text>
  
  <rect x="210" y="110" width="170" height="70" rx="4" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1"/>
  <text x="220" y="135" class="stat-label">Confirmed</text>
  <text x="220" y="160" class="stat-value">183</text>
  
  <rect x="400" y="110" width="170" height="70" rx="4" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1"/>
  <text x="410" y="135" class="stat-label">Pending</text>
  <text x="410" y="160" class="stat-value">65</text>
  
  <!-- Table -->
  <rect x="20" y="200" width="560" height="120" rx="4" fill="white" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="20" y="200" width="560" height="30" rx="4 4 0 0" fill="#f9fafb"/>
  <text x="30" y="220" class="table-heading">Name</text>
  <text x="150" y="220" class="table-heading">Email</text>
  <text x="350" y="220" class="table-heading">Status</text>
  <text x="480" y="220" class="table-heading">Action</text>
  
  <!-- Buttons -->
  <rect x="20" y="340" width="120" height="40" rx="4" fill="#059669"/>
  <text x="45" y="365" class="subtitle">Add Guests</text>
  
  <rect x="160" y="340" width="180" height="40" rx="4" fill="white" stroke="#059669" stroke-width="1"/>
  <text x="180" y="365" style="font: 16px sans-serif; fill: #059669;">Send Announcements</text>
</svg>`;

// Create organizer tools image (blue theme)
const organizerTools = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: bold 24px sans-serif; fill: white; }
    .subtitle { font: 16px sans-serif; fill: white; }
    .heading { font: bold 18px sans-serif; fill: #111827; }
    .stat-label { font: 14px sans-serif; fill: #6B7280; }
    .stat-value { font: bold 20px sans-serif; fill: #111827; }
    .table-heading { font: bold 12px sans-serif; fill: #374151; }
    .table-data { font: 12px sans-serif; fill: #111827; }
  </style>
  
  <!-- Header -->
  <rect width="600" height="60" fill="#2563eb"/>
  <text x="20" y="38" class="title">Specyf</text>
  <text x="100" y="38" class="subtitle">Organizer Tools</text>
  
  <!-- Main content -->
  <rect y="60" width="600" height="340" fill="white"/>
  <text x="20" y="90" class="heading">Team Collaboration</text>
  
  <!-- Stat cards -->
  <rect x="20" y="110" width="170" height="70" rx="4" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
  <text x="30" y="135" class="stat-label">Team Members</text>
  <text x="30" y="160" class="stat-value">8</text>
  
  <rect x="210" y="110" width="170" height="70" rx="4" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
  <text x="220" y="135" class="stat-label">Tasks</text>
  <text x="220" y="160" class="stat-value">24</text>
  
  <rect x="400" y="110" width="170" height="70" rx="4" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
  <text x="410" y="135" class="stat-label">Completed</text>
  <text x="410" y="160" class="stat-value">16</text>
  
  <!-- Table -->
  <rect x="20" y="200" width="560" height="120" rx="4" fill="white" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="20" y="200" width="560" height="30" rx="4 4 0 0" fill="#f9fafb"/>
  <text x="30" y="220" class="table-heading">Task</text>
  <text x="200" y="220" class="table-heading">Assigned To</text>
  <text x="350" y="220" class="table-heading">Due Date</text>
  <text x="480" y="220" class="table-heading">Status</text>
  
  <!-- Buttons -->
  <rect x="20" y="340" width="140" height="40" rx="4" fill="#2563eb"/>
  <text x="35" y="365" class="subtitle">Assign New Task</text>
  
  <rect x="180" y="340" width="140" height="40" rx="4" fill="white" stroke="#2563eb" stroke-width="1"/>
  <text x="195" y="365" style="font: 16px sans-serif; fill: #2563eb;">Team Schedule</text>
</svg>`;

// Create analytics dashboard image (purple theme)
const analyticsDashboard = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: bold 24px sans-serif; fill: white; }
    .subtitle { font: 16px sans-serif; fill: white; }
    .heading { font: bold 18px sans-serif; fill: #111827; }
    .stat-label { font: 14px sans-serif; fill: #6B7280; }
    .stat-value { font: bold 20px sans-serif; fill: #111827; }
    .chart-title { font: bold 14px sans-serif; fill: #111827; }
  </style>
  
  <!-- Header -->
  <rect width="600" height="60" fill="#9333ea"/>
  <text x="20" y="38" class="title">Specyf</text>
  <text x="100" y="38" class="subtitle">Analytics Dashboard</text>
  
  <!-- Main content -->
  <rect y="60" width="600" height="340" fill="white"/>
  <text x="20" y="90" class="heading">Annual Tech Conference 2023</text>
  
  <!-- Stat cards -->
  <rect x="20" y="110" width="130" height="70" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-width="1"/>
  <text x="30" y="135" class="stat-label">Total Guests</text>
  <text x="30" y="160" class="stat-value">248</text>
  
  <rect x="160" y="110" width="130" height="70" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-width="1"/>
  <text x="170" y="135" class="stat-label">Response Rate</text>
  <text x="170" y="160" class="stat-value">92%</text>
  
  <rect x="300" y="110" width="130" height="70" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-width="1"/>
  <text x="310" y="135" class="stat-label">Engagement</text>
  <text x="310" y="160" class="stat-value">78%</text>
  
  <rect x="440" y="110" width="130" height="70" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-width="1"/>
  <text x="450" y="135" class="stat-label">Satisfaction</text>
  <text x="450" y="160" class="stat-value">4.8/5</text>
  
  <!-- Charts -->
  <rect x="20" y="200" width="270" height="120" rx="4" fill="white" stroke="#e5e7eb" stroke-width="1"/>
  <text x="30" y="220" class="chart-title">RSVP Responses</text>
  
  <!-- Pie chart representation -->
  <circle cx="150" cy="260" r="40" fill="none" stroke="#22c55e" stroke-width="10"/>
  <path d="M 150 260 L 150 220 A 40 40 0 0 1 185 245 Z" fill="#eab308"/>
  <path d="M 150 260 L 185 245 A 40 40 0 0 1 165 295 Z" fill="#ef4444"/>
  
  <rect x="300" y="200" width="270" height="120" rx="4" fill="white" stroke="#e5e7eb" stroke-width="1"/>
  <text x="310" y="220" class="chart-title">Registration Timeline</text>
  
  <!-- Bar chart representation -->
  <rect x="320" y="270" width="20" height="30" fill="#9333ea"/>
  <rect x="350" y="255" width="20" height="45" fill="#9333ea"/>
  <rect x="380" y="240" width="20" height="60" fill="#9333ea"/>
  <rect x="410" y="225" width="20" height="75" fill="#9333ea"/>
  <rect x="440" y="210" width="20" height="90" fill="#9333ea"/>
  <rect x="470" y="190" width="20" height="110" fill="#9333ea"/>
  <rect x="500" y="220" width="20" height="80" fill="#9333ea"/>
  <rect x="530" y="235" width="20" height="65" fill="#9333ea"/>
  
  <!-- Buttons -->
  <rect x="20" y="340" width="120" height="40" rx="4" fill="#9333ea"/>
  <text x="35" y="365" class="subtitle">Export Report</text>
  
  <rect x="160" y="340" width="120" height="40" rx="4" fill="white" stroke="#9333ea" stroke-width="1"/>
  <text x="175" y="365" style="font: 16px sans-serif; fill: #9333ea;">Share Insights</text>
</svg>`;

// Write files
try {
  fs.writeFileSync('event-dashboard.svg', eventDashboard);
  fs.writeFileSync('organizer-tools.svg', organizerTools);
  fs.writeFileSync('analytics-dashboard.svg', analyticsDashboard);
  console.log('Generated SVG images in public/images/features/ directory');
} catch (err) {
  console.error('Error writing files:', err);
} 