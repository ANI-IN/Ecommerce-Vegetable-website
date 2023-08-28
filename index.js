require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

//require("./db/conn");

const favicon = require('serve-favicon');
const Register = require("./models/register");
const async = require("hbs/lib/async");
const exp = require("constants");
const Feedback = require('./models/feedback');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require("./middleware/auth");
const Item = require('./models/items');
const Cart = require('./models/cart');
const mongoose = require('mongoose')



const PORT = process.env.PORT || 3300


const static_path = path.join(__dirname, 'public');
const template_path = path.join(__dirname, 'templates', 'views');
const partials_path = path.join(__dirname, 'templates', 'partials');


app.use(favicon(path.join(static_path , 'css' , 'images' , 'favicon.ico')));

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}




app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);



app.use('/' , auth);
hbs.registerHelper('page', function (arr, pageSize, options) {
    var result = [];
    for (var i = 0; i < arr.length; i += pageSize) {
        result.push(options.fn({ items: arr.slice(i, i + pageSize) }));
    }
    return result.join('');
});

app.get(["/", "/home"],(req, res)=>{
    const isAuthenticated = req.isAuthenticated;
    res.render("index" , {isAuthenticated});
})


app.get("/logout" ,  auth , async(req,res)=>{
   try {
   //  console.log(req.user);

     req.user.tokens = req.user.tokens.filter((currElement)=>{
        return currElement.token !== req.token
     })

     res.clearCookie("jwt")
  //   console.log("Log out success")
     await req.user.save();
     res.render("login");
   } catch (error) {
    res.send(500).send(error);
   }
})

app.get("/register", auth , (req, res)=>{
    const isAuthenticated = req.isAuthenticated;
    if(isAuthenticated){
        res.render("login" , {isAuthenticated});
    }
    else{
        res.render("register" , {isAuthenticated});
    }
})

app.get("/login" , (req,res)=>{
    res.render("login");
})

app.get("/feedback" , auth , (req,res)=>{
    const isAuthenticated = req.isAuthenticated;
    if(isAuthenticated){
        res.render("feedback" , {isAuthenticated});
    }
    else{
        res.render("login");
    }
})

app.get("/FAQ" , auth , (req,res)=>{
    const isAuthenticated = req.isAuthenticated;
    res.render("FAQ" , {isAuthenticated});
})

app.get("/payment" , auth , async(req,res)=>{
    const user_id = req.user._id;
    const crt = await Cart.findOne({customer_id : user_id});
    let sum = 0;
    for(var i =0 ; i < crt.items.length; i++){
        sum += crt.items[i].price;
    }
    //console.log(sum);
    res.render("payment" , {crt , sum});
})

app.get("/services", auth , (req, res)=>{
    const isAuthenticated = req.isAuthenticated;
    res.render("services" , {isAuthenticated});
})

app.get("/success" , auth , async(req,res) => {
    res.render("success");
})

app.get("/fruits" , auth , async(req,res)=>{
    const isAuthenticated = req.isAuthenticated;
    if(isAuthenticated){
        const user_id = req.user._id;
        const fr = await Item.find({category:"fruit"});
        const crt = await Cart.findOne({customer_id : user_id});
        res.render("fruits" , {fr , crt , isAuthenticated});
    }
    else{
        res.render("login");
    }
})

app.get("/vegetables" , auth , async(req,res)=>{
    const isAuthenticated = req.isAuthenticated;
    if(isAuthenticated){
        const user_id = req.user._id;
        const vegg = await Item.find({category:"vegetable"});
        const crt = await Cart.findOne({customer_id : user_id});
        res.render("vegetables" , {vegg , crt, isAuthenticated});
    }
    else{
        res.render("login");
    }
    
})

app.post("/cart/add"  , auth , async(req , res) => {
    try{
        const isAuthenticated = req.isAuthenticated;
        const item_id = req.body.item_id;
        const item_name = req.body.item_name;
        const item_img = req.body.item_img;
        const item_price = req.body.item_price;
        const item_qty = req.body.qty;
        //console.log(req.user)
        const user_id = req.user._id;
        let cart = await Cart.findOne({customer_id : user_id});
        //const crt_items = cart.items;
        if(!cart){
             cart = new Cart({customer_id: user_id , items:[]})
        }

         // Check if the product is already in the cart
        const existingProduct = cart.items.findIndex((item) =>
            item.item_id.equals(item_id)
        );
       if (existingProduct !== -1) {
           // Increase the quantity if the product is already in the cart
           cart.items[existingProduct].quantity += Number(item_qty);
           cart.items[existingProduct].price += Number(item_qty) * Number(item_price);
       } else {
           // Add the product to the cart
           cart.items.push({ item_id: item_id , name :  item_name , quantity: item_qty , price : item_price * item_qty, image:item_img});
       }

       await cart.save();
       res.redirect('back');
       //res.send('product added');
       //res.render('vegetables' , {vegg , crt_items , isAuthenticated});
    } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
    }
})
app.post("/cart/remove" , auth , async(req,res) =>{
    try{
        const itemId = req.body.itemId;
        const user_id = req.user._id;
        await Cart.findOneAndUpdate(
            {customer_id: user_id},            
            {$pull: {items : {item_id : itemId}}}
        )
        res.redirect('back');
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error');
    }
})

 app.get("/trends",(req, res)=>{
     res.render("trends");
 })

  app.post("/register", async (req, res) => {
    try {
        const registerEmployee = new Register({
            full_name: req.body.full_name,
            email: req.body.email,
            password: req.body.password,
        });

      //  console.log("The success " + registerEmployee);
        const token = await registerEmployee.generateAuthToken();
      //  console.log("The token part " + token);
      res.cookie("jwt",token,{
        expires: new Date(Date.now()+30000000),
        httpOnly:true
      });
      
    //  console.log(cookie);

        const registered = await registerEmployee.save();
        const newCart = new Cart({ customer_id: registerEmployee._id, items: [] });
        await newCart.save();

        registerEmployee.cart = newCart._id;
        await registerEmployee.save();

      //  console.log("The page part " + registered);

        res.render("register", { success: "Registration successful!." });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Register.findOne({ email: email });
        
        const isMatch = await bcrypt.compare(password,user.password);

        const token = await user.generateAuthToken();
       // console.log("The token part " + token);
      
        res.cookie("jwt",token,{
            expires: new Date(Date.now()+30000000),
            httpOnly:true
        });
        

        if (user && isMatch) {
            // Successful login
            
            res.redirect("/");
        } else {
            res.redirect("/login?error=Invalid%20email%20or%20password");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Invalid");
    }
});

app.post("/feedback", async(req, res)=>{
    try {
                const feed = new Feedback({
                textAreaData: req.body.textAreaData,
               
                createdAt: Date.now()
            })
    
            const newFeedback = await feed.save();
            res.status(201).render("index");
       
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/:id" , async(req,res)=>{
     const {id} = req.params;
     const product = await Item.findById(id);
     //console.log(id);
     res.render("show" , {product});
     })


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is Running at http://localhost:${PORT}`);
    });

})

