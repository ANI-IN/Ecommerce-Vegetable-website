require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn");
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


const port=process.env.PORT || 3300;


const static_path="/Users/animesh/Desktop/Registration/public"
const template_path="/Users/animesh/Desktop/Registration/templates/views"
const partials_path="/Users/animesh/Desktop/Registration/templates/partials"



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

app.get("/",(req, res)=>{
    const isAuthenticated = req.isAuthenticated;
    res.render("index" , {isAuthenticated});
})


app.get("/login" , (req,res)=>{
    res.render("login");
})


app.get("/logout", auth, async (req, res) => {
    try {
       
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token;
        });

        // Clear the JWT cookie
        res.clearCookie("jwt");
        await req.user.save();
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error);
    }
});


app.get("/register", auth , (req, res)=>{
    const isAuthenticated = req.isAuthenticated;
    if(isAuthenticated){
        res.render("login" , {isAuthenticated});
    }
    else{
        res.render("register" , {isAuthenticated});
    }
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


app.get("/payment" , (req,res)=>{
    res.render("payment");
})


app.get("/services", auth , (req, res)=>{
    const isAuthenticated = req.isAuthenticated;
    res.render("services" , {isAuthenticated});
})


app.get("/fruits", auth, async (req, res) => {
    const isAuthenticated = req.isAuthenticated;
    if (isAuthenticated) {
        const user_id = req.user._id;
        let crt_items = [];

        const crt = await Cart.findOne({ customer_id: user_id });

        if (crt) {
            crt_items = crt.items;
        }

        const fr = await Item.find({ category: "fruit" });
        res.render("fruits", { fr, crt_items, isAuthenticated });
    } else {
        res.render("login");
    }
});


app.get("/vegetables" , auth , async(req,res)=>{
    const isAuthenticated = req.isAuthenticated;
    if(isAuthenticated){
        const user_id = req.user._id;
        const vegg = await Item.find({category:"vegetable"});
        const crt = await Cart.findOne({customer_id : user_id});
        const crt_items = crt.items;
        res.render("vegetables" , {vegg , crt_items , isAuthenticated});
    }
    else{
        res.render("login");
    }
})


app.post("/cart/add"  , auth , async(req , res) => {
    try{
        const item_id = req.body.item_id;
        const item_name = req.body.item_name;
        const item_img = req.body.item_img;
        const item_price = req.body.item_price;
        const item_qty = req.body.qty;
        //console.log(req.user)
        const user_id = req.user._id;

        let cart = await Cart.findOne({customer_id : user_id});
        if(!cart){
             cart = new Cart({customer_id: user_id , items:[]})
        }

        const existingProduct = cart.items.findIndex((item) =>
            item.item_id.equals(item_id)
        );

       if (existingProduct !== -1) {
           
           cart.items[existingProduct].quantity += item_qty;
           cart.items[existingProduct].price = item_price *item_qty;
       } else {
          
           cart.items.push({ item_id: item_id , name :  item_name , quantity: item_qty , price : item_price *item_qty, image:item_img});
       }
       await cart.save();
       res.send('Product added to cart');
    } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
    }
})


app.get("/:id" , async(req,res)=>{
    const {id} = req.params;
    const product = await Item.findById(id);
    //console.log(id);
    res.render("show" , {product});
})

// app.get("/trends",(req, res)=>{
//     res.render("trends");
// })


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
        expires: new Date(Date.now()+300000),
        httpOnly:true
      });
    //  console.log(cookie);
        const registered = await registerEmployee.save();
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

        if (user && isMatch) {
            // Successful login
            const token = await user.generateAuthToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true
            });
            res.redirect("/");
        } else {
            res.redirect("/login?error=Invalid%20email%20or%20password");
        }
    } catch (error) {
        res.redirect("/login?error=Invalid");
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

app.listen(port, ()=>{
    console.log(`Server is Running at http://localhost:${port}`);
})

