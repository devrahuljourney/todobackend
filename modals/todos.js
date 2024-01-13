const mongoose = require('mongoose');
const User = require('./User');

const todosSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    },
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        
    }
    
});

module.exports = mongoose.model('Todo', todosSchema);
