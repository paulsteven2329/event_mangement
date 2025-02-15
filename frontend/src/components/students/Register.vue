<template>
    <div class="register-container">
      <header>
        <div class="logo">
          <h1>Register</h1>
        </div>
      </header>
  
      <div class="form-container">
        <form @submit.prevent="register" class="register-form">
          <div class="input-group">
            <input 
              v-model="first_name" 
              type="text" 
              placeholder="First Name" 
              required 
              class="input-field"
            />
          </div>
  
          <div class="input-group">
            <input 
              v-model="last_name" 
              type="text" 
              placeholder="Last Name" 
              required 
              class="input-field"
            />
          </div>
  
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
  
          <div class="input-group">
            <input 
              v-model="phone_number" 
              type="text" 
              placeholder="Phone Number" 
              class="input-field"
            />
          </div>
  
          <div class="input-group">
            <input 
              v-model="location_latitude" 
              type="text" 
              placeholder="Latitude" 
              class="input-field"
            />
          </div>
  
          <div class="input-group">
            <input 
              v-model="location_longitude" 
              type="text" 
              placeholder="Longitude" 
              class="input-field"
            />
          </div>
  
          <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="loading">Registering...</span>
            <span v-else>Register</span>
          </button>
        </form>
  
        <!-- Error Message -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  
        <p class="login-link">Already have an account? 
          <router-link to="/login">Login</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'RegisterForm',
    data() {
      return {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        location_latitude: '',
        location_longitude: '',
        errorMessage: '',
        loading: false, // Add loading state for form submission
      };
    },
    methods: {
      // Register function
      async register() {
        this.loading = true; // Start loading state
  
        // Basic frontend validation
        if (!this.first_name || !this.last_name || !this.email || !this.password) {
          this.errorMessage = "First name, last name, email, and password are required!";
          this.loading = false;
          return;
        }
  
        // Check if the email already exists
        const emailExists = await this.checkIfEmailExists(this.email);
        if (emailExists) {
          this.errorMessage = "This email is already registered!";
          this.loading = false;
          return;
        }
  
        // Send registration request to backend
        try {
          const response = await axios.post('http://localhost:3000/student/register', {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            password: this.password,
            phone_number: this.phone_number,
            location_latitude: this.location_latitude,
            location_longitude: this.location_longitude,
          });
  
          if (response.status === 201) {
            // Registration successful, clear form
            this.first_name = '';
            this.last_name = '';
            this.email = '';
            this.password = '';
            this.phone_number = '';
            this.location_latitude = '';
            this.location_longitude = '';
            
            // Redirect to login page or any other page after registration
            this.$router.push('/login');
          }
        } catch (error) {
          // Handle errors from backend
          if (error.response && error.response.data) {
            this.errorMessage = error.response.data.message || 'Registration failed';
          } else {
            this.errorMessage = 'Registration failed due to a server error';
          }
        } finally {
          this.loading = false; // Reset loading state after the request is complete
        }
      },
  
      // Check if email already exists
      async checkIfEmailExists(email) {
        try {
          const response = await axios.get(`http://localhost:3000/student/email-check?email=${email}`);
          return response.data.exists; // Assuming backend returns a response with exists: true/false
        } catch (error) {
          return false; // If check fails, assume email is not taken
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
  .register-container {
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
  
  .register-form .input-group {
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
  
  .error-message {
    color: red;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
  
  .login-link {
    text-align: center;
    margin-top: 20px;
  }
  
  .login-link router-link {
    color: #4CAF50;
    font-weight: bold;
    text-decoration: none;
  }
  
  .login-link router-link:hover {
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
  