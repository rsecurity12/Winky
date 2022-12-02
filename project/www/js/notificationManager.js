async function save_notification(lat, lng) {
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
    alert(lat + " " + lng)
    if (await pointInsideCircle(point)) {
        alert("lat: " + lat)

        database_ref.add({
            title: title,
            discription: description,
            urgent: selectedRadioButton,
            lat: lat,
            long: lng,
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
            status: "dangerOutOfRange"
        }).then(() => {
            alert("Danger notified but can't be shown")
            window.location = "user_map.html"
        }).catch(() => {
            alert('Danger not notified')
        });
    }
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