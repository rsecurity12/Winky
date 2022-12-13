async function register() {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    first_name = document.getElementById('first_name').value;
    last_name = document.getElementById('last_name').value;
    phone_number = document.getElementById('phone_number').value;

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false || validate_field(first_name) == false) {
        alert('Something went wrong! Try again!')
        return
        // Don't continue running the code
    }

    // Validate phone number
    if (validate_phone_number(phone_number) == false) {
        alert('Something went wrong! You can only use a Belgian phone provider\nExample number:466xxxxxx')
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
                last_name: last_name,
                phone_number: phone_number,
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
                            window.location = "../stadsmedewerker/cityemployee_profile.html"
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
            alert("Email address doesn't exist or it is from a specific domain")
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

async function makeUserTable() {
    var list = await getAllEpmloyees();
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let table = document.getElementById('userTable');
    table.appendChild(thead);
    table.appendChild(tbody);
    // Heading
    if (list.length > 0) {
        let headingRow = document.createElement('tr');
        let headingcolom1 = document.createElement('th');
        headingcolom1.innerHTML = "City";
        let headingcolom2 = document.createElement('th');
        headingcolom2.innerHTML = "Firstname";
        let headingcolom3 = document.createElement('th');
        headingcolom3.innerHTML = "Lastname";
        let headingcolom4 = document.createElement('th');
        headingcolom4.innerHTML = "Email";
        let headingcolom5 = document.createElement('th');
        headingcolom5.innerHTML = "Phonenumber";
        let headingcolom6 = document.createElement('th');
        head4ngcolom6.innerHTML = "Userrole";
        let headingcolom7 = document.createElement('th');
        headingcolom7.innerHTML = "Last loged in";
        headingRow.appendChild(headingcolom1);
        headingRow.appendChild(headingcolom2);
        headingRow.appendChild(headingcolom3);
        headingRow.appendChild(headingcolom4);
        headingRow.appendChild(headingcolom5);
        headingRow.appendChild(headingcolom6);
        headingRow.appendChild(headingcolom7);
        thead.appendChild(headingRow);
        // All Users
        for (let i = 0; i < list.length; i++) {
            let row = document.createElement('tr');
            let colom1 = document.createElement('td');
            colom1.innerHTML = list[i].city;
            let colom2 = document.createElement('td');
            colom2.innerHTML = list[i].first_name;
            let colom3 = document.createElement('td');
            colom3.innerHTML = list[i].last_name;
            let colom4 = document.createElement('td');
            colom4.innerHTML = list[i].email;
            let colom5 = document.createElement('td');
            colom5.innerHTML = list[i].phone_number;
            let colom6 = document.createElement('td');
            colom6.innerHTML = list[i].userRole;
            let colom7 = document.createElement('td');
            colom7.innerHTML = new Date(list[i].last_login);
            let colom8 = document.createElement('td');
            var button = document.createElement("button")
            button.innerHTML = "Delete";
            colom9.appendChild(button);
            row.appendChild(colom1);
            row.appendChild(colom2);
            row.appendChild(colom3);
            row.appendChild(colom4);
            row.appendChild(colom5);
            row.appendChild(colom6);
            row.appendChild(colom7);
            row.appendChild(colom8);
            tbody.appendChild(row);
        }
    } else {
        let message = document.getElementById('regionMessage');
        message.innerHTML = "No users"
    }
}

function deleteUser() {
    // Not possible because it's not on a server
}

function createEmployee() {
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    first_name = document.getElementById('first_name').value;
    last_name = document.getElementById('last_name').value;
    city = document.getElementById('city').value;
     phone_number = document.getElementById('phone_number').value;
    const auth = firebase.auth()
    auth.createUserWithEmailAndPassword(email, password)
        .then(function() {
            var user = auth.currentUser
            var database_ref = database.collection('UserRoles');
            var user_data = {
                email: email,
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number,
                last_login: Date.now(),
                userRole: "stadsmedewerker",
                city: city
            };
            database_ref.doc(user.uid).set(user_data).then(() => {
                alert('User created with success!')
                window.location = "admin_manageuser.html";
            }).else(() => {
                alert('Something went wrong!')

            })
        });
}

async function greeting_user(name) {
    document.getElementById('medewerkers_name').innerHTML = "Welcome " + name;
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

function validate_phone_number(input_str) {
   var phoneno = /^\(?([0-9]{3})[-. ]?([0-9]{6})$/;
    return phoneno.test(input_str);
  }

  

  
async function GetCurrentUserData() {
    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            var data = "";
            await database.collection("UserRoles").where("email", "==", user.email)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        data = doc.data();
                        console.log(data)
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        }
    })
}


async function userDetails() {
    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            var data = "";
            await database.collection("UserRoles").where("email", "==", user.email)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        data = doc.data();
                        console.log(data)
                    });
                })
                    document.getElementById("first_name").placeholder = data.first_name
                    document.getElementById("last_name").placeholder = data.last_name
                    document.getElementById("phone_number").placeholder = data.phone_number
            
        }
    })
}






