const express = require("express");
const cors = require("cors");
const app = express();
const corsOptions = {
    origin: ['http://localhost:3000'], // Add your frontend URL here
    optionsSuccessStatus: 200
};  
app.use(cors(corsOptions));
const mongoose = require("mongoose");
app.use(express.json());

const bcrypt=require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));

const jwt=require("jsonwebtoken");
var nodemailer = require('nodemailer');

const JWT_SECRET = "jiijhsdij832973948";

const mongoUrl = "mongodb+srv://admin:123@cluster0.mfbuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl,{
    useNewUrlParser:true,
}).then(()=>{
    console.log("Connected to database");
}).catch((e)=>console.log(e));

app.listen(5000,()=>{
    console.log("Server Started");
});

app.post("/post", async(req, res)=>{
    console.log(req.body);
    const {data} = req.body;

    try {
        if(data=="dre"){
            res.send({status:"ok"});
        }
        else{
            res.send({status:"User Not Found"});
        }
    } catch (error) {
        res.send({status:"error"});
    }
});

require("./userDetails");

const User = mongoose.model("UserInfo");

app.post("/register", async(req, res)=>{
    const {fname, lname, email, password} = req.body;
    try{
        if(password){
            const encryptedPassword = await bcrypt.hash(password, 10);

            const oldUser = await User.findOne({email});

            if(oldUser){
                return res.json({error: "User Exists"});
            }
            await User.create({
                fname,
                lname,
                email,
                password: encryptedPassword,
            });
            res.send({status:"Ok"});
        }
    } catch (error) {
        res.send({status:"error"});
    }
})

app.post("/login-user", async(req, res)=>{
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if(!user){
        return res.json({ error: "User Not Found"});
    }
    if(await bcrypt.compare(password, user.password)){
        console.log("Porra");
        const token = jwt.sign({email:user.email }, JWT_SECRET, {
            expiresIn: 10,
        });
    
        if(res.status(201)){
            return res.json({ status: "ok", data: token });
        }else{
            return res.json({ error: "error" });
        }
    }
    res.json({ status:"error", error: "Invalid Password" });
});

app.post("/userData", async(req, res)=>{
    const { token } = req.body;
    try {
        const user=jwt.verify(token, JWT_SECRET, (err, res) => {
            if(err){
                return "token expired";
            }
            return res;
        });
        console.log(user);
        if(user=="token expired"){
            return res.send({ status: "error", data: "token expired" });
        }
        
        const useremail = user.email;
        User.findOne({email: useremail})
        .then((data)=>{
            res.send({ status: "ok", data: data });
        })
        .catch((error) => {
            res.send({ status: "error", data: error });
        });
    } catch (error) {
        
    }
})

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.json({status: "User does not exist!"});
        }
        const secret = JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "5m",
        });
        const link = `http://localhost:5000/reset-password/${oldUser.id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: "tcc.andre.computing@gmail.com",
                pass: "11037S!ver"
            },
        });

        var mailOptions = {
            from: "tcc.andre.computing@gmail.com",
            to: oldUser.email,
            subject: "Passwored Reset",
            text: link,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: ", info.response);
            }
        });
        console.log(link);
    } catch (error) {}
});

app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if ("oldUser") {
        return res.json({ status: "User does not exists!!"});
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        res.render("index", {email: verify.email, status: "Not Verified"});
    } catch (error) {
        res.send("Not Verified");
    }
    res.send("Done");
})

app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;


    const oldUser = await User.findOne({ _id: id });
    if ("oldUser") {
        return res.json({ status: "User does not exists!!"});
    }
    const secret = JWT_SECET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.updateOne(
            {
            _id:id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );
        res.json({status: "Password Updated"});

        res.render("index", {email: verify.email, status: "verified"});
    } catch (error) {
        res.send("Not Verified");
    }
    res.send("Done");
})