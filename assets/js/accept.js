import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAeOS8_0tDWKnfAwLf0GRKr6JaopYj1nnY",
    authDomain: "dormdash-40a10.firebaseapp.com",
    projectId: "dormdash-40a10",
    storageBucket: "dormdash-40a10.firebasestorage.app",
    messagingSenderId: "219135353050",
    appId: "1:219135353050:web:49446a2e74414ebf8105e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

// Ensure user is logged in before allowing order acceptance
let userEmail = null;
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html"; // Redirect if not logged in
    } else {
        userEmail = user.email;
        loadOrderDetails(); // Load order details after auth is confirmed
    }
});

// Fetch user phone number from Firestore
async function getUserPhoneNumber(userEmail) {
    const userRef = doc(db, "users", userEmail); // Assuming user data is stored in "users" collection
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data().phone || "Not available"; // Retrieve phone number if available
    }
    return "Not available";
}

// Fetch and display order details
async function loadOrderDetails() {
    if (!orderId) return;

    const orderRef = doc(db, "requests", orderId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
        const data = orderSnap.data();

        document.getElementById("orderTitle").textContent =
            `${data.orderNumber ? `${data.orderNumber} - ` : ""}${data.title}`;
        document.getElementById("orderDescription").textContent = data.description;
        document.getElementById("orderReward").textContent = `Reward: ₹${data.reward}`;
    } else {
        alert("Order not found!");
        window.location.href = "available_requests.html"; // Redirect if order doesn't exist
    }
}

// Confirm Order Button
document.getElementById("confirmOrder").addEventListener("click", async function () {
    if (!userEmail) return;

    const userName = prompt("Enter your name and your phone number to confirm the order:");
    if (!userName) return alert("Order confirmation requires your name and your contact information.");

    const confirmAccept = confirm("Do you want to confirm this order?");
    if (!confirmAccept) return;

    const userPhone = await getUserPhoneNumber(userEmail); // ✅ Fetch acceptor's phone number

    // Update Firestore
    await updateDoc(doc(db, "requests", orderId), {
        taken: true,
        acceptedBy: userEmail,
        acceptedEmail: userName,
        acceptedByPhone: userPhone // ✅ Store acceptor's phone number
    });

    alert("Order Confirmed!");
    window.location.href = "available_requests.html"; // Redirect back
});
