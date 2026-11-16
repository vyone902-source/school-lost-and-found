const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Test route
app.get("/", (req, res) => {
    res.send("School Lost and Found Backend is Running!");
});
// Search for items
app.get("/api/items/search", (req, res) => {
    const keyword = req.query.keyword || "";

    const sql = `
        SELECT * FROM items
        WHERE name LIKE ?
        OR category LIKE ?
        OR location LIKE ?
        ORDER BY created_at DESC
    `;

    const searchValue = `%${keyword}%`;

    db.query(
        sql,
        [searchValue, searchValue, searchValue],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Search failed"
                });
            }

            res.json(results);
        }
    );
});
// Get all reported items
app.get("/api/items", (req, res) => {
    const sql = "SELECT * FROM items ORDER BY created_at DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to retrieve items"
            });
        }

        res.json(results);
    });
});
// Report a lost or found item
app.post("/api/items", (req, res) => {
    const { name, status, category, location, description, image } = req.body;

    if (!name || !status) {
        return res.status(400).json({
            message: "Item name and status are required"
        });
    }

    const sql = `
        INSERT INTO items
        (name, status, category, location, description, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, status, category, location, description, image],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to report item"
                });
            }

            res.status(201).json({
                message: "Item reported successfully!",
                itemId: result.insertId
            });
        }
    );
});
// Mark an item as claimed
app.put("/api/items/:id/claim", (req, res) => {
    const itemId = req.params.id;

    const sql = "UPDATE items SET status = 'Claimed' WHERE id = ?";

    db.query(sql, [itemId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to update item"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.json({
            message: "Item marked as claimed successfully!"
        });
    });
});
// Delete an item
app.delete("/api/items/:id", (req, res) => {
    const itemId = req.params.id;

    const sql = "DELETE FROM items WHERE id = ?";

    db.query(sql, [itemId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to delete item"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.json({
            message: "Item deleted successfully!"
        });
    });
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});