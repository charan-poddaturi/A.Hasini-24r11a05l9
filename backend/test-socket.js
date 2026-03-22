const axios = require("axios");
const io = require("socket.io-client");

const API_URL = "http://localhost:4000/api";
const SOCKET_URL = "http://localhost:4000";

async function testRealtime() {
  try {
    // 1. Create User A
    const aData = { name: "Test User A", email: `usera_${Date.now()}@test.com`, password: "passwordA" };
    const resA = await axios.post(`${API_URL}/auth/register`, aData);
    const tokenA = resA.data.token;
    const userA = resA.data.user;

    // 2. Create User B (Donor & Contact)
    const phoneB = "1234567890";
    const bData = { name: "Test User B", email: `userb_${Date.now()}@test.com`, password: "passwordB" };
    const resB = await axios.post(`${API_URL}/auth/register`, bData);
    const tokenB = resB.data.token;
    const userB = resB.data.user;

    // Update B's profile to add phone
    await axios.put(`${API_URL}/users/profile`, { phone: phoneB, isDonor: true, bloodType: "O+" }, { headers: { Authorization: `Bearer ${tokenB}` } });
    
    // Register B as donor
    await axios.post(`${API_URL}/donors/register`, { bloodType: "O+", isAvailable: true }, { headers: { Authorization: `Bearer ${tokenB}` } });

    // 3. User A adds User B as Emergency Contact
    await axios.post(`${API_URL}/users/emergency-contacts`, { name: userB.name, relation: "Friend", phone: phoneB }, { headers: { Authorization: `Bearer ${tokenA}` } });
    
    // Make contact verified for sos (backend uses contact.isVerified)
    // Actually the backend model defaults to false, we might need a DB update or the socket event won't trigger if isVerified is false!
    // Wait, let's verify if `isVerified` is required in backend.
    
    // Let's check socket event firing for DONOR first
    const socketB = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token: tokenB }
    });

    socketB.on("connect", () => {
      console.log("Socket B connected");
      socketB.emit("join", userB.id);
      socketB.emit("join", phoneB); // Join phone room like the frontend would!
    });

    let donorPassed = false;
    let sosPassed = false;

    socketB.on("donor:request", (data) => {
      console.log("✅ Received donor:request event on Socket B:", data);
      donorPassed = true;
    });

    socketB.on("sos:triggered", (data) => {
      console.log("✅ Received sos:triggered event on Socket B:", data);
      sosPassed = true;
    });

    // Wait a sec for socket connection
    await new Promise(r => setTimeout(r, 1000));

    // 4. User A requests User B as donor
    console.log("User A requesting User B as donor...");
    await axios.post(`${API_URL}/donors/request`, { donorId: userB.id, bloodType: "O+" }, { headers: { Authorization: `Bearer ${tokenA}` } });

    // 5. User A triggers SOS
    console.log("User A triggering SOS...");
    await axios.post(`${API_URL}/sos/trigger`, { lat: 10, lng: 20 }, { headers: { Authorization: `Bearer ${tokenA}` } });

    await new Promise(r => setTimeout(r, 2000));

    if (donorPassed && sosPassed) {
      console.log("🎉 All real-time tests PASSED!");
    } else {
      console.log("❌ Real-time tests FAILED. Donor:", donorPassed, "SOS:", sosPassed);
    }
    
    process.exit(donorPassed && sosPassed ? 0 : 1);
  } catch (err) {
    if (err.response) {
      console.error("Test failed with API Error:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Test failed with error:", err.message);
    }
    process.exit(1);
  }
}

testRealtime();
