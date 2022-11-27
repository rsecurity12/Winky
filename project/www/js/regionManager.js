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

function save_region() {
    radius = document.getElementById('radius').value
    lat = document.getElementById('latitude').value
    long = document.getElementById('langitude').value
    loc = document.getElementById('location').value
    city = document.getElementById('city').value
    var database_ref = database.collection('Regions');
    database_ref.add({
        loc: loc,
        lat: lat,
        long: long,
        radius: radius * 1000,
        city: city
    }).then(() => {
        alert('Region added')
        window.location = "admin_regions.html"
    }).catch(() => {
        alert('Region not added')
    });
}

async function getAllRegions() {
    var listRegions = []
    await database.collection("Regions")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                listRegions.push(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    console.log(listRegions);
    return listRegions;
}