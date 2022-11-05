const firebaseConfig = {
    apiKey: "AIzaSyD-yV8RDi1Ww3YpTmwkZpmQkS934s5RwxE",
    authDomain: "winky-d52e8.firebaseapp.com",
    databaseURL: "https://winky-d52e8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "winky-d52e8",
    storageBucket: "winky-d52e8.appspot.com",
    messagingSenderId: "289336849912",
    appId: "1:289336849912:web:0b04e4d7a6e5d921dd120d"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();

function addNotification(urgent) {
    description = document.getElementById('description').value
    title = document.getElementById('title').value
    var database_ref = database.collection('notifications')
    alert(firebase.auth().currentUser.userId)
    database_ref.add({
        title: title,
        discription: description,
        urgent: urgent
    });
}

function getNot() {
    database.collection("notifications")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

}