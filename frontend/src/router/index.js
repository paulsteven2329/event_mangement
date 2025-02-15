import { createRouter, createWebHistory } from 'vue-router';

// Import Student Components
import LoginForm from '../components/students/Login.vue';
import RegisterForm from '../components/students/Register.vue';
import DashboardForm from '../components/students/Dashboard.vue';
import ProfileForm from '../components/students/Profile.vue';
import AttendanceForm from '../components/students/Attendance.vue';
import UpcomingEventsForm from '../components/students/UpcomingEvents.vue';
import SettingsForm from '../components/students/Student_Settings.vue';

// Import Volunteer Components
import VolunteerLoginForm from '../components/volunteer/volunteerLoginPage.vue';
import VolunteerRegisterForm from '../components/volunteer/volunteerRegisterPage.vue';
import VolunteerProfileForm from '../components/volunteer/volunteerProfile.vue';
import VolunteerAttendance from '../components/volunteer/VolunteerAttendance.vue';
import VolunteerUpcomingEvents from '../components/volunteer/VolunteerUpcomingEvents.vue';
import VolunteerSettings from '../components/volunteer/VolunteerProfileUpdate.vue';
import VolunteerLiveEvents from '../components/volunteer/VolunteerLiveEvents.vue'
import LeafletMap from '../components/LeafletMap.vue';

// Import Welcome Page Component
import WelcomePage from '../components/WelcomePage.vue'; 

const routes = [
    // Welcome Page (Main landing page with login options)
    { path: '/WelcomePage', component: WelcomePage },
    {path: '/LeafletMap',component:LeafletMap},
    
    // Student Routes
    { path: '/LoginForm', component: LoginForm },
    { path: '/RegisterForm', component: RegisterForm },
    {
      path: '/DashboardForm', 
      component: DashboardForm,
      beforeEnter: (to, from, next) => {
        // Check if student_id exists in localStorage
        if (localStorage.getItem('student_id')) {
          next(); // Allow the user to go to the dashboard
        } else {
          next('/LoginForm'); // Redirect to student login page if not logged in
        }
      },
      children: [
        { path: '/ProfileForm', component: ProfileForm },
        { path: '/AttendenceForm', component: AttendanceForm },
        { path: '/UpcomingEventsForm', component: UpcomingEventsForm },
        { path: '/SettingsForm', component: SettingsForm },
      ]
    },
  
    // Volunteer Routes
    { path: '/VolunteerLoginForm', component: VolunteerLoginForm },
    {
      path: '/VolunteerRegisterForm',
      component: VolunteerRegisterForm,
      beforeEnter: (to, from, next) => {
        // Check if volunteer_id exists in localStorage
        if (localStorage.getItem('volunteer_id')) {
          next(); // Allow the user to go to the dashboard
        } else {
          next('/VolunteerLoginForm'); // Redirect to volunteer login page if not logged in
        }
      },
      children: [
        { path: 'VolunteerLoginForm', component: VolunteerLoginForm },
      ]
    },
    {
      path: '/VolunteerDashboard',
      component: DashboardForm,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('volunteer_id')) {
          next();
        } else {
          next('/VolunteerLoginForm');  // Or any other redirect
        }
      },
      children: [
        { path: '/VolunteerProfileForm', component: VolunteerProfileForm },
        { path: '/VolunteerAttendance', component: VolunteerAttendance },
        { path: '/VolunteerUpcomingEvents', component: VolunteerUpcomingEvents },
        { path: '/VolunteerSettings', component: VolunteerSettings },
        {path:'/VolunteerLiveEvents',component:VolunteerLiveEvents},
      ]
    },
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;
  