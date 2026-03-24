document.addEventListener("DOMContentLoaded", () => {
  if (getToken()) {
    window.location.href = "dashboard.html";
  }
});

function toggleAuth() {
  const loginCard = document.getElementById("loginCard");
  const signupCard = document.getElementById("signupCard");
  
  if (loginCard.classList.contains("hidden")) {
    loginCard.classList.remove("hidden");
    signupCard.classList.add("hidden");
  } else {
    loginCard.classList.add("hidden");
    signupCard.classList.remove("hidden");
  }
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const data = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    setToken(data.token);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const data = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });
    setToken(data.token);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
