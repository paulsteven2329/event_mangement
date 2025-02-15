// src/components/LeafletMap.vue

<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script>
import { onMounted } from "vue";
import L from "leaflet";

export default {
  name: "LeafletMap",
  setup() {
    // Initialize the map once the component is mounted
    onMounted(() => {
      const map = L.map("map").setView([51.505, -0.09], 13); // Latitude, Longitude, Zoom Level

      // Add tile layer from OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add a marker
      L.marker([51.5, -0.09]).addTo(map)
        .bindPopup("A sample marker")
        .openPopup();
    });
  },
};
</script>

<style>
#map {
  height: 100%; /* Make sure the map takes full height */
}
</style>
