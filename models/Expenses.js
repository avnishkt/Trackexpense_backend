const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true    
    },
    category: {
        type: String,
        default: "Others"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('expense', expenseSchema);