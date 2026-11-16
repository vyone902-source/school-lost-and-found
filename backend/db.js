const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "school_lost_found"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("MySQL Database Connected Successfully!");
});

module.exports = db;