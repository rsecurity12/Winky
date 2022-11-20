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
const auth = firebase.auth()
const database = firebase.firestore();

function register() {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    first_name = document.getElementById('first_name').value;
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false || validate_field(first_name) == false) {
        alert('Something went wrong! Try again!')
        return
        // Don't continue running the code
    }
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then(function() {
            // Declare user variable
            var user = auth.currentUser
                // Add this user to Firebase Database
            var database_ref = database.collection('UserRoles');
            // Create User data
            var user_data = {
                email: email,
                first_name: first_name,
                last_login: Date.now(),
                userRole: "user"
            };
            // Push to Firebase Database
            database_ref.doc(user.uid).set(user_data).then(() => {
                // Done
                alert('User created with success! You will be redirected to the login page!')
                window.location = "../anonymousUser/login.html";
            })
        })
        .catch(function(error) {
            // Firebase will use this to alert of its errors
            alert(error.message)
        });
}

function login() {
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    auth.signInWithEmailAndPassword(email, password)
        .then(function() {
            var user = auth.currentUser
            var database_ref = database.collection('UserRoles')
            var user_data = {
                last_login: Date.now()
            }
            database_ref.doc(user.uid).update(user_data).then(() => {
                alert('Login success!')
                const db = firebase.firestore()
                db.collection('UserRoles')
                    .doc(user.uid)
                    .get().then((user) => {
                        if (user.data().userRole == "user") {
                            window.location = "../user/user_map.html"
                        } else if (user.data().userRole == "stadsmedewerker") {
                            window.location = "../stadsmedewerker/stadsmedewerker_profile.html"
                        } else if (user.data().userRole == "admin") {
                            window.location = "../admin/admin_homepage.html"
                        }
                    })
            })
        })
        .catch(function(error) {
            alert(error.message)
        })
}

function sendResetMail() {
    email = document.getElementById('email').value;
    alert(email)
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Check yout mailbox")
            window.location.href = "../anonymousUser/login.html"
        })
        .catch(() => {
            alert("Email adress doesn't exist or it is from a specific domain")
        });
}

async function getAllEpmloyees() {
    // Not from the auth buth from the database with userRoles because this isn't on a server
    var listCityEmployee = []
    await database.collection("UserRoles").where("userRole", "==", "stadsmedewerker")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                listCityEmployee.push(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    console.log(listCityEmployee);
    return listCityEmployee;
};

function makeUserTable() {
    var list = getAllEpmloyees();

    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('userTable').appendChild(table);

    table.appendChild(thead);
    table.appendChild(tbody);
    let row_1 = document.createElement('tr');
    let heading_1 = document.createElement('th');
    heading_1.innerHTML = "Sr. No.";
    let heading_2 = document.createElement('th');
    heading_2.innerHTML = "Name";
    let heading_3 = document.createElement('th');
    heading_3.innerHTML = "Company";

    row_1.appendChild(heading_1);
    row_1.appendChild(heading_2);
    row_1.appendChild(heading_3);
    thead.appendChild(row_1);

}

function deleteUser() {
    // Not possible because it's not on a server
}

function createEmployee() {
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    first_name = document.getElementById('first_name').value;
    city = document.getElementById('city').value;
    const auth = firebase.auth()
    auth.createUserWithEmailAndPassword(email, password)
        .then(function() {
            var user = auth.currentUser
            var database_ref = database.collection('UserRoles');
            var user_data = {
                email: email,
                first_name: first_name,
                last_login: Date.now(),
                userRole: "stadsmedewerker",
                city: city
            };
            database_ref.doc(user.uid).set(user_data).then(() => {
                alert('User created with success!')
            });
        });
}

// Validate Functions
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
        // Email is good
        return true
    } else {
        // Email is not good
        return false
    }
}

function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
        return false
    } else {
        return true
    }
}

function validate_field(field) {
    if (field == null) {
        return false
    }
    if (field.length <= 0) {
        return false
    } else {
        return true
    }
}