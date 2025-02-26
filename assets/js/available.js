import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
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

// Ensure user is signed in
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("usernameDisplay").textContent = user.email;
        document.getElementById("usernameDisplay").classList.remove("hidden");
        loadRequests(); // Load requests only after authentication is confirmed
    } else {
        // Delay the redirect slightly to ensure Firebase has time to process auth state
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000); // 1-second delay before redirecting
    }
});

// Fetch available requests
const requestsContainer = document.getElementById("requestsContainer");
async function loadRequests() {
    const querySnapshot = await getDocs(collection(db, "requests"));
    requestsContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.taken) {
            const requestElement = document.createElement("div");
            requestElement.classList = "bg-white shadow-md rounded-lg p-5 border";
            requestElement.innerHTML = `
                <h2 class="text-lg font-semibold text-gray-900">
                    ${data.orderNumber ? `${data.orderNumber} - ` : ""}${data.title}
                </h2>
                <p class="text-gray-600">${data.description}</p>
                <p class="text-gray-600 font-semibold">Reward: ₹${data.reward}</p>
                <button class="take-order" data-id="${doc.id}" data-title="${data.title}" data-description="${data.description}" data-reward="${data.reward}">
                    Take Order
                </button>
            `;
            requestsContainer.appendChild(requestElement);
        }
    });

    document.querySelectorAll('.take-order').forEach(button => {
        button.addEventListener('click', function () {
            const orderId = this.getAttribute("data-id");
            const title = this.getAttribute("data-title");
            const description = this.getAttribute("data-description");
            const reward = this.getAttribute("data-reward");

            // Redirect to Accept page
            window.location.href = `accept_order.html?id=${orderId}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&reward=${reward}`;

        });
    });
}
