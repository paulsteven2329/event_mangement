<template>
    <div class="dashboard">
      <header>
        <div class="logo">
          <h1>Student Dashboard</h1>
        </div>
        <div class="greeting">
          <p>Welcome to your dashboard!</p>
        </div>
        <!-- Logout Button -->
        <button class="logout-btn" @click="logout">Logout</button>
      </header>
  
      <div class="main-container">
        <!-- Sidebar / Navigation -->
        <nav class="sidebar">
          <router-link to="/ProfileForm" class="nav-link">Profile</router-link>
          <router-link to="/AttendenceForm" class="nav-link">Attendance</router-link>
          <router-link to="/UpcomingEventsForm" class="nav-link">Upcoming Events</router-link>
          <router-link to="/SettingsForm" class="nav-link">Settings</router-link>
        </nav>
  
        <!-- Content Area -->
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardForm',
    data() {
      return {
        email: localStorage.getItem('student_email'), // Get the email from localStorage
      };
    },
    methods: {
      logout() {
        // Clear the student email from localStorage
        localStorage.removeItem('student_email');
  
        // Redirect the user to the login page
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Basic Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* Overall container */
  .dashboard {
    font-family: 'Arial', sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  /* Header */
  header {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  /* Logo */
  header .logo h1 {
    font-size: 1.8em;
  }
  
  /* Greeting */
  header .greeting p {
    font-size: 1.1em;
  }
  
  /* Logout Button */
  .logout-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  .logout-btn:hover {
    background-color: #c0392b;
  }
  
  /* Main container with sidebar */
  .main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  /* Sidebar */
  .sidebar {
    width: 250px;
    background-color: #2C3E50;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .sidebar .nav-link {
    color: white;
    text-decoration: none;
    padding: 10px 0;
    font-size: 1.2em;
    transition: background-color 0.3s ease;
  }
  
  .sidebar .nav-link:hover {
    background-color: #34495E;
    padding-left: 10px;
  }
  
  /* Content area */
  .content {
    flex: 1;
    padding: 20px;
    background-color: #ECF0F1;
  }
  
  @media (max-width: 768px) {
    /* Mobile view adjustments */
    .main-container {
      flex-direction: column;
    }
  
    .sidebar {
      width: 100%;
      display: flex;
      justify-content: space-around;
      padding: 10px 0;
    }
  
    .sidebar .nav-link {
      font-size: 1.1em;
    }
  }
  </style>
  