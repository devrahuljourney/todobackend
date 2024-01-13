
const User = require("../modals/User");

const mongoose = require('mongoose');
const Todo = require("../modals/todos");

exports.getTodos = async (req, res) => {
    try {
        // Ensure that req.user is available
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not authenticated.",
            });
        }

        const userId = req.user.id;
        console.log("User ID:", userId);

        const todos = await Todo.find({ 'user': userId });

        if (!todos.length) {
            return res.status(404).json({
                success: false,
                message: "No todos found for the user",
            });
        }

        return res.status(200).json({
            success: true,
            data: todos,
            message: "Successfully found todos",
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Error fetching todos.",
        });
    }
};


exports.createTodo = async (req, res) => {
    const userId = req.user ? req.user.id : undefined;

    const { title, description, isCompleted } = req.body;

    console.log("user ", userId)

    try {
        const newTodo = await Todo.create({
            title,
            description,
            isCompleted,
            user : userId 
        });
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success:"false",
                message:"user not found to populate todo"
            })
        }
        else{
            user.todos.push(newTodo._id);
            await user.save();

        }
        return res.status(201).json({
            success: true,
            data: newTodo,
            userid: userId,
            message: "Todo created successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error in creating todo"
        });
    }
};



exports.updateTodo = async (req, res) => {
    const userId = req.user.id;
    const { title, description, isCompleted } = req.body;
    const todoId = req.params.id;
    
    console.log("Received update request for todo with ID:", todoId);

    try {

        // Convert todoId to ObjectId
        // const todoObjectId =   mongoose.Types.ObjectId(todoId);

        
        // console.log("object id of todo ", todoObjectId);
        // const existingTodo = await Todo.findOne({ '_id':  todoObjectId, 'user.id': userId });

        // if (!existingTodo) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Todo not found ",
        //     });
        // }

        const updatedTodo = await Todo.findById(todoId);
        updatedTodo.title = title;
        updatedTodo.description = description;
        updatedTodo.isCompleted = isCompleted;
        
        await updatedTodo.save();
        

        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found or user does not own the todo",
            });
        }


        return res.status(200).json({
            success: true,
            data: updatedTodo,
            message: "Todo updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating todo",
            error: error.message,
        });
    
    }

};

exports.deleteTodo = async (req, res) => {
    const todoId = req.params.id;

    try {
        const deleted = await Todo.deleteOne({ '_id': todoId });

        if (!deleted) {
            res.status(400).json({
                success: false,
                message: "Not able to find todo"
            });
        }

        res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error in deleting todo"
        });
    }
};
