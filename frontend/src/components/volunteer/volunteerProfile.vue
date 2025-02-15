<template>
    <div class="profile-container">
      <header>
        <div class="logo">
          <h2>Your Profile</h2>
        </div>
      </header>
  
      <div class="profile-content">
        <!-- Display profile if fetched successfully -->
        <div v-if="profile">
          <div class="profile-item">
            <strong>First Name:</strong> {{ profile.first_name }}
          </div>
          <div class="profile-item">
            <strong>Last Name:</strong> {{ profile.last_name }}
          </div>
          <div class="profile-item">
            <strong>Email:</strong> {{ profile.email }}
          </div>
          <div class="profile-item">
            <strong>Phone Number:</strong> {{ profile.phone_number }}
          </div>
          <div class="profile-item">
            <strong>Location:</strong> {{ profile.location_latitude }}, {{ profile.location_longitude }}
          </div>
          <div class="profile-item">
            <strong>Volunteer Experience:</strong> {{ profile.volunteer_experience }}
          </div>
        </div>
  
        <!-- Show loading message while fetching -->
        <div v-else-if="loading">
          <p class="loading-message">Loading your profile...</p>
        </div>
  
        <!-- Show error message if fetching failed -->
        <div v-else-if="errorMessage">
          <p class="error-message">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'VolunteerProfileForm',
    data() {
      return {
        profile: null,
        loading: true, // Flag to indicate loading state
        errorMessage: null, // To store error message
      };
    },
    created() {
      this.fetchProfile();
    },
    methods: {
      async fetchProfile() {
        const email = localStorage.getItem('volunteer_email');  // Retrieve email from localStorage
  
        if (!email) {
          alert('Email is not available');
          return;
        }
  
        this.loading = true;  // Set loading state
  
        try {
          const response = await axios.post('http://localhost:3000/volunteer/profile', {
            email: email,  // Send email in the request body
          });
  
          if (response.data.status === 'success') {
            // Handle the successful profile retrieval
            console.log('Profile Data:', response.data.data);
  
            // Store profile data to display
            this.profile = response.data.data;
          } else {
            this.errorMessage = 'Failed to retrieve profile';
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          this.errorMessage = 'An error occurred while fetching profile';
        } finally {
          this.loading = false;  // Reset loading state
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Overall container */
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f4f4f9;
    padding: 20px;
  }
  
  header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  header .logo h2 {
    font-size: 2em;
    color: #4CAF50;
    font-weight: bold;
  }
  
  /* Profile content */
  .profile-content {
    background-color: white;
    padding: 30px 40px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
  }
  
  .profile-item {
    font-size: 1.1em;
    margin-bottom: 10px;
  }
  
  .profile-item strong {
    font-weight: bold;
    color: #333;
  }
  
  /* Loading message */
  .loading-message {
    text-align: center;
    font-size: 1.2em;
    color: #777;
  }
  
  /* Error message */
  .error-message {
    text-align: center;
    font-size: 1.2em;
    color: red;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .profile-content {
      padding: 20px;
      width: 100%;
    }
  
    .profile-item {
      font-size: 1em;
    }
  }
  </style>
  