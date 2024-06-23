import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

//firebase config
const firebaseApp = initializeApp({
  apiKey: "AIzaSyBI84d29S3UTapg2JLDVLlndgmJdPJpxj0",
  authDomain: "grh-and-indriver.firebaseapp.com",
  databaseURL: "https://grh-and-indriver-default-rtdb.firebaseio.com",
  projectId: "grh-and-indriver",
  storageBucket: "grh-and-indriver.appspot.com",
  messagingSenderId: "708268529413",
  appId: "1:708268529413:web:df583f98e20737d9fe096c",
  measurementId: "G-B5GHBM37L3"
});

// Initialize Firebase
const db = getFirestore(firebaseApp);
const auth = getAuth();

async function getRoleOfUser(userId) {
  const userCollection = "admin";
  const docRef = doc(db, userCollection, userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("type:" + data["AccountType"]);
    return data["AccountType"];
  } else {
    return "user";
  }
}

//Functions
document.getElementById("btn").addEventListener("click", function() {
  var email = document.getElementById("email").value;
  if (email == "") {
    alert("Email or Password can't be empty");
    return false;
  }
  var password = document.getElementById("password").value;
  if (password == "") {
    alert("Email or Password can't be empty");
    return false;
  }
  /*localStorage.setItem("user", document.getElementById("email").value);
    localStorage.setItem("pass", document.getElementById("password").value);*/

  signInWithEmailAndPassword(auth, email, password)
    .then(async cred => {
      const user_id = cred.user.uid;

      const role = await getRoleOfUser(user_id);
      if (role === "Admin") {
        // Redirect to home.html on successful authentication and AccountType is Admin
        alert("Succussfully login");
        window.location.href = "home.html";
        console.log(auth.currentUser);
      } else {
        alert("The account type is not manager");
        logout();
      }
    })
    .catch(function(error) {
      console.error(error);
      alert("Email or Password invalid");
      logout();
    });
});

function logout() {
  // Sign out the user
  signOut(auth)
    .then(() => {
      // Redirect to the login page on successful sign-out
      // window.location.href = "login.html";
      console.log(auth.currentUser);
    })
    .catch(error => {
      // Handle sign-out errors
      console.error(error);
    });
}
