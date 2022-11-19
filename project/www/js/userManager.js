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
                window.location = "../html/login.html";
            })
        })
        .catch(function(error) {
            // Firebase will use this to alert of its errors
            alert(error.message)
        });
}


// Set up our login function
function login() {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    auth.signInWithEmailAndPassword(email, password)
        .then(function() {
            // Declare user variable
            var user = auth.currentUser
                // Add this user to Firebase Database
            var database_ref = database.collection('UserRoles')
                // Create User data
            var user_data = {
                    last_login: Date.now()
                }
                // Push to Firebase Database
                // Push to Firebase Database
            database_ref.doc(user.uid).update(user_data).then(() => {
                // Done
                alert('Login success!')

                const db = firebase.firestore()
                db.collection('UserRoles')
                    .doc(user.uid) // change to the current user id 
                    .get().then((user) => {
                        if (user.data().userRole == "user") {
                            window.location = "../html/user_profile.html"
                        } else if (user.data().userRole == "stadsmedewerker") {
                            window.location = "../html/stadsmedewerker_profile.html"
                        } else if (user.data().userRole == "admin") {
                            window.location = "../html/admin_profile.html"
                        }
                    })
            })
        })
        .catch(function(error) {
            // Firebase will use this to alert of its errors
            var error_code = error.code
            var error_message = error.message
            alert(error_message)
        })
}
auth.signInWithEmailAndPassword(email, password)
    .then(function() {
        // Declare user variable
        var user = auth.currentUser;
        // Add this user to Firebase Database
        var database_ref = database.collection('UserRoles');
        // Create User data
        var user_data = {
            last_login: Date.now()
        };
        // Push to Firebase Database
        database_ref.doc(user.uid).update(user_data).then(() => {
            // Done
            alert('Login succceed!')
            window.location.href = "../html/map.html"
        })
    })
    .catch(function(error) {
        // Firebase will use this to alert of its errors
        alert(error.message)
    })

function sendResetMail() {
    email = document.getElementById('email').value;
    alert(email)
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Check yout mailbox")
            window.location.href = "../html/login.html"
        })
        .catch(() => {
            alert("Email adress doesn't exist or it is from a specific domain")
        });

}

function getAllUsers(res) {
    /*    const maxResults = 1;
        auth.listUsers(maxResults).then((userRecords) => {
            userRecords.users.forEach((user) => console.log(user.toJSON()));
            res.end('Retrieved users list successfully.');
        }).catch((error) => console.log(error));
        console.log("test");
        */
};

function deleteUser(email) {
    /* const user = firebase.auth().where(user => user.email === email);
     user.delete().then(() => {
         alert("succes")
     }).catch(() => {
         alert("no succes")
     });
     */
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