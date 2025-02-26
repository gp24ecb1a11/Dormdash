import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

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
const auth = getAuth(app);

// Wait for the user to be authenticated
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const acceptedOrdersContainer = document.getElementById("acceptedOrders");

        // Fetch only orders where the logged-in user has accepted them
        const q = query(collection(db, "requests"), where("acceptedBy", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            acceptedOrdersContainer.innerHTML = "<p class='text-center text-gray-500'>You haven't accepted any orders yet.</p>";
            return;
        }

        acceptedOrdersContainer.innerHTML = ""; // Clear previous content

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const orderElement = document.createElement("div");
            orderElement.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "mt-4");

            orderElement.innerHTML = `
                <p><strong>Title:</strong> ${order.title || "No title"}</p>
                <p><strong>Description:</strong> ${order.description || "No description"}</p>
                <p><strong>Reward:</strong> ${order.reward || "No reward"}</p>
                <p><strong>Created By:</strong> ${order.createdBy || "Unknown"}</p>
                
            `;

            acceptedOrdersContainer.appendChild(orderElement);
        });
    } else {
        // Redirect to login page if not signed in
        window.location.href = "index.html";
    }
});
