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
  setDoc,
  getDocs,
  onSnapshot,
  collection,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import {
  getDatabase,
  set,
  ref,
  push,
  child,
  onValue,
  remove,
  query,
  orderByChild,
  equalTo,
  get
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";

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

// get Firestore reference and authentication
const db = getFirestore(firebaseApp);
const auth = getAuth();

// Get a reference to the database service
const database = getDatabase(firebaseApp);

window.addEventListener("load", function() {
  const auth = getAuth();
  const database = getDatabase(firebaseApp);
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
     // console.log(user);
    } else {
      // User is not logged in
      window.location.href = "login.html";
    }
  });
  getTicketsData();

  //get count of passengers
  var countUsers;
  
  const dbRef = ref(database, "users/");
  get(dbRef)
    .then(snapshot => {
      countUsers = snapshot.size;
      console.log("Number of child nodes:", countUsers);
      const countUsersElement = document.getElementById("countUsers");
      countUsersElement.textContent = countUsers.toString();
    })
    .catch(error => {
      console.error(error);
    });

    //get count of Drivers

  const dbRef1 = ref(database, "drivers/");

  //active
  get(dbRef1)
    .then(snapshot => {
      const countAll = snapshot.size;
      var rowNum = 0;
      snapshot.forEach(childSnapshot => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        // ...

        console.log(childData.active);
        if (childData.active == true) {
          rowNum += 1;
        }
      });
      const countDrivers = rowNum;
      const countPending = countAll - rowNum;
      console.log("Number of active drivers:", countDrivers);
      const countDriversElement = document.getElementById("countDrivers");
      countDriversElement.textContent = countDrivers.toString();

      //countPending
      const countPendingElement = document.getElementById("countPending");
      countPendingElement.textContent = countPending.toString();
    })
    .catch(error => {
      console.error(error);
    });

  //    if (user===null) {
  //     window.location.href = "login.html";
  //    }
});
function getTicketsData(){
 
    $("#dataTbl td").remove();
    var rowNum = 0;
    ///

    getDocs(collection(db, "Tickets")).then((docSnap) => {
      docSnap.forEach((doc) => {
        
        console.log(doc.data().driverLocation);
        var row =
          "<tr><td>" +
          doc.data().id +
          "</td><td>" +
          doc.data().destination._lat+"</br>"+doc.data().destination._long+
          "</td><td>" +
          doc.data().driverId +
          "</td><td>" +
          doc.data().driverLocation._lat+"</br>"+doc.data().driverLocation._long+
          "</td><td>" +
          doc.data().humanReadableDestination +
          "</td></tr>";
  
        $(row).appendTo("#dataTbl");
        //console.log("Document data:", doc.data().email);
      });
    });
    //
 
}

//logout 
const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  auth.signOut().then(() => {
    console.log("User signed out");
    window.location.href = "login.html";

  }).catch((error) => {
    console.error(error);
  });
});