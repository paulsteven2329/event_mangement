<template>
  <div class="events-container">
    <header>
      <div class="logo">
        <h2>Upcoming Events</h2>
      </div>
    </header>

    <div class="events-content">
      <div v-if="events.length > 0">
        <ul class="events-list">
          <li v-for="event in events" :key="event.event_id" class="event-item">
            <div class="event-card">
              <div class="event-title">
                <strong>{{ event.event_name }}</strong>
              </div>
              <div class="event-description">
                <p>{{ event.event_description }}</p>
              </div>
              <div class="event-datetime">
                <em>{{ event.event_date }} at {{ event.event_time }}</em>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="no-events">No upcoming events found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    name:'VolunteerUpcomingEvents',
  data() {
    return {
      events: []
    };
  },
  created() {
    this.fetchUpcomingEvents();
  },
  methods: {
    async fetchUpcomingEvents() {
      try {
        const email = localStorage.getItem('volunteer_email'); // Get email from localStorage

        if (!email) {
          alert('No email found in localStorage');
          return;
        }

        // Send the GET request to fetch events specific to the volunteer
        const response = await axios.get('http://localhost:3000/volunteer/upcoming-events', {
          headers: {
            'Authorization': `Bearer ${email}`, // If needed, pass email via headers or authorization token
          }
        });

        if (response.data.status === 'success') {
          this.events = response.data.data; // Set the events data
        } else {
          alert('No upcoming events found');
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Overall container */
.events-container {
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

/* Events content */
.events-content {
  background-color: white;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
}

.events-list {
  list-style-type: none;
  padding: 0;
}

.event-item {
  margin-bottom: 20px;
}

.event-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.event-title {
  font-size: 1.5em;
  color: #333;
}

.event-description {
  margin-top: 10px;
  font-size: 1.1em;
  color: #555;
}

.event-datetime {
  margin-top: 10px;
  font-size: 1em;
  color: #777;
}

/* No events found message */
.no-events {
  text-align: center;
  font-size: 1.2em;
  color: #888;
}

/* Responsive design */
@media (max-width: 768px) {
  .events-content {
    padding: 20px;
    width: 100%;
  }

  .event-title {
    font-size: 1.2em;
  }

  .event-description {
    font-size: 1em;
  }

  .event-datetime {
    font-size: 0.9em;
  }
}
</style>
