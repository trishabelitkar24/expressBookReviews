
const express = require('express');
const axios = require('axios');

let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'User already exists'
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: 'User successfully registered'
    });
});

// Retrieve all books using Axios and async/await
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

// Internal data route used by Axios
public_users.get('/api/books', (req, res) => {
    return res.status(200).json(books);
});

// Retrieve book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/books');
        const book = response.data[req.params.isbn];

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to retrieve book'
        });
    }
});

// Retrieve books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/books');
        const author = req.params.author.toLowerCase();

        const result = Object.values(response.data).filter(
            book => book.author.toLowerCase() === author
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

// Retrieve books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/books');
        const title = req.params.title.toLowerCase();

        const result = Object.values(response.data).filter(
            book => book.title.toLowerCase() === title
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

// Retrieve reviews for a book
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
