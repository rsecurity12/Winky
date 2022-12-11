async function save_notification(lat, lng) {
    let city = await getCityOutLoc(lat, lng)
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
    point = { lat, lng };
    if (await pointInsideCircle(point)) {
        database_ref.add({
            title: title,
            discription: description,
            urgent: selectedRadioButton,
            lat: lat,
            long: lng,
            city: city,
            status: "danger"
        }).then(() => {
            alert('Danger notified 2 ')
            window.location = "user_map.html"
        }).catch(() => {
            alert('Danger not notified')
        });
    } else {
        database_ref.add({
            title: title,
            discription: description,
            urgent: selectedRadioButton,
            lat: lat,
            long: lng,
            city: city,
            status: "dangerOutOfRange"
        }).then(() => {
            alert("Danger notified but can't be shown")
            window.location = "user_map.html"
        }).catch(() => {
            alert('Danger not notified')
        });
    }
}

async function getCityOutLoc(lat, lng) {
    var requestOptions = {
        method: 'GET',
    };
    return new Promise((resolve, reject) => {
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=2ebfe86da1714e8fa63b217e11eb92ab`, requestOptions)
            .then(response => response.json())
            .then((result) => {
                resolve(result.results[0].city)
            })
    });
}

async function pointInsideCircle(point) {
    var list = await getAllRunningRegions();
    point = L.latLng(point)
    for (let index = 0; index < list.length; index++) {
        var circle = list[index]
        latLng = L.latLng(circle["lat"], circle["lng"]);
        if (point.distanceTo(latLng) < circle["radius"]) {
            return true;
        }
    }
    return false;
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

async function getAllNotificationsByCity(city) {
    var listNotifications = []
    await database.collection("Notifications").where("city", "==", city)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                listNotifications.push(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    return listNotifications;
};

async function makeNotificationsByCityTable(city) {
    var list = await getAllNotificationsByCity(city);
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('notificationsTable');
    table.appendChild(thead);
    table.appendChild(tbody);
    if (list.length > 0) {
        // Heading
        let headingRow = document.createElement('tr');
        let headingcolom1 = document.createElement('th');
        headingcolom1.innerHTML = "city";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Description";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Latitude";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "Longitude";
        let headingcolom5 = document.createElement('th');
        headingcolom5.innerHTML = "Status";
        let headingcolom6 = document.createElement('th');
        headingcolom6.innerHTML = "Title";
        let headingcolom7 = document.createElement('th');
        headingcolom7.innerHTML = "Urgent";
        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        headingRow.appendChild(headingcolom5);
        headingRow.appendChild(headingcolom6);
        headingRow.appendChild(headingcolom7);
        thead.appendChild(headingRow);
        // Notifications
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].city;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].discription;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].lat;
            let colom4 = document.createElement('td');
            colom4.innerHTML = list[i].long;
            let colom5 = document.createElement('td');
            colom5.innerHTML = list[i].status;
            let colom6 = document.createElement('td');
            colom6.innerHTML = list[i].title;
            let colom7 = document.createElement('td');
            colom7.innerHTML = list[i].urgent;
            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            row.appendChild(colom5);
            row.appendChild(colom6);
            row.appendChild(colom7);
            tbody.appendChild(row);
        }
    } else {
        let message = document.getElementById('notificationMessage');
        message.innerHTML = "No notifications"
    }
}

async function GetCityOfcurrentUser() {
    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            var data = "";
            await database.collection("UserRoles").where("email", "==", user.email)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        data = doc.data();
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            makeNotificationsByCityTable(data.city);
            greeting_user(data.first_name)
        }
    })
}