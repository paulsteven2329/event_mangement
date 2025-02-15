<template>
    <div class="welcome-container">
      <header>
        <div class="logo">
          <h1>Welcome</h1>
          <p>Please select your account type to continue</p>
        </div>
      </header>
  
      <div class="button-container">
        <p>Are you a:</p>
        <div class="login-options">
          <button @click="navigateToLogin('student')" class="login-btn student-btn">Student Login</button>
          <button @click="navigateToLogin('volunteer')" class="login-btn volunteer-btn">Volunteer Login</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WelcomePage',
    methods: {
      navigateToLogin(userType) {
        if (userType === 'student') {
          this.$router.push('/LoginForm');  // Route to the student login page
        } else if (userType === 'volunteer') {
          this.$router.push('/VolunteerLoginForm');  // Route to the volunteer login page
        }
      },
    },
  }
  </script>
  
  <style scoped>
  /* Basic Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* Overall container */
  .welcome-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f4f4f9;
    font-family: Arial, sans-serif;
  }
  
  header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  header .logo h1 {
    font-size: 2.5em;
    color: #4CAF50;
    font-weight: bold;
  }
  
  header .logo p {
    font-size: 1.2em;
    color: #666;
    margin-top: 10px;
    font-weight: normal;
  }
  
  /* Button container */
  .button-container {
    text-align: center;
    background-color: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .button-container p {
    font-size: 1.2em;
    margin-bottom: 20px;
  }
  
  .login-options {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }
  
  .login-btn {
    width: 100%;
    padding: 12px;
    border-radius: 5px;
    font-size: 1.2em;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border: none;
  }
  
  .student-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .volunteer-btn {
    background-color: #3e8e41;
    color: white;
  }
  
  .login-btn:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    .button-container {
      padding: 30px;
      max-width: 90%;
    }
    .login-btn {
      font-size: 1em;
    }
  }
  </style>
  