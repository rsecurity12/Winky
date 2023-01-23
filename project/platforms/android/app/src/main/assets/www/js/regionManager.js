async function save_region() {
    radius = document.getElementById('radius').value
    lat = document.getElementById('latitude').value
    lng = document.getElementById('lng').value
    loc = document.getElementById('location').value
    city = document.getElementById('city').value
    list = await getAllRegions();
    var database_ref = database.collection('Regions');
    database_ref.add({
        loc: loc,
        lat: lat,
        lng: lng,
        radius: radius * 1000,
        city: city,
        status: "danger",
        id: list.length
    }).then(async() => {
        await makeAllNotificationsStatusRight(city);
        alert('Region added')
            // window.location = "admin_regions.html"
    }).catch(() => {
        alert(`Region ${city} not added`)
    });
}

async function makeAllNotificationsStatusRight(city) {
    await firebase.firestore().collection("Notifications").where("city", "==", city)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                lat = doc.data().lat
                lng = doc.data().long
                point = { lat, lng };
                if (await pointInCircles(point)) {
                    doc.ref.update({ status: "danger" });
                } else {
                    doc.ref.update({ status: "dangerOutOfRange" });

                }
            });
        });
}

async function pointInCircles(point) {
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

async function pointInCircle(region, point) {
    point = L.latLng(point)
    var circle = region
    latLng = L.latLng(circle["lat"], circle["lng"]);
    if (point.distanceTo(latLng) < circle["radius"]) {
        alert(true)
        return true;
    }
    alert(false)
    return false;
}
async function makeAllNotificationsStatusOuthOfRange(id, city) {
    let region;
    await firebase.firestore().collection("Region").where("id", "==", id)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                console.log(doc.data);
                region = doc.data
            })
        })
    await firebase.firestore().collection("Notifications").where("city", "==", city)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                lat = doc.data().lat
                lng = doc.data().long
                point = { lat, lng };
                if (await pointInCircle(region, point)) {
                    doc.ref.update({ status: "dangerOutOfRange" });
                } else {
                    doc.ref.update({ status: "danger" });
                }
            });
        })
}

async function getAllRunningRegions() {
    var listRegions = []
    await database.collection("Regions").where("status", "==", "running")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                listRegions.push(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    return listRegions;
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
    return listRegions;
}

async function deleteRegions(id) {
    let city = ""
    await firebase.firestore().collection("Regions").where("id", "==", id)
        .get()
        .then(async function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.update({ status: "deleted" });
                city = doc.data().city;
            });
        }).then(() => {
            alert("Region deleted");
        }).catch(() => {
            alert('Region not deleted');
        });
    alert(city)
    await makeAllNotificationsStatusOuthOfRange(id, city)
}

async function setInputValue() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    let region = await getRegionById(id)
    document.getElementById('radius').value = region.radius / 1000;
    document.getElementById('latitude').value = region.lat;
    document.getElementById('lng').value = region.lng;
    document.getElementById('location').value = region.loc;
    document.getElementById('city').value = region.city;
}

async function updateRegion(radius, lat, lng, loc, city) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    await firebase.firestore().collection("Regions").where("id", "==", parseInt(id))
        .get()
        .then(async function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.update({
                    radius: radius * 1000,
                    lat: lat,
                    lng: lng,
                    loc: loc,
                    city: city
                });
                //  window.location = "admin_manageregions.html"
            });
        }).then(function() {
            alert("Region updated")
        }).catch(() => {
            alert('Region not updated')
        });
    await makeAllNotificationsStatusRight(city)
}

async function getRegionById(id) {
    var listRegions = []
    await database.collection("Regions").where("id", "==", parseInt(id))
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
    return listRegions[0];
}

async function makeRegionTable() {
    var list = await getAllRunningRegions();
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('regionTable');
    table.appendChild(thead);
    table.appendChild(tbody);
    if (list.length > 0) {
        // Heading
        let headingRow = document.createElement('tr');
        let headingcolom1 = document.createElement('th');
        headingcolom1.innerHTML = "City";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Location name";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Radius (km)";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "Latitude";
        let headingcolom5 = document.createElement('th');
        headingcolom5.innerHTML = "Longitude";
        let headingcolom6 = document.createElement('th');
        headingcolom6.innerHTML = "Options";
        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        headingRow.appendChild(headingcolom5);
        headingRow.appendChild(headingcolom6)
        thead.appendChild(headingRow);
        // All regions
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].city;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].loc;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].radius / 1000;
            let colom4 = document.createElement('td');
            colom4.innerHTML = list[i].lat;
            let colom5 = document.createElement('td');
            colom5.innerHTML = list[i].lng;
            let colom6 = document.createElement('td');
            var button2 = document.createElement("button")
            button2.onclick = button2.onclick = function() {
                window.location = "admin_updateregion.html?id=" + list[i].id;
            };
            button2.innerHTML = "Change";
            button2.style.backgroundColor = "#008CBA";
            button2.style.border = "none";
            button2.style.padding = "7px";
            button2.style.borderRadius = "15px";
            button2.style.textAlign = "center";
            button2.style.fontSize = "16px";
            button2.style.fontFamily = "Roboto, sans-serif";
            button2.style.fontWeight = "bold";
            button2.style.margin = "4px";
            button2.style.cursor = "pointer";
            button2.style.color = "white";
            var button = document.createElement("button")
            button.onclick = button.onclick = async function() {
                await deleteRegions(list[i].id)
            };
            button.innerHTML = "Delete";
            button.style.backgroundColor = "red";
            button.style.border = "none";
            button.style.padding = "7px";
            button.style.borderRadius = "15px";
            button.style.textAlign = "center";
            button.style.fontSize = "16px";
            button.style.fontFamily = "Roboto, sans-serif";
            button.style.fontWeight = "bold";
            button.style.margin = "4px";
            button.style.cursor = "pointer";
            button.style.color = "white";
            colom6.appendChild(button);
            colom6.appendChild(button2);
            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            row.appendChild(colom5);
            row.appendChild(colom6);
            tbody.appendChild(row);
        }
    } else {
        let message = document.getElementById('regionMessage');
        message.innerHTML = "No regions"
        message.style.fontFamily = "Roboto, sans-serif"
        message.style.fontSize = "18px"
        message.style.textAlign = "center";
    }
}