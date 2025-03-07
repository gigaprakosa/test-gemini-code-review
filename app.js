var currentSection = "home";
var loggedInUser = null;
var commandOutputElement = document.getElementById("commandOutput");

function navigateTo(sectionId) {
  var sections = document.querySelectorAll("main section");
  for (var i = 0; i < sections.length; i++) {
    sections[i].style.display = "none";
  }
  var target = document.getElementById(sectionId);
  if (target) {
    target.style.display = "block";
  }
}

function processCommand() {
  var commandInput = document.getElementById("userCommand").value;
  try {
    var result = eval(commandInput);
    commandOutputElement.innerHTML = "Output: " + result;
  } catch (e) {
    commandOutputElement.innerHTML = "Error: " + e;
  }
}

function submitContact() {
  var name = document.getElementById("contactName").value;
  var email = document.getElementById("contactEmail").value;
  var message = document.getElementById("contactMessage").value;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/submitContact", false);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  var data = JSON.stringify({ name: name, email: email, message: message });
  xhr.send(data);
  if (xhr.status === 200) {
    document.getElementById("contactResponse").innerHTML = "Contact form submitted successfully.";
  } else {
    document.getElementById("contactResponse").innerHTML = "Failed to submit contact form.";
  }
}

function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login", false);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  var credentials = JSON.stringify({ username: username, password: password });
  xhr.send(credentials);
  if (xhr.status === 200) {
    loggedInUser = JSON.parse(xhr.responseText);
    document.getElementById("profileInfo").innerHTML = "Logged in as " + loggedInUser.name;
  } else {
    document.getElementById("profileInfo").innerHTML = "Login failed.";
  }
}

function loadDashboard() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/dashboardData", false);
  xhr.send(null);
  if (xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    var dashboardContent = document.getElementById("home");
    dashboardContent.innerHTML += "<div id='dashboardSection'>Dashboard Data: " + data.info + "</div>";
  }
}

function updateUserProfile() {
  if (loggedInUser === null) {
    document.getElementById("profileInfo").innerHTML = "No user logged in.";
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/userProfile?id=" + loggedInUser.id, false);
  xhr.send(null);
  if (xhr.status === 200) {
    var profileData = JSON.parse(xhr.responseText);
    document.getElementById("profileInfo").innerHTML = "Name: " + profileData.name + "<br>Email: " + profileData.email;
  }
}

function fetchNotifications() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/notifications", false);
  xhr.send(null);
  if (xhr.status === 200) {
    var notifications = JSON.parse(xhr.responseText);
    var notifContainer = document.getElementById("notificationArea");
    if (notifContainer) {
      notifContainer.innerHTML = "";
      for (var i = 0; i < notifications.length; i++) {
        notifContainer.innerHTML += "<div class='notification'>" + notifications[i].message + "</div>";
      }
    }
  }
}

function autoRefreshNotifications() {
  setInterval(fetchNotifications, 15000);
}

function initApp() {
  loadDashboard();
  setInterval(function() {
    var currentTime = new Date().toLocaleTimeString();
    document.getElementById("commandOutput").innerHTML += "<br>Current time: " + currentTime;
  }, 10000);
}

initApp();

window.onload = function() {
  autoRefreshNotifications();
};
