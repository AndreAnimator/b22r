import React, { useEffect, useState } from "react";
import { faPlusSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function AdminHome({userData}) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [eventdata, setEventData] = useState([]);

    useEffect(() => {
        getAllUser();
        getAllEvents();
    }, []);

    const getAllUser = () => {
        fetch("http://localhost:5000/getAllUser", {
            method: "GET",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "UserData");
            setData(data.data);
        });
    }
    const getAllEvents = () => {
        fetch("http://localhost:5000/getAllEvent", {
            method: "GET",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "EventData");
            setEventData(data.data);
        });
    }
    
    const logOut = () =>{
        window.localStorage.clear();
        window.location.href = "./sign-in";
    };
    
    const deleteUser=(id, name)=>{
        if(window.confirm(`Are you sure you want to delete ${name}`)){
            fetch("http://localhost:5000/deleteUser", {
                method: "POST",

                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    userid: id,
                }),
            })
            .then((res) => res.json())
            .then((data) => {
                alert(data.data);
                getAllUser();
            });
        } else{

        }
        alert("Delete");
    }

    const deleteEvent=(id, nome)=>{
        if(window.confirm(`Are you sure you want to delete ${nome}`)){
            fetch("http://localhost:5000/deleteEvent", {
                method: "POST",

                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    eventid: id,
                }),
            })
            .then((res) => res.json())
            .then((data) => {
                alert(data.data);
                getAllEvents();
            });
        } else{

        }
        alert("Delete");
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner" style={{width: "auto"}}>
                <h3>Bem-vindo, Administrador</h3>
                <table style={{width:500}}>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo de Usuário</th>
                        <th>Deletar</th>
                    </tr>
                    {data.map(i=>{
                        return(
                            <tr>
                                <td>{i.fname}</td>
                                <td>{i.email}</td>
                                <td>{i.userType}</td>
                                <td>
                                    <FontAwesomeIcon icon={faTrash} onClick={()=>deleteUser(i._id, i.fname)}/>
                                </td>
                            </tr>
                        )
                    })}
                </table>
                <table style={{width:500}}>
                    <tr>
                        <th>Nome</th>
                        <th>Data</th>
                        <th>Cidade</th>
                        <th>Deletar</th>
                    </tr>
                    {eventdata.map(i=>{
                        return(
                            <tr>
                                <td>{i.nome}</td>
                                <td>{i.dataLargada}</td>
                                <td>{i.cidade}</td>
                                <FontAwesomeIcon icon={faPlusSquare} onClick={()=>navigate("/updateEvent", {state:i})}></FontAwesomeIcon>
                                <td>
                                    <FontAwesomeIcon icon={faTrash} onClick={()=>deleteEvent(i._id, i.nome)}/>
                                </td>
                            </tr>
                        )
                    })}
                </table>

                <div>
                    <FontAwesomeIcon icon={faPlusSquare} onClick={()=>navigate("/registerEvent")}></FontAwesomeIcon>
                </div>

                <button onClick={logOut} className="btn btn-primary">
                    Deslogar
                </button>
            </div>
        </div>
    );
}