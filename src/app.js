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
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const auth = require("./middleware/auth");



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



//console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    const isLoggedIn = req.cookies.jwt ? true : false;
    res.render("index", { isLoggedIn });
});

app.get("/login", (req, res) => {
    const isLoggedIn = req.cookies.jwt ? true : false;
    res.render("login", { isLoggedIn });
});

app.get("/secret", auth ,(req, res)=>{
    //   console.log(`This the cookie ${req.cookies.jwt}`);
       res.render("secret");
   })


   app.get("/payment" , (req,res)=>{
    res.render("payment");
})

app.get("/logout", auth, async (req, res) => {
    try {
        // Remove the current token from the user's tokens array
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token;
        });

        // Clear the JWT cookie
        res.clearCookie("jwt");

        // Save the user and redirect to the home page
        await req.user.save();
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error);
    }
});


app.get("/register",(req, res)=>{
    res.render("register");
})


app.get("/feedback" ,auth , (req,res)=>{
    res.render("feedback");
})

app.get("/FAQ" ,auth , (req,res)=>{
    res.render("FAQ");
})

app.get("/fruits" , (req,res)=>{
    res.render("fruits");
})


app.get("/services",(req, res)=>{
    res.render("services");
})

app.get('*', (req, res) => {
    res.redirect('/');
  });

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

            // Redirect to the home page after successful login
            res.redirect("/");
        } else {
            // Redirect to the login page with an error message
            res.redirect("/login?error=Invalid%20email%20or%20password");
        }
    } catch (error) {
        // Redirect to the login page with an error message
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


/*
const bcrypt=require('bcrypt')
const securePassword = async(password)=>{

    const passwordHash=await bcrypt.hash(password,10);
    console.log(passwordHash);

    const passwordmatch=await bcrypt.compare(password,passwordHash);
    console.log(passwordmatch);

}
securePassword("animesh");
*/
 

/*
const jwt = require("jsonwebtoken");

const createToken= async()=>{
   const token = await jwt.sign({_id:"64ccf8805549982c42b7c354"},"seasdasjdnasjndajsndjhuuuuusada",{expiresIn:"2 seconds"});

    console.log(token);

    const userVer= await jwt.verify(token,"seasdasjdnasjndajsndjhuuuuusada");
    console.log(userVer);
}
createToken();
*/


app.listen(port, ()=>{
    console.log(`Server is Running at http://localhost:${port}`);
})

