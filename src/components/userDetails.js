import React, { Component, useEffect, useState } from "react";
import UserHome from "./userHome";
import AdminHome from "./adminHome";

export default function UserDetails() {
 const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);
  
  useEffect(() => {
    console.log("hi");
      fetch("http://localhost:5000/userData",{
          method: "POST",
          crossDomain: true,
          headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Acces-Control-Allow-Origin":"*"
          },
          body:JSON.stringify({
            token:window.localStorage.getItem("token"),
          }),
        }).then((res)=>res.json())
        .then((data)=>{
          console.log("dados do usuario");
          console.log(data,"userData");
          if(data.data.userType=="Admin"){
            setAdmin(true);
          }
          
          setUserData(data.data);
          if(data.data === "token expired"){
            alert("Token expired, please login again");
            window.localStorage.clear();
            window.location.href = "./sign-in";
          }
        }).catch((error) => {
          console.error("Error fetching user data:", error);
          this.setState({ error: "Failed to load user data" });
        });
    console.log("dados")
  }, []);

  return (
      admin?<AdminHome/>:<UserHome userData={userData}/>
  );
}