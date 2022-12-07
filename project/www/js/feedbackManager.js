function sendFeedback() {
    feedback = document.getElementById('feedback')
    onderwerp = document.getElementById('onderwerp')
    var database_ref = database.collection('feedback')
    database_ref.add({
        onderwerp: onderwerp,
        feedback: feedback,
        status: "new"
    }).then(() => {
        alert("Tnx for your feedback, we will look at it as fast as possible")
        window.location = "feedback.html"
    }).catch(() => {
        alert('Something went wrong with your feedback')
    });
}

async function getAllFeedback() {
    var listNotifications = []
    await database.collection("feedback").where("status", "==", "new")
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

async function makeFeedbackTable() {
    var list = await getAllFeedback();
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('FeedbackTable');
    table.appendChild(thead);
    table.appendChild(tbody);
    // Heading
    let headingRow = document.createElement('tr');
    let headingcolom1 = document.createElement('th');
    headingcolom1.innerHTML = "feedback";
    let headingcolom2 = document.createElement('th');
    headingcolom2.innerHTML = "onderwerp";
    let headingcolom3 = document.createElement('th');
    headingcolom3.innerHTML = "status";
    headingRow.appendChild(headingcolom1);
    headingRow.appendChild(headingcolom2);
    headingRow.appendChild(headingcolom3);
    thead.appendChild(headingRow);
    // All Users
    for (let i = 0; i < list.length; i++) {
        let row = document.createElement('tr');
        let colom1 = document.createElement('td');
        colom1.innerHTML = list[i].feedback;
        let colom2 = document.createElement('td');
        colom2.innerHTML = list[i].onderwerp;
        let colom3 = document.createElement('td');
        colom3.innerHTML = list[i].status;
        let colom4 = document.createElement('td');
        var button2 = document.createElement("button")
        button2.onclick = button2.onclick = function() {
            DeleteFeedback()
        };
        button2.innerHTML = "Deleted";
        var button = document.createElement("button")
        button.onclick = button.onclick = function() {
            ApproveFeedback(feedback, onderwerp)
        };
        button.innerHTML = "Approved";
        colom4.appendChild(button);
        colom4.appendChild(button2);
        row.appendChild(colom1);
        row.appendChild(colom2);
        row.appendChild(colom3);
        row.appendChild(colom4);
        tbody.appendChild(row);
    }
}

async function ApproveFeedback(feedback, onderwerp) {

}

async function DeleteFeedback(feedback, onderwerp) {

}