const express = require('express')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = express()

var cookieParser = require('cookie-parser')
app.use(express.json())
app.use(cookieParser())
PORT = process.env.PORT
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT

})

// Middleware to authenticate the user
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(403); // Forbidden

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


app.post('/register', async (req, res) => {
    try {
        const userName = req.body.username
        const email = req.body.email
        const password = req.body.password

        const result = await pool.query(`SELECT * FROM users WHERE EMAIL='${email}' AND USERNAME='${userName}'`)
        if (result.rows.lengt > 0) {
            res.json("UserName or email alread exists")
        }
        const hasedPassword = await bcrypt.hash(password, 10)

        await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [userName, hasedPassword, email]);
        res.status(201).json({ message: "User registered successfully" })

    }
    catch (error) {
        res.status(500).json({ error: "Server error" })
        console.error(`Error while creating the user ${error}`)
    }
})

app.post('/login', async (req, res) => {
    const userName = req.body.username
    const password = req.body.password
    try {
        const result = await pool.query(`SELECT * FROM users WHERE username='${userName}'`)
        if (result.rows.length == 0) {
            return res.status(400).json({ message: "User does not exist, kindly register the user first" })
        }
        const user = result.rows[0]

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).json({ message: "Invaild credentials" })
        }

        const token = jwt.sign({ id: user.id, usernae: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(200).json({ message: "User login Successfully", token: token })

    }
    catch (error) {
        res.status(500).json({ error: "Server error" })
        console.error(`Error while login the user ${error}`)
    }
})

app.get('/protected', authenticateJWT, (req, res) => {
    try {
        res.status(200).json({ message: "User can access this route" })
    }
    catch (error) {
        console.error(`Error while accesing the page ${error}`)
    }

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})