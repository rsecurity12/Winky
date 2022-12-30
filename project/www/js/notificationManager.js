async function save_notification(lat, lng) {
    let city = await getCityOutLoc(lat, lng)
    let id = await get_list_size()
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
            description: description,
            urgent: selectedRadioButton,
            lat: lat,
            long: lng,
            city: city,
            process_status: "Waiting",
            status: "danger",
            id: id
        }).then(() => {
            alert('Danger notified')
            window.location = "user_map.html"
        }).catch(() => {
            alert('Danger not notified')
        });
    } else {
        database_ref.add({
            title: title,
            description: description,
            urgent: selectedRadioButton,
            lat: lat,
            long: lng,
            city: city,
            process_status: "Waiting",
            status: "dangerOutOfRange",
            id: id
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
    alert(lat + "" + lng)
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

//Search for specific notifications
async function getAllNotificationsByCity(city) {
    var listNotifications = []
    await database.collection("Notifications").where("city", "==", city)
        .orderBy("status")
        .orderBy("id")
        .where("status", "!=", "dangerOutOfRange")
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


async function getWaitingNotifications(city) {
    var listNotifications = []
    await database.collection("Notifications").where("city", "==", city)
        .orderBy("status")
        .orderBy("id")
        .where("status", "!=", "dangerOutOfRange")
        .where("process_status", "==", "Waiting")
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

async function getCompletedNotificationsByCity(city) {
    var listNotifications = []
    await database.collection("Notifications").where("city", "==", city)
        .orderBy("status")
        .orderBy("id")
        .where("status", "!=", "dangerOutOfRange")
        .where("process_status", "==", "Completed")
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

async function getRejectedNotifications2(city) {
    var listNotifications = []
    await database.collection("Notifications").where("city", "==", city)
        .orderBy("status")
        .orderBy("id")
        .where("status", "!=", "dangerOutOfRange")
        .where("process_status", "==", "Rejected")

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
async function getInProgressNotifications2(city) {
    var listNotifications = []
    await database.collection("Notifications").where("city", "==", city)
        .orderBy("status")
        .orderBy("id")
        .where("status", "!=", "dangerOutOfRange")
        .where("process_status", "==", "In progress")

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
    return listNotifications;
};
//Table of waiting notifications
async function makeWaitingNotificationsByCityTable(city) {
    var list = await getWaitingNotifications(city);
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('notificationsTable');
    table.appendChild(thead);
    table.appendChild(tbody);
    if (list.length > 0) {
        // Heading
        let headingRow = document.createElement('tr');
        let headingcolom1 = document.createElement('th');
        headingcolom1.innerHTML = "Notification ID";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Title";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Description";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "City";
        let headingcolom5 = document.createElement('th');
        headingcolom5.innerHTML = "Status";
        let headingcolom6 = document.createElement('th');
        headingcolom6.innerHTML = "Process status";
        let headingcolom7 = document.createElement('th');
        headingcolom7.innerHTML = "Urgent";
        let headingcolom8 = document.createElement('th');
        headingcolom8.innerHTML = "Latitude";
        let headingcolom9 = document.createElement('th');
        headingcolom9.innerHTML = "Longitude";

        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        headingRow.appendChild(headingcolom5);
        headingRow.appendChild(headingcolom6);
        headingRow.appendChild(headingcolom7);
        headingRow.appendChild(headingcolom8);
        headingRow.appendChild(headingcolom9);
        thead.appendChild(headingRow);
        // Notifications
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].id;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].title;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].description;
            let colom4 = document.createElement('td');
            colom4.innerHTML = list[i].city;
            let colom5 = document.createElement('td');
            colom5.innerHTML = list[i].status;
            let colom6 = document.createElement('td');
            colom6.innerHTML = list[i].process_status;
            let colom7 = document.createElement('td');
            colom7.innerHTML = list[i].urgent;
            let colom8 = document.createElement('td');
            colom8.innerHTML = list[i].lat;
            let colom9 = document.createElement('td');
            colom9.innerHTML = list[i].long;

            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            row.appendChild(colom5);
            row.appendChild(colom6);
            row.appendChild(colom7);
            row.appendChild(colom8);
            row.appendChild(colom9);
            tbody.appendChild(row);
        }
    } else {
        let message = document.getElementById('notificationMessage');
        message.innerHTML = "At this moment there aren't any notifications for this city"
    }
}

//Table of rejected notifications
async function makeRejectedNotificationsByCityTable(city) {
    var list = await getRejectedNotifications2(city)
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('notificationsTable');
    table.appendChild(thead);
    table.appendChild(tbody);
    if (list.length > 0) {
        // Heading
        let headingRow = document.createElement('tr');
        let headingcolom1 = document.createElement('th');
        headingcolom1.innerHTML = "Notification ID";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Title";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Description";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "City";
        let headingcolom5 = document.createElement('th');
        headingcolom5.innerHTML = "Status";
        let headingcolom6 = document.createElement('th');
        headingcolom6.innerHTML = "Process status";
        let headingcolom7 = document.createElement('th');
        headingcolom7.innerHTML = "Urgent";
        let headingcolom8 = document.createElement('th');
        headingcolom8.innerHTML = "Latitude";
        let headingcolom9 = document.createElement('th');
        headingcolom9.innerHTML = "Longitude";

        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        headingRow.appendChild(headingcolom5);
        headingRow.appendChild(headingcolom6);
        headingRow.appendChild(headingcolom7);
        headingRow.appendChild(headingcolom8);
        headingRow.appendChild(headingcolom9);
        thead.appendChild(headingRow);
        // Notifications
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].id;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].title;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].description;
            let colom4 = document.createElement('td');
            colom4.innerHTML = list[i].city;
            let colom5 = document.createElement('td');
            colom5.innerHTML = list[i].status;
            let colom6 = document.createElement('td');
            colom6.innerHTML = list[i].process_status;
            let colom7 = document.createElement('td');
            colom7.innerHTML = list[i].urgent;
            let colom8 = document.createElement('td');
            colom8.innerHTML = list[i].lat;
            let colom9 = document.createElement('td');
            colom9.innerHTML = list[i].long;

            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            row.appendChild(colom5);
            row.appendChild(colom6);
            row.appendChild(colom7);
            row.appendChild(colom8);
            row.appendChild(colom9);
            tbody.appendChild(row);
        }
    } else {
        let message = document.getElementById('notificationMessage');
        message.innerHTML = "At this moment there aren't any notifications for this city"
    }
}

//Table of completed notifications
async function makeCompletedNotificationsByCityTable(city) {
    var list = await getCompletedNotificationsByCity(city)
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('notificationsTable');
    table.appendChild(thead);
    table.appendChild(tbody);
    if (list.length > 0) {
        // Heading
        let headingRow = document.createElement('tr');
        let headingcolom1 = document.createElement('th');
        headingcolom1.innerHTML = "Notification ID";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Title";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Description";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "City";
        let headingcolom5 = document.createElement('th');
        headingcolom5.innerHTML = "Status";
        let headingcolom6 = document.createElement('th');
        headingcolom6.innerHTML = "Process status";
        let headingcolom7 = document.createElement('th');
        headingcolom7.innerHTML = "Urgent";
        let headingcolom8 = document.createElement('th');
        headingcolom8.innerHTML = "Latitude";
        let headingcolom9 = document.createElement('th');
        headingcolom9.innerHTML = "Longitude";

        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        headingRow.appendChild(headingcolom5);
        headingRow.appendChild(headingcolom6);
        headingRow.appendChild(headingcolom7);
        headingRow.appendChild(headingcolom8);
        headingRow.appendChild(headingcolom9);
        thead.appendChild(headingRow);
        // Notifications
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].id;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].title;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].description;
            let colom4 = document.createElement('td');
            colom4.innerHTML = list[i].city;
            let colom5 = document.createElement('td');
            colom5.innerHTML = list[i].status;
            let colom6 = document.createElement('td');
            colom6.innerHTML = list[i].process_status;
            let colom7 = document.createElement('td');
            colom7.innerHTML = list[i].urgent;
            let colom8 = document.createElement('td');
            colom8.innerHTML = list[i].lat;
            let colom9 = document.createElement('td');
            colom9.innerHTML = list[i].long;

            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            row.appendChild(colom5);
            row.appendChild(colom6);
            row.appendChild(colom7);
            row.appendChild(colom8);
            row.appendChild(colom9);
            tbody.appendChild(row);
        }
    } else {
        let message = document.getElementById('notificationMessage');
        message.innerHTML = "At this moment there aren't any notifications for this city"
    }
}

//Table of all notifications
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
        headingcolom1.innerHTML = "Notification ID";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Title";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Description";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "City";
        let headingcolom5 = document.createElement('th');
        headingcolom5.innerHTML = "Status";
        let headingcolom6 = document.createElement('th');
        headingcolom6.innerHTML = "Process status";
        let headingcolom7 = document.createElement('th');
        headingcolom7.innerHTML = "Urgent";
        let headingcolom8 = document.createElement('th');
        headingcolom8.innerHTML = "Latitude";
        let headingcolom9 = document.createElement('th');
        headingcolom9.innerHTML = "Longitude";

        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        headingRow.appendChild(headingcolom5);
        headingRow.appendChild(headingcolom6);
        headingRow.appendChild(headingcolom7);
        headingRow.appendChild(headingcolom8);
        headingRow.appendChild(headingcolom9);
        thead.appendChild(headingRow);
        // Notifications
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].id;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].title;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].description;
            let colom4 = document.createElement('td');
            colom4.innerHTML = list[i].city;
            let colom5 = document.createElement('td');
            colom5.innerHTML = list[i].status;
            let colom6 = document.createElement('td');
            colom6.innerHTML = list[i].process_status;
            let colom7 = document.createElement('td');
            colom7.innerHTML = list[i].urgent;
            let colom8 = document.createElement('td');
            colom8.innerHTML = list[i].lat;
            let colom9 = document.createElement('td');
            colom9.innerHTML = list[i].long;

            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            row.appendChild(colom5);
            row.appendChild(colom6);
            row.appendChild(colom7);
            row.appendChild(colom8);
            row.appendChild(colom9);
            tbody.appendChild(row);
        }
    } else {
        let message = document.getElementById('notificationMessage');
        message.innerHTML = "At this moment there aren't any notifications for this city"
    }
}

//Table of in progress notifications
async function makeInProgressNotificationsByCityTable(city) {
    var list = await getInProgressNotifications2(city);
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('notificationsTable');
    table.appendChild(thead);
    table.appendChild(tbody);
    if (list.length > 0) {
        // Heading
        let headingRow = document.createElement('tr');
        let headingcolom1 = document.createElement('th');
        headingcolom1.innerHTML = "Notification ID";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Title";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Description";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "City";
        let headingcolom5 = document.createElement('th');
        headingcolom5.innerHTML = "Status";
        let headingcolom6 = document.createElement('th');
        headingcolom6.innerHTML = "Process status";
        let headingcolom7 = document.createElement('th');
        headingcolom7.innerHTML = "Urgent";
        let headingcolom8 = document.createElement('th');
        headingcolom8.innerHTML = "Latitude";
        let headingcolom9 = document.createElement('th');
        headingcolom9.innerHTML = "Longitude";

        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        headingRow.appendChild(headingcolom5);
        headingRow.appendChild(headingcolom6);
        headingRow.appendChild(headingcolom7);
        headingRow.appendChild(headingcolom8);
        headingRow.appendChild(headingcolom9);
        thead.appendChild(headingRow);
        // Notifications
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].id;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].title;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].description;
            let colom4 = document.createElement('td');
            colom4.innerHTML = list[i].city;
            let colom5 = document.createElement('td');
            colom5.innerHTML = list[i].status;
            let colom6 = document.createElement('td');
            colom6.innerHTML = list[i].process_status;
            let colom7 = document.createElement('td');
            colom7.innerHTML = list[i].urgent;
            let colom8 = document.createElement('td');
            colom8.innerHTML = list[i].lat;
            let colom9 = document.createElement('td');
            colom9.innerHTML = list[i].long;

            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            row.appendChild(colom5);
            row.appendChild(colom6);
            row.appendChild(colom7);
            row.appendChild(colom8);
            row.appendChild(colom9);
            tbody.appendChild(row);
        }
    } else {
        let message = document.getElementById('notificationMessage');
        message.innerHTML = "At this moment there aren't any notifications for this city"
    }
}

async function makeAllNotificationsByCityTable(city) {
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
        headingcolom1.innerHTML = "Notification ID";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Title";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Description";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "City";
        let headingcolom5 = document.createElement('th');
        headingcolom5.innerHTML = "Status";
        let headingcolom6 = document.createElement('th');
        headingcolom6.innerHTML = "Process status";
        let headingcolom7 = document.createElement('th');
        headingcolom7.innerHTML = "Urgent";
        let headingcolom8 = document.createElement('th');
        headingcolom8.innerHTML = "Latitude";
        let headingcolom9 = document.createElement('th');
        headingcolom9.innerHTML = "Longitude";

        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        headingRow.appendChild(headingcolom5);
        headingRow.appendChild(headingcolom6);
        headingRow.appendChild(headingcolom7);
        headingRow.appendChild(headingcolom8);
        headingRow.appendChild(headingcolom9);
        thead.appendChild(headingRow);
        // Notifications
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].id;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].title;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].description;
            let colom4 = document.createElement('td');
            colom4.innerHTML = list[i].city;
            let colom5 = document.createElement('td');
            colom5.innerHTML = list[i].status;
            let colom6 = document.createElement('td');
            colom6.innerHTML = list[i].process_status;
            let colom7 = document.createElement('td');
            colom7.innerHTML = list[i].urgent;
            let colom8 = document.createElement('td');
            colom8.innerHTML = list[i].lat;
            let colom9 = document.createElement('td');
            colom9.innerHTML = list[i].long;

            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            row.appendChild(colom5);
            row.appendChild(colom6);
            row.appendChild(colom7);
            row.appendChild(colom8);
            row.appendChild(colom9);
            tbody.appendChild(row);
        }
    } else {
        let message = document.getElementById('notificationMessage');
        message.innerHTML = "At this moment there aren't any notifications for this city"
    }
}







async function getRejectedNotifications() {
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
            makeRejectedNotificationsByCityTable(data.city)
        }
    })
}



async function getInProgressNotifications() {
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
            makeInProgressNotificationsByCityTable(data.city)
        }
    })
}


async function getCompletedNotifications() {
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
            makeCompletedNotificationsByCityTable(data.city)
        }
    })
}


async function displayAllNotifications() {
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
            makeAllNotificationsByCityTable(data.city)
        }
    })
}



async function displayWaitingNotifications() {
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
            makeWaitingNotificationsByCityTable(data.city);
            greeting_user(data.first_name)
        }
    })
}


async function inProgress() {
    notification_id = document.getElementById('notification_id').value
    if (notification_id < 1) {
        alert("You need to provide a valid notification ID")
    }
    firebase.auth().onAuthStateChanged(async notification => {
        if (notification) {
            var notification = "";
            await database.collection("Notifications").where("status", "!=", "dangerOutOfRange")
                .where("process_status", "==", "Waiting")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        data = doc.data();
                        if (data.id == notification_id) {
                            console.log(data)
                            database.collection("Notifications").doc(doc._delegate._key.path.segments[6]).update({
                                process_status: "In progress"
                            })
                            alert("Action completeted successfully. Refresh the page")
                        }
                    })
                })
        }
    })
}


async function reject() {
    notification_id = document.getElementById('notification_id').value
    if (notification_id < 1) {
        alert("You need to provide a valid notification ID")
    }
    firebase.auth().onAuthStateChanged(async notification => {
        if (notification) {
            var notification = "";
            await database.collection("Notifications").where("status", "!=", "dangerOutOfRange")
                .where("process_status", "==", "Waiting")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        data = doc.data();
                        if (data.id == notification_id) {
                            console.log(data)
                            database.collection("Notifications").doc(doc._delegate._key.path.segments[6]).update({
                                process_status: "Rejected"
                            })
                            alert("Action completeted successfully. Refresh the page")
                        }
                    })
                })
        }
    })
}



async function cancel() {
    notification_id = document.getElementById('notification_id').value
    if (notification_id < 1) {
        alert("You need to provide a valid notification ID")
    }
    firebase.auth().onAuthStateChanged(async notification => {
        if (notification) {
            var notification = "";
            await database.collection("Notifications").where("status", "!=", "dangerOutOfRange")
                .where("process_status", "==", "In progress")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        data = doc.data();
                        if (data.id == notification_id) {
                            console.log(data)
                            database.collection("Notifications").doc(doc._delegate._key.path.segments[6]).update({
                                process_status: "Rejected"
                            })
                            alert("Action completeted successfully. Refresh the page")
                        }
                    })
                })
        }
    })
}



async function completed() {
    notification_id = document.getElementById('notification_id').value
    if (notification_id < 1) {
        alert("You need to provide a valid notification ID")
    }
    firebase.auth().onAuthStateChanged(async notification => {
        if (notification) {
            var notification = "";
            await database.collection("Notifications").where("status", "!=", "dangerOutOfRange")
                .where("process_status", "==", "In progress")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        data = doc.data();
                        if (data.id == notification_id) {
                            console.log(data)
                            database.collection("Notifications").doc(doc._delegate._key.path.segments[6]).update({
                                process_status: "Completed"
                            })
                            alert("Action completeted successfully. Refresh the page")
                        }
                    })
                })
        }
    })
}


async function get_list_size() {
    var list_size = []
    await database.collection("Notifications")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                list_size.push(doc.data())
            });
        })
    return list_size.length + 1
}