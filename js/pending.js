import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
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
  get, update 
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
const auth = getAuth();

// Get a reference to the database service
const database = getDatabase(firebaseApp);

window.addEventListener("load", function() {
  const auth = getAuth();
  const database = getDatabase(firebaseApp);
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
    } else {
      // User is not logged in
      window.location.href = "login.html";
    }
  });
  getPendingDrivers();

  
});
function getPendingDrivers(){
 
    $("#dataTbl td").remove();
    const dbRef = ref(database, "drivers/");

  //active
  get(dbRef)
    .then(snapshot => {

      snapshot.forEach(childSnapshot => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        // ...
        if (childData.active == false) {
            var row = "<tr><td>" + childData.id + "</td><td>" + childData.name + "</td><td>" + childData.email + "</td><td>" + childData.phone + "</td><td><input type='button'  class='btn btn-danger' value='Reject'><input type='button'  class='btn btn-success ml-2' value='Accept'> </td></tr>"

            $(row).appendTo('#dataTbl');
        }
      });
      
    })
    .catch(error => {
      console.error(error);
    });

   
    //
 
}
//when click  accept 


$("#dataTbl").on("click", ".btn-success", function() {
  const row = $(this).closest("tr");
  const id = row.find("td:eq(0)").text();
  console.log('id:',id);
  const dataRef = ref(database, 'drivers/'+ id);
  update(dataRef, { active: true }).then(() => {
    console.log("Data updated successfully");
    row.remove();
  }).catch((error) => {
    console.error(error);
  });
});

//when click  reject 
$("#dataTbl").on("click", ".btn-danger", function() {
  const row = $(this).closest("tr");
  const id = row.find("td:eq(0)").text();
  const dataRef = ref(database, 'drivers/'+ id);
  remove(dataRef).then(() => {
    row.remove();
    console.log("Data deleted successfully");
  }).catch((error) => {
    console.error(error);
  });
});

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

$("#searchButton").on("click", function() {
    const searchTerm = $("#searchInput").val().toLowerCase();
    $("#dataTbl tbody tr").filter(function() {
      const name = $(this).find("td:eq(1)").text().toLowerCase();
      $(this).toggle(name.indexOf(searchTerm) > -1);
    });
  });
