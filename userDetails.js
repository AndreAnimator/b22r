const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
    {
        fname: String,
        lname: String,
        email: {type:String, unique:true},
        password: String,
        userType: String,
        eventos: []
    },
    {
        collections: "UserInfo",
    }
);

mongoose.model("UserInfo", UserDetailsSchema);