window.onload = function () {
    if (!localStorage.getItem("isLoggedIn")) {
      alert("You need to log in first.");
      window.location.href = "index.html";
      return;
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("username").textContent = user.name;
  
    // Example appointments
    const appointments = [
      { id: 1, doctor: "Dr. Nova Lynn", date: "2025-04-28", status: "Upcoming" },
      { id: 2, doctor: "Dr. Leo Marston", date: "2025-03-22", status: "Completed" }
    ];
  
    let html = "<ul>";
    appointments.forEach(app => {
      html += `<li>
        Appointment with ${app.doctor} on ${app.date} - ${app.status}
        ${app.status === "Upcoming" ? `<button onclick="cancel(${app.id})">Cancel</button>` : ""}
      </li>`;
    });
    html += "</ul>";
    document.getElementById("appointments").innerHTML = html;
  };
  
  function cancel(id) {
    alert("Appointment " + id + " canceled (simulated)");
  }
  
  function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
  }
  