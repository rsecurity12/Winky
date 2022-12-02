function save_region() {
    radius = document.getElementById('radius').value
    lat = document.getElementById('latitude').value
    lng = document.getElementById('lng').value
    loc = document.getElementById('location').value
    city = document.getElementById('city').value
    var database_ref = database.collection('Regions');
    database_ref.add({
        loc: loc,
        lat: lat,
        lng: lng,
        radius: radius * 1000,
        city: city,
        status: "running"
    }).then(() => {
        alert('Region added')
        window.location = "admin_regions.html"
    }).catch(() => {
        alert('Region not added')
    });
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

async function makeRegionTable() {

    var list = await getAllRunningRegions();
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('regionTable');
    table.appendChild(thead);
    table.appendChild(tbody);
    // Heading
    let headingRow = document.createElement('tr');
    let headingcolom1 = document.createElement('th');
    headingcolom1.innerHTML = "City";
    let headingcolom2 = document.createElement('th');
    headingcolom2.innerHTML = "Location name";
    let headingcolom3 = document.createElement('th');
    headingcolom3.innerHTML = "Radius";
    let headingcolom4 = document.createElement('th');
    headingcolom4.innerHTML = "Latitude";
    let headingcolom5 = document.createElement('th');
    headingcolom5.innerHTML = "Langitude";
    headingRow.appendChild(headingcolom1);
    headingRow.appendChild(headingcolom2);
    headingRow.appendChild(headingcolom3);
    headingRow.appendChild(headingcolom4);
    headingRow.appendChild(headingcolom5);
    thead.appendChild(headingRow);

    // All Users
    for (let i = 0; i < list.length; i++) {
        let row = document.createElement('tr');
        let colom1 = document.createElement('td');
        colom1.innerHTML = list[i].city;
        let colom2 = document.createElement('td');
        colom2.innerHTML = list[i].loc;
        let colom3 = document.createElement('td');
        colom3.innerHTML = list[i].radius / 1000 + "km";
        let colom4 = document.createElement('td');
        colom4.innerHTML = list[i].lat;
        let colom5 = document.createElement('td');
        colom5.innerHTML = list[i].lng;
        let colom6 = document.createElement('td');
        var button2 = document.createElement("button")
        button2.onclick = button2.onclick = function() {
            alert("Change Button is clicked");
        };
        button2.innerHTML = "Change";
        var button = document.createElement("button")
        button.onclick = button.onclick = function() {
            deleteRegions(list[i].lat, list[i].lng)
        };
        button.innerHTML = "Delete";
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
}

function deleteRegions(lat, lng) {
    // update zodat er geen gegevens uit de DB verwijderd worden

}