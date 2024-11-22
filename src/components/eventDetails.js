import React, { useEffect, useState } from "react";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EventDetails() {
    const location = useLocation();

    const [userData, setUserData] = useState({});
    const [admin, setAdmin] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const [nome, setNome] = useState("");
    const [modalidade, setModalidade] = useState("");
    const [cidade, setCidade] = useState("");
    const [dataLargada, setDataLargada] = useState("");
    const [horario, setHorario] = useState("");
    const [organizacao, setOrganizacao] = useState("");
    const [informacoes, setInformacoes] = useState("");
    const [patrocinio, setPatrocinio] = useState([]);
    const [inscricoes, setInscricoes] = useState([]);
    const [programacao, setProgramacao] = useState("");
    const [regulamento, setRegulamento] = useState("");
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        setNome(location.state.nome);
        setModalidade(location.state.modalidade);
        setCidade(location.state.cidade);
        setDataLargada(location.state.dataLargada);
        setHorario(location.state.horario);
        setOrganizacao(location.state.organizacao);
        setInformacoes(location.state.informacoes);
        setPatrocinio(location.state.patrocinio || []);
        setInscricoes(location.state.inscricoes);
        setProgramacao(location.state.programacao);
        setRegulamento(location.state.regulamento);
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
            if(data.data.userType==="Admin"){
                setAdmin(true);
            }
            
            setUserData(data.data || {});
            setEventos(userData.eventos);
            console.log("eventos do usuario");
            console.log(eventos);
            console.log("inscricoes do evento");
            console.log(inscricoes);

            if (data.data && Array.isArray(data.data.eventos)) {
                setEventos(data.data.eventos);
                console.log("que eventos ele ja tem?");
                console.log(eventos);
                eventos.map(item => {
                    if(item.name === nome){
                        setIsSubscribed(true);
                    }
                    return item;
                });
            }

            if(data.data === "token expired"){
                alert("Token expired, please login again");
                window.localStorage.clear();
                window.location.href = "./sign-in";
            }
            }).catch((error) => {
            console.error("Error fetching user data:", error);
            this.setState({ error: "Failed to load user data" });
            });
    }, [
        location.state.nome,
        location.state.modalidade,
        location.state.cidade,
        location.state.dataLargada,
        location.state.horario,
        location.state.organizacao,
        location.state.informacoes,
        location.state.patrocinio,
        location.state.inscricoes,
        location.state.programacao,
        location.state.regulamento,
        nome,
        modalidade,
        cidade,
        dataLargada,
        horario,
        organizacao,
        informacoes,
        patrocinio,
        inscricoes,
        programacao,
        regulamento,
        admin,
        userData,
        eventos
    ]);

    const AddParticipant = () => {
        if (!userData._id) {
            console.error("Dados do usuário não carregados");
            return;
        }

        setInscricoes([...inscricoes, { id: Date.now(), email: userData.email }]);
        setEventos([...eventos, { name: nome }]);

        console.log("eeventos");
        console.log(eventos);
        console.log("inscricoes");
        console.log(inscricoes);

        if(eventos && !isSubscribed && inscricoes){
            fetch("http://localhost:5000/subscribeEvent",{
                method: "POST",
                headers:{
                "Content-Type":"application/json",
                Accept:"application/json",
                },
                body:JSON.stringify({
                    id: userData._id,
                    eventos: eventos,
                    idEvent:location.state._id,
                    inscricoes: inscricoes,
                }),
            }).then((res)=> {
                return res.json();
            })
            .then((data)=>{
                console.log(data,"eventEditado");
                alert("Evento inscrito");
                //window.location.href = "./userDetails";
            })
            .catch((error) => {
                console.error("There has been a problem with your fetch operation:", error);
            });
        }
    };


    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
            <h3>Evento {nome}</h3>

            <div className="mb-3">
            <h>Modalidade: {modalidade}</h>
            </div>

            <div className="mb-3">
            <h>Cidade: {cidade}</h>
            </div>

            <div className="mb-3">
            <h>Data de largada: {dataLargada}</h>
            </div>

            <div className="mb-3">
            <h>Horário: {horario}</h>
            </div>

            <div className="mb-3">
            <h>Organização: {organizacao}</h>
            </div>

            <div className="mb-3">
            <h>Informações {informacoes}</h>
            </div>

            <h4>Patrocínios</h4>
            {patrocinio.map(item => {
                return(
                    <tr>
                        <td>id: {item.id}</td>
                        <td>nome: {item.name}</td>
                    </tr>
                )
            })}

            <div className="mb-3">
            <h>Programação: {programacao}</h>
            </div>

            <div className="mb-3">
            <h>Regulamento: {regulamento}</h>
            </div>
                {admin || isSubscribed?<></>:<FontAwesomeIcon icon={faPlusSquare} onClick={AddParticipant}>Inscreva-se</FontAwesomeIcon>}
            </div>
        </div>
    );
}