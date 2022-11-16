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

async function save_notification(lat, long) {
    description = document.getElementById('description').value
    title = document.getElementById('title').value
    const radioButtons = document.querySelectorAll('input[name="notificationState"]');
    var selectedRadioButton;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedRadioButton = radioButton.value;
            break;
        }
    }
    var database_ref = database.collection('notifications');
    /* Toe te voegen -->
        Current user id
    */
    database_ref.add({
        title: title,
        discription: description,
        urgent: selectedRadioButton,
        lat: lat,
        long: long
    }).then(() => {
        alert('Danger notified')
        window.location = "../html/map.html"
    }).catch(() => {
        alert('Danger not notified')
    });
    // komt daar niet in
    alert('azerty');

}

async function getAllNotifications() {
    var listNotifications = []
    await database.collection("notifications")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                listNotifications.push(doc.data())
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    console.log(listNotifications);

    return listNotifications;
}