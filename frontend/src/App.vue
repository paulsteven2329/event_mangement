<template>
  <div>
    <router-view></router-view>
    <!-- Check if logged in, if not, show the map -->
    <LeafletMap v-if="isLoggedIn" />
  </div>
</template>

<script>
import LeafletMap from './components/LeafletMap.vue';  // Import the LeafletMap component

export default {
  data() {
    return {
      isLoggedIn: false,  // Track login state
    };
  },
  created() {
    // Check if user is already logged in (e.g., by checking localStorage)
    if (localStorage.getItem('student_email')) {
      this.isLoggedIn = true;  // Set isLoggedIn to true
      this.$router.push('/WelcomePage');  // Redirect to the Welcome page
    }
  },
  components: {
    LeafletMap,  // Register LeafletMap component
  },
};
</script>
