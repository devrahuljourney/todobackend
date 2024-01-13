const express = require('express');
const router = express.Router();

const { signup, login } = require("../controllers/Auth");
const { auth, isStudent, isAdmin } = require("../Authemtication/auth");
const { deleteTodo } = require('../controllers/Todo');
const createTodoController = require('../controllers/Todo').createTodo; 
const getTodosController = require('../controllers/Todo').getTodos; 
const updateTodo =  require('../controllers/Todo').updateTodo; 

router.post("/signup",signup);
router.post("/login", login);
router.post('/createtodo', auth, createTodoController); 
router.get('/gettodo',auth, getTodosController);
router.post('/update/:id',auth, updateTodo);
router.delete('/delete/:id',auth, deleteTodo);
router.post('/logout', (req, res) => {
    try {
        // Attempt to clear the JWT token cookie
        res.clearCookie('token');
        console.log("logout successfully")
        // Send a success response
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        // Handle any potential errors
        console.error("Error during logout:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during logout"
        });
    }
});



// protected route 
router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for Test"
    });
});

router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for student"
    });
});

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for admin"
    });
});

module.exports = router;
