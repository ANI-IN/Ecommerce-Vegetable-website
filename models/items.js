const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    category: {
        type: String,
        lowercase: true,
        enum: ['fruit' , 'vegetable']
    },

    quantity: {
        type:Number,
        required:true,
        min:0
    },

    image : {
        type:String
    },

    previous_rates: {
        type:String
    },

    today: {
        type: Number,
        min:0
    },

    index: {
        type:String
    }
})

const Item = new mongoose.model('Item' , ItemSchema);
module.exports = Item;
