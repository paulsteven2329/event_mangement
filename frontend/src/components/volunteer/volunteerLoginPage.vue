<template>
    <div class="login-container">
      <header>
        <div class="logo">
          <h1>Volunteer Login</h1>
        </div>
      </header>
  
      <div class="form-container">
        <form @submit.prevent="login" class="login-form">
          <div class="input-group">
            <input 
              v-model="email" 
              type="email" 
              placeholder="Email" 
              required 
              class="input-field"
            />
          </div>
  
          <div class="input-group">
            <input 
              v-model="password" 
              type="password" 
              placeholder="Password" 
              required 
              class="input-field"
            />
          </div>
  
          <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </form>
  
        <p class="register-link">Don't have an account? 
          <router-link to="/register">Register</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'VolunteerLoginForm',
    data() {
      return {
        email: '',
        password: '',
        loading: false,
      };
    },
    methods: {
      async login() {
        this.loading = true; // Start loading state
  
        try {
          const response = await axios.post('http://localhost:3000/volunteer/login', {
            email: this.email,
            password: this.password,
          });
  
          // Check the response to confirm what data is returned
          console.log('Login response:', response.data);  // Log the entire response for debugging
  
          if (response.data.message === 'Login successful!') {
            // Store volunteer_id and email in localStorage
            localStorage.setItem('volunteer_id', response.data.volunteer_id);
            localStorage.setItem('volunteer_email', this.email);  // Store email here
            console.log('Stored email in localStorage:', this.email); // Check if email is saved
  
            // Redirect to the volunteer dashboard or profile page
            this.$router.push('/VolunteerDashboard');
          } else {
            alert('Login failed');
          }
        } catch (error) {
          console.error('Login error:', error); // Log any error from the login request
          alert('Login failed');
        } finally {
          this.loading = false; // Reset loading state
        }
      },
    },
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
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f4f4f9;
  }
  
  /* Header */
  header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  header .logo h1 {
    font-size: 2em;
    color: #4CAF50;
    font-weight: bold;
  }
  
  /* Form container */
  .form-container {
    background-color: white;
    padding: 30px 40px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .login-form .input-group {
    margin-bottom: 20px;
  }
  
  .input-field {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
    outline: none;
    transition: border-color 0.3s ease;
  }
  
  .input-field:focus {
    border-color: #4CAF50;
  }
  
  .submit-btn {
    width: 100%;
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.2em;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-btn:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  
  .submit-btn:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  .register-link {
    text-align: center;
    margin-top: 20px;
  }
  
  .register-link router-link {
    color: #4CAF50;
    font-weight: bold;
    text-decoration: none;
  }
  
  .register-link router-link:hover {
    text-decoration: underline;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .form-container {
      padding: 20px;
      max-width: 100%;
    }
  }
  </style>
  