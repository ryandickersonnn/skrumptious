
const mysql = require('mysql');

// Create a MySQL database connection
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'Important3?',
database: 'student_scheduler_login'
});
users
// Connect to the database
connection.connect(err => {
if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
}
console.log('Connected to the database');
});

// Function to check if the username and password match a record in the table
function checkCredentials(username, password, callback) {
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

    connection.query(query, [username, password], (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error);
            callback(false); // Indicate the login failed
            document.getElementById("username-input").style.border = "1px red solid"
            document.getElementById("username-input").ariaPlaceholder = "That name is taken! Sorry :("
        return;
        }

        if (results.length > 0) {
        // Username and password match
        callback(true);
        } else {
        // Username and password do not match
        callback(false);
        }
    });
}
const username = document.getElementById('username-input').value;
const password = document.getElementById('password-input').value;