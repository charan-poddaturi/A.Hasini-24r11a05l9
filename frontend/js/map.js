requireAuth();

let map;
let markerLayer;
let userMarker;
let userPos = null;

document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("mapStatus");
  
  // Check geolocation
  if (!navigator.geolocation) {
    status.innerText = "Geolocation not supported by your browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    userPos = [position.coords.latitude, position.coords.longitude];
    status.innerText = "Location found. You can filter for nearby services.";
    initMap();
    fetchNearby();
  }, () => {
    status.innerText = "Location access denied. Centering on default location.";
    userPos = [21.1466, 79.0889]; // Default: Nagpur
    initMap();
    fetchNearby();
  }, { enableHighAccuracy: true });
});

function initMap() {
  map = L.map('map').setView(userPos, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  userMarker = L.marker(userPos).addTo(map)
    .bindPopup('<b>Your Location</b>').openPopup();

  // Create layer group for dynamic markers
  markerLayer = L.layerGroup().addTo(map);
  
  // Add a 5km radius circle
  L.circle(userPos, {
    color: 'blue',
    fillColor: '#30f',
    fillOpacity: 0.1,
    radius: 5000
  }).addTo(map);
}

async function fetchNearby() {
  if (!userPos || !map) return;
  const category = document.getElementById("categoryFilter").value;
  const status = document.getElementById("mapStatus");
  
  status.innerText = "Fetching nearby " + category + "s...";
  
  try {
    const data = await apiCall(`/nearby/${category}?lat=${userPos[0]}&lng=${userPos[1]}&radius=5000`);
    
    // Clear old markers
    markerLayer.clearLayers();
    
    data.forEach(place => {
      const popupContent = `
        <b>${place.name}</b><br>
        ${place.address}<br>
        ${place.phone ? `Call: ${place.phone}<br>` : ''}
        <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" target="_blank">Directions</a>
      `;
      L.marker([place.lat, place.lng]).addTo(markerLayer).bindPopup(popupContent);
    });
    
    status.innerText = `Found ${data.length} nearby ${category}(s).`;
  } catch (err) {
    status.innerText = "Failed to load: " + err.message;
  }
}
