const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "school_lost_found",
    port: process.env.DB_PORT || 3306,

    ssl: process.env.DB_SSL === "true"
        ? { minVersion: "TLSv1.2" }
        : undefined
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("MySQL Database Connected Successfully!");
});

module.exports = db;