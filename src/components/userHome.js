import React, { useState, useEffect } from "react";
import { faPlusSquare, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

export default function UserHome() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [eventData, setEventData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "./sign-in";
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/userData", {
                    method: "POST",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        token: window.localStorage.getItem("token"),
                    }),
                });
                const data = await response.json();
                console.log(data);
                setUserData(data.data);
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
            }
        };

        const fetchSubscribedEvents = async () => {
            console.log("ALOUUU ta pegando alguma coisa?? ooii")
            try {
                console.log("User data: ");
                console.log(userData);
                console.log("User Data Eventos");
                console.log(userData.eventos);
                if (!userData || !userData.eventos) return;

                console.log("Eventos do usuário:");
                console.log(userData.eventos);

                const response = await fetch("http://localhost:5000/getSubscribedEvents", {
                    method: "POST",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        eventos: userData.eventos,
                    })
                });
                const data = await response.json();
                console.log(data, "EventData");
                setEventData(data.data);
            } catch (error) {
                console.error("Erro ao carregar eventos inscritos:", error);
            }
        };

        const fetchData = async () => {
            await fetchUserData();
            await fetchSubscribedEvents();
            setIsLoading(false);
        };

        fetchData();
    }, [location.state, userData]);

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (!userData) {
        return <div>Não foi possível carregar os dados do usuário.</div>;
    }

    return (
        <div className="position-relative">
            <div className="flex-fill">
                <FontAwesomeIcon icon={faUserPlus} onClick={() => navigate("/updateUser", { state: userData })} />
                <div>
                    Nome<h1>{userData.fname}</h1>
                    Email <h1>{userData.email}</h1>
                    <br />
                    <table style={{ width: 500 }}>
                        <tr>
                            <th>Nome</th>
                            <th>Data</th>
                            <th>Cidade</th>
                            <th>Deletar</th>
                        </tr>
                        {eventData.map(i => (
                            <tr key={i._id}>
                                <td>{i.nome}</td>
                                <td>{i.dataLargada}</td>
                                <td>{i.cidade}</td>
                                <FontAwesomeIcon icon={faPlusSquare} onClick={() => navigate("/eventDetails", { state: i })}></FontAwesomeIcon>
                            </tr>
                        ))}
                    </table>
                    <button onClick={logOut} className="btn btn-primary">
                        Deslogar
                    </button>
                </div>
            </div>
        </div>
    );
}
