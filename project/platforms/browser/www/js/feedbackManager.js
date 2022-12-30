async function sendFeedback() {
    let feedback = document.getElementById('feedback').value
    let subject = document.getElementById('subject').value
    let list = await getAllFeedback();
    var database_ref = database.collection('Feedback')
    alert(list.length)
    database_ref.add({
        id: list.length,
        onderwerp: subject,
        feedback: feedback,
        status: "new"
    }).then(() => {
        alert("Tnx for your feedback, we will look at it as fast as possible")
        window.location = "user_feedback.html"
    }).catch(() => {
        alert('Something went wrong with your feedback')
    });
}

async function getAllFeedback() {
    var listNotifications = []
    await database.collection("Feedback")
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

async function getFeedback(status) {
    var listNotifications = []
    await database.collection("Feedback").where("status", "==", status)
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

async function makeFeedbackTable(feedback) {
    let message = document.getElementById('feedbackMessage');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('FeedbackTable');
    var list;
    if (feedback == "deleted") {
        message.innerHTML = ""
        table.innerHTML = ""
        list = await getFeedback("deleted");
    } else if (feedback == "new") {
        message.innerHTML = ""
        table.innerHTML = ""
        list = await getFeedback("new");
    } else if (feedback == "approved") {
        message.innerHTML = ""
        table.innerHTML = ""
        list = await getFeedback("approved");
    } else {
        message.innerHTML = ""
        table.innerHTML = ""
        list = await getAllFeedback();
    }
    table.appendChild(thead);
    table.appendChild(tbody);
    if (list.length > 0) {
        // Heading
        let headingRow = document.createElement('tr');
        let headingcolom1 = document.createElement('th');
        headingcolom1.innerHTML = "Feedback";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Subject";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Status";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "Options";
        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        thead.appendChild(headingRow);
        // All feedback
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].feedback;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].onderwerp;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].status;
            let colom4 = document.createElement('td');
            if (list[i].status == "new") {
                var button2 = document.createElement("button")
                button2.onclick = button2.onclick = async function() {
                    await DeleteFeedback(list[i].id)
                };
                button2.innerHTML = "Deleted";
                button2.style.backgroundColor = "red";
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
                button.onclick = button.onclick = function() {
                    ApproveFeedback(list[i].id)
                };
                button.innerHTML = "Approved";
                button.style.backgroundColor = "#5ced73";
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
                colom4.appendChild(button);
                colom4.appendChild(button2);
            }
            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            tbody.appendChild(row);
        }
    } else {
        message.innerHTML = "No feedback at the moment";
        message.style.fontSize = "18px";
        message.style.fontFamily = "Roboto, sans-serif";
        message.style.textAlign = "center"; 
    }
}

async function ApproveFeedback(id) {
    await firebase.firestore().collection("Feedback").where("id", "==", id)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.update({ status: "approved" });
            });
        }).then(function() {
            alert("feedback approved")
        }).catch(() => {
            alert('Feedback not approved')
        });
}

async function DeleteFeedback(id) {
    await firebase.firestore().collection("Feedback").where("id", "==", id)
        .get()
        .then(async function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.update({ status: "deleted" });
                //  window.location = "admin_managefeedback.html"
            });
        }).then(function() {
            alert("feedback deleted")
        }).catch(() => {
            alert('Feedback not deleted')
        });
}