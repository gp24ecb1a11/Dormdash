import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase setup
const firebaseConfig = {
    apiKey: "AIzaSyAeOS8_0tDWKnfAwLf0GRKr6JaopYj1nnY",
    authDomain: "dormdash-40a10.firebaseapp.com",
    projectId: "dormdash-40a10",
    storageBucket: "dormdash-40a10.appspot.com",
    messagingSenderId: "219135353050",
    appId: "1:219135353050:web:49446a2e74414ebf8105e3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);  // ✅ Declare auth globally

// Function to generate a unique order number
function generateOrderNumber() {
    return `DD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

// Function to get user's phone number from Firestore
async function getUserPhoneNumber(userEmail) {
    const userRef = doc(db, "users", userEmail); // Assuming user data is stored in "users" collection
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        return userSnap.data().phone || "Not available"; // Retrieve phone number if available
    }
    return "Not available";
}

// Wait for DOM to load before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById("orderForm");
    
    if (!orderForm) {
        console.error("Error: orderForm not found. Check if the form ID is correct.");
        return;
    }

    orderForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const user = auth.currentUser;  // ✅ Now auth is accessible
        if (!user) {
            alert("You must be logged in to place an order.");
            return;
        }

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const reward = document.getElementById("reward").value;
        const orderNumber = generateOrderNumber(); // ✅ Generate order number

        try {
            const userPhone = await getUserPhoneNumber(user.email); // ✅ Fetch user's phone number

            await addDoc(collection(db, "requests"), {
                orderNumber: orderNumber, // ✅ Save order number in Firestore
                title: title,
                description: description,
                reward: reward,
                createdBy: user.email,  // ✅ Store creator's email
                createdByPhone: userPhone, // ✅ Store creator's phone number
                acceptedBy: null,
                acceptedEmail: null,
                acceptedByPhone: null
            });

            alert(`Order placed successfully! Order Number: ${orderNumber}`);
            window.location.href = "available_requests.html";
        } catch (error) {
            console.error("Error adding order:", error);
        }
    });
});
