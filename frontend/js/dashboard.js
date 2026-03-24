// Ensure user is authenticated
requireAuth();

// Initialize Socket connection
const token = getToken();
const socket = io("http://localhost:4000", {
  auth: { token: token },
  withCredentials: true
});

socket.on("connect", () => {
  console.log("Connected to Real-time SOS Server");
});

socket.on("sos:triggered", (data) => {
  alert(`EMERGENCY: ${data.user.name} triggered an SOS!\nPhone: ${data.user.phone}`);
});

function triggerSOS() {
  const sosBtn = document.getElementById("sosBtn");
  const status = document.getElementById("sosStatus");
  
  if (!navigator.geolocation) {
    status.innerText = "Geolocation not supported by browser.";
    return;
  }

  sosBtn.disabled = true;
  sosBtn.innerText = "WAIT...";
  status.innerText = "Locating you...";

  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const payload = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      status.innerText = "Sending SOS signal...";
      
      const res = await apiCall("/sos/trigger", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
      status.innerText = "SOS sent successfully! Contacts notified.";
      sosBtn.innerText = "SENT";
      sosBtn.style.backgroundColor = "green";
      
    } catch (err) {
      status.innerText = "Failed to send SOS: " + err.message;
      sosBtn.disabled = false;
      sosBtn.innerText = "SOS";
    }
  }, (err) => {
    status.innerText = "Location access denied or failed.";
    sosBtn.disabled = false;
    sosBtn.innerText = "SOS";
  }, { enableHighAccuracy: true });
}
