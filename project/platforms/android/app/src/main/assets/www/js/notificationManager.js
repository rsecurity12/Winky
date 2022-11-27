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
    title = title.charAt(0).toUpperCase() + title.slice(1);
    description = description.charAt(0).toUpperCase() + description.slice(1);
    const radioButtons = document.querySelectorAll('input[name="notificationState"]');
    var selectedRadioButton;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedRadioButton = radioButton.value;
            break;
        }
    }
    var database_ref = database.collection('Notifications');
    database_ref.add({
        title: title,
        discription: description,
        urgent: selectedRadioButton,
        lat: lat,
        long: long,
        status: "danger"
    }).then(() => {
        alert('Danger notified')
        window.location = "user_map.html"
    }).catch(() => {
        alert('Danger not notified')
    });
}

async function getAllNotifications() {
    var listNotifications = []
    await database.collection("Notifications").where("status", "==", "danger")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                listNotifications.push(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    console.log(listNotifications);
    return listNotifications;
}