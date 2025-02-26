import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeOS8_0tDWKnfAwLf0GRKr6JaopYj1nnY",
  authDomain: "dormdash-40a10.firebaseapp.com",
  projectId: "dormdash-40a10",
  storageBucket: "dormdash-40a10.appspot.com",
  messagingSenderId: "219135353050",
  appId: "1:219135353050:web:49446a2e74414ebf8105e3"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Login Function
document.getElementById("loginButton").addEventListener("click", function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // 🚨 Prevent empty input
  if (email === "" || password === "") {
    alert("⚠️ Please enter both email and password.");
    return;
  }

  // 🚨 Restrict to NIT Warangal emails only
  if (!email.endsWith("@student.nitw.ac.in")) {
    alert("❌ Only NIT Warangal emails (@nitw.ac.in) are allowed.");
    return; // ❗ Stops execution here, preventing Firebase login
  }

  // ✅ Proceed with Firebase Authentication
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("✅ Login successful!");
      window.location.href = "index.html"; // Redirect to Dashboard
    })
    .catch((error) => {
      // ✅ User-friendly error messages
      let errorMessage = "❌ Login failed! ";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage += "Invalid email format.";
          break;
        case "auth/user-not-found":
          errorMessage += "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage += "Incorrect password.";
          break;
        case "auth/too-many-requests":
          errorMessage += "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage += error.message;
      }
      alert(errorMessage);
    });
});
