const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON from the request body
app.use(express.json());

const usersFilePath = path.join(__dirname, 'users.json');

app.get('/', (req, res) => {
    fs.readFile(usersFilePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File doesn't exist, return an empty array
                res.json([]);
            } else {
                // Other error, return a 500 status with an error message
                console.error('Error reading file:', err);
                res.status(500).json({ error: 'Error reading file' });
            }
            return;
        }

        if (data.length === 0) {
            res.json([]);
            return;
        }

        try {
            const users = JSON.parse(data)
            res.json(users);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Error parsing JSON' });
        }
    });
});

// Route for creating a new user
app.post('/', (req, res) => {
    const newUser = req.body;
    fs.readFile(usersFilePath, (err, data) => {
        if (err) {
            res.status(500).json({error: 'Error reading file'});
            return;
        }
        let users = [];
        if (data.length > 0) {
            try {
                users = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                res.status(500).json({ error: 'Error parsing JSON' });
                return;
            }
        }
        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
            if (err) {
                res.status(500).json({error: 'Error writing file'});
                return;
            }
            res.json(newUser);
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
