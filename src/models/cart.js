const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Register',
    required: true,
  },

  items : [
    {
    item_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required:true,
    },
    name:{
      type : String,
      required: true,
    } ,
    quantity : {
      type:Number,
      required:true,
      min:0,
      max:9
     },
     price:{
      type:Number,
      required:true,
      min:0
     },
     image:{
      type:String
     }
    }
  ],
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
