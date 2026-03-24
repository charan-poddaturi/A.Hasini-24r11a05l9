requireAuth();

document.addEventListener("DOMContentLoaded", () => {
  searchDonors();
});

async function searchDonors() {
  const bType = document.getElementById("bloodType").value;
  const city = document.getElementById("city").value;
  const status = document.getElementById("searchStatus");
  const list = document.getElementById("donorsList");
  
  status.innerText = "Searching...";
  list.innerHTML = "";

  try {
    let query = "?";
    if (bType) query += `bloodType=${encodeURIComponent(bType)}&`;
    if (city) query += `city=${encodeURIComponent(city)}`;
    
    const donors = await apiCall(`/donors/search${query}`);
    
    if (donors.length === 0) {
      status.innerText = "No donors found for your criteria.";
      return;
    }

    status.innerText = `Found ${donors.length} donors.`;

    donors.forEach(donor => {
      const cityStr = donor.address?.city || 'Unknown City';
      const bTypeStr = donor.bloodType || 'Unknown Type';
      
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <div>
          <strong style="display:block; margin-bottom: 5px;">${donor.name}</strong>
          <span style="color: #666; font-size: 14px;">${bTypeStr} • ${cityStr}</span>
        </div>
        <div>
          <button class="btn" style="padding: 5px 10px; font-size: 14px;" onclick="requestDonor('${donor._id}', '${bTypeStr}')">Request</button>
          ${donor.phone ? `<a href="tel:${donor.phone}" class="btn" style="background:#0f172a; padding: 5px 10px; font-size: 14px;">Call</a>` : ''}
        </div>
      `;
      list.appendChild(div);
    });

  } catch (err) {
    status.innerText = "Error searching donors: " + err.message;
  }
}

async function requestDonor(donorId, bloodType) {
  try {
    await apiCall("/donors/request", {
      method: "POST",
      body: JSON.stringify({ donorId, bloodType })
    });
    alert("Request for blood sent successfully!");
  } catch (e) {
    alert("Failed to send request: " + e.message);
  }
}

async function registerAsDonor() {
  try {
    await apiCall("/donors/register", {
      method: "POST",
      body: JSON.stringify({ bloodType: "O+", isAvailable: true })
    });
    alert("You have been registered as a donor!");
    searchDonors();
  } catch (e) {
    alert("Failed to register: " + e.message);
  }
}
