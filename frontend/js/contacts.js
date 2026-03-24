requireAuth();

document.addEventListener("DOMContentLoaded", () => {
  loadContacts();
});

async function loadContacts() {
  const list = document.getElementById("contactsList");
  
  try {
    const profile = await apiCall("/users/profile");
    const contacts = profile.emergencyContacts || [];
    
    if (contacts.length === 0) {
      list.innerHTML = "<p>No emergency contacts added yet.</p>";
      return;
    }

    list.innerHTML = "";
    contacts.forEach(contact => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <div>
          <strong style="display:block; margin-bottom:5px;">${contact.name}</strong>
          <span style="color: #666; font-size: 14px;">${contact.relation} • ${contact.phone}</span>
        </div>
        <button class="btn btn-danger" style="width: auto; padding: 5px 15px;" onclick="deleteContact('${contact._id}')">Remove</button>
      `;
      list.appendChild(div);
    });
  } catch (e) {
    list.innerHTML = `<p style="color:red">Failed to load contacts: ${e.message}</p>`;
  }
}

document.getElementById("addContactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const payload = {
    name: document.getElementById("contactName").value,
    relation: document.getElementById("contactRelation").value,
    phone: document.getElementById("contactPhone").value
  };

  try {
    await apiCall("/users/emergency-contacts", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    
    document.getElementById("addContactForm").reset();
    loadContacts();
  } catch (err) {
    alert("Failed to add contact: " + err.message);
  }
});

async function deleteContact(id) {
  if (!confirm("Remove this emergency contact?")) return;

  try {
    await apiCall(`/users/emergency-contacts/${id}`, {
      method: "DELETE"
    });
    loadContacts();
  } catch (e) {
    alert("Failed to delete contact: " + e.message);
  }
}
