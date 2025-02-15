<template>
  <div class="settings-container">
    <header>
      <h2>Update Profile</h2>
    </header>

    <form @submit.prevent="updateProfile" class="settings-form">
      <div class="input-group">
        <label for="first_name">First Name</label>
        <input v-model="profile.first_name" type="text" id="first_name" placeholder="Enter your first name" />
      </div>

      <div class="input-group">
        <label for="last_name">Last Name</label>
        <input v-model="profile.last_name" type="text" id="last_name" placeholder="Enter your last name" />
      </div>

      <div class="input-group">
        <label for="phone_number">Phone Number</label>
        <input v-model="profile.phone_number" type="text" id="phone_number" placeholder="Enter your phone number" />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input v-model="profile.password" type="password" id="password" placeholder="Enter your password" />
      </div>

      <button type="submit" class="submit-btn">Update Profile</button>
    </form>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name:'SettingsForm',
  data() {
    return {
      email: localStorage.getItem('student_email'), // Get email from localStorage
      profile: {
        first_name: '',
        last_name: '',
        phone_number: '',
        password:'',
      }
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        // Use this.email to access the email from data
        const response = await axios.post('http://localhost:3000/student/profile', {
          email: this.email,  // Pass the email from data
        });
        this.profile = response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },
    async updateProfile() {
  try {
    const response = await axios.put('http://localhost:3000/student/update-profile', this.profile, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('student_id')}`
      }
    });
    console.log(response.data);  // Log the response data if needed
    alert('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile');
  }
}

  }
};
</script>

<style scoped>
/* Overall settings container */
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

/* Header */
header {
  text-align: center;
  margin-bottom: 30px;
}

header h2 {
  font-size: 2em;
  color: #4CAF50;
  font-weight: bold;
}

/* Input group styling */
.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group label {
  font-size: 1.1em;
  color: #333;
}

.input-group input {
  padding: 12px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-group input:focus {
  border-color: #4CAF50;
  outline: none;
}

/* Button styling */
.submit-btn {
  padding: 12px;
  font-size: 1.1em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .settings-container {
    padding: 20px;
  }

  .input-group input {
    font-size: 0.95em;
  }

  .submit-btn {
    font-size: 1em;
  }
}
</style>
