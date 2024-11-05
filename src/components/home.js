import React, { Component, useEffect, useState } from "react";
import { faPlusSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [eventdata, setEventData] = useState([]);

    useEffect(() => {
        getAllEvents();
    }, []);

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
    
    return (
        <div className="auth-wrapper">
            <div className="auth-inner" style={{width: "auto"}}>
                <h3>Página Inicial</h3>
                <table style={{width:500}}>
                    <tr>
                        <th>Nome</th>
                        <th>Data</th>
                        <th>Cidade</th>
                        <th>Detalhes</th>
                    </tr>
                    {eventdata.map(i=>{
                        return(
                            <tr>
                                <td>{i.nome}</td>
                                <td>{i.dataLargada}</td>
                                <td>{i.cidade}</td>
                                <FontAwesomeIcon icon={faPlusSquare} onClick={()=>navigate("/eventDetails", {state:i})}></FontAwesomeIcon>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </div>
    );
}