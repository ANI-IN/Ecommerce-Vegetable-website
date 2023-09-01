const async = require("hbs/lib/async");
const mongoose = require("mongoose");
const bcrypt =require("bcrypt");
const jwt=require("jsonwebtoken");

const employeeSchema= new mongoose.Schema({
    full_name: {
        type:String, 
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    cart: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cart' 
    },
    tokens: [{
        token: {
            type:String,
            required:true
        }
    }]
})

employeeSchema.methods.generateAuthToken = async function(){
    try {
   //     console.log(this._id);

        const token = jwt.sign({_id:this._id.toString()},'grindtillyoufckit/reversethekey/asdsad');
        this.tokens = this.tokens.concat({token:token});

  //     console.log(token);

        await this.save();
        return token;

    } catch (error) {
        //res.send("The Error part " + error);
        console.log("The Error part "+ error);
    }
}

employeeSchema.pre("save",async function(next){

     
    if(this.isModified("password"))
    {
       // console.log(`The current password ${this.password}`);
        this.password = await bcrypt.hash(this.password,10)
       // console.log(`The current password ${this.password}`);
    }
    next();
})


const Register = new mongoose.model("Register",employeeSchema);
module.exports=Register;
