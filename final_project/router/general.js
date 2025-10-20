const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
// Use async (but async is optional)
public_users.get('/', async (req, res) => {
    try {
      const getBooks = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 1000);
      });
  
      const allBooks = await getBooks;
      res.send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
      res.status(500).send("Unable to fetch book list...");
    }
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    //Write your code here
    try {
        const isbn = req.params.isbn;
        res.send(books[isbn]);

    } catch (err) {
        res.status(500).send("Unable to fetch books by ISBN.");
    }
});
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
    try { 

        const authorParam = req.params.author;
        const filtered_list = Object.values(books).filter(isbn => 
            isbn.author.includes(authorParam)
        );
        res.send(filtered_list);

    } catch (err) {
        res.status(500).end("Unable to fetch books by author at this time.");
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        
        const titleParam = req.params.title;
        const filtered_list = Object.values(books).filter(isbn => 
            isbn.title.includes(titleParam)
        );
        res.send(filtered_list);

    } catch (err) {
        res.status(500).send("Unable to fetch books by title.")
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
//Write your code here
    const isbn = req.params.isbn;
    const reviewsList = books[isbn].reviews;

    res.send(reviewsList);

    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
