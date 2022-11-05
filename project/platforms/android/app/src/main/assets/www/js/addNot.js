const firebaseConfig = {
    apiKey: "AIzaSyD-yV8RDi1Ww3YpTmwkZpmQkS934s5RwxE",
    authDomain: "winky-d52e8.firebaseapp.com",
    databaseURL: "https://winky-d52e8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "winky-d52e8",
    storageBucket: "winky-d52e8.appspot.com",
    messagingSenderId: "289336849912",
    appId: "1:289336849912:web:0b04e4d7a6e5d921dd120d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database();
var countDB = 0

function addNotification() {
    description = document.getElementById('description').value
    alert(description);

    database_ref.child('notifications/' + countDB).add({ discription: "test" });
    countDB++;
}