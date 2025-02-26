import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAeOS8_0tDWKnfAwLf0GRKr6JaopYj1nnY",
    authDomain: "dormdash-40a10.firebaseapp.com",
    projectId: "dormdash-40a10",
    storageBucket: "dormdash-40a10.appspot.com",
    messagingSenderId: "219135353050",
    appId: "1:219135353050:web:49446a2e74414ebf8105e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Wait for the user to be authenticated
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userOrdersContainer = document.getElementById("userOrders");

        // Fetch only orders where the logged-in user is the creator
        const q = query(collection(db, "requests"), where("createdBy", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            userOrdersContainer.innerHTML = "<p class='text-center text-gray-500'>You have no orders yet.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const orderElement = document.createElement("div");
            orderElement.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md");

            orderElement.innerHTML = `
                <p><strong>Title:</strong> ${order.title}</p>
                <p><strong>Description:</strong> ${order.description}</p>
                <p><strong>Reward:</strong> ${order.reward}</p>
                ${order.acceptedBy 
                    ? `<p><strong>Accepted By:</strong> ${order.acceptedBy} (${order.acceptedEmail})</p>
                       ` 
                    : "<p><strong>Status:</strong> Not accepted yet</p>"
                }
            `;

            userOrdersContainer.appendChild(orderElement);
        });
    } else {
        // Redirect to login page if not signed in
        window.location.href = "index.html";
    }
});
