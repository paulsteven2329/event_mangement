<template>
    <div>
      <div v-if="loading">
        <p>Loading attendance records...</p>
        <!-- Add a simple loading spinner -->
        <div class="spinner"></div>
      </div>
  
      <div v-else>
        <div v-if="attendance.length">
          <h2>Volunteer Attendance Records</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Volunteer Name</th>
                <th>Attendance Status</th>
                <th>Attended At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in attendance" :key="record.attendance_id">
                <td>{{ record.event_name }}</td>
                <td>{{ record.volunteer_name }}</td>
                <td>{{ record.attendance_status }}</td>
                <td>{{ new Date(record.attended_at).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div v-else>
          <p>No attendance records found.</p>
        </div>
  
        <!-- Error Message Section -->
        <div v-if="error" class="error">
          <p>{{ error }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'VolunteerAttendance',
  
    data() {
      return {
        attendance: [],
        email: localStorage.getItem('volunteer_email') || '',  // Assuming the email is saved in localStorage
        loading: false,
        error: '',  // Store error messages
      };
    },
    
    methods: {
      async fetchAttendance() {
        this.loading = true;
        this.error = '';  // Reset error message before fetching new data
    
        try {
          const response = await axios.post('http://localhost:3000/volunteer/attendance-by-email', {
            email: this.email, // Send the volunteer email
          });
    
          if (response.data.status === 'success') {
            this.attendance = response.data.data; // Set the attendance data
          } else {
            this.error = 'No attendance records found.';
          }
        } catch (error) {
          console.error('Error fetching attendance:', error);
          this.error = 'An error occurred while fetching attendance. Please try again later.';
        } finally {
          this.loading = false;
        }
      },
    },
  
    created() {
      if (this.email) {
        this.fetchAttendance(); // Fetch attendance when the component is created
      } else {
        this.error = 'No email found in localStorage. Please log in again.';
      }
    },
  };
  </script>
  
  <style scoped>
  /* Add custom styles for the table */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  .spinner {
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    margin: 20px auto;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error {
    color: red;
    font-weight: bold;
    margin-top: 20px;
  }
  </style>
  