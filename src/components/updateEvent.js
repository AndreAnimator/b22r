import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import PatrocinioItem from './patrocinioItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

export default function UpdateEvent() {
    const location = useLocation();
  /* nome: {type:String, unique:true},
  modalidade: String,
  cidade: String,
  dataLargada: String,
  horario: String,
  organizacao: String,
  informacoes: String,
  patrocinio: [String],
  inscricoes: [String],
  programacao: String,
  regulamento: String,*/
  const [nome, setNome] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [cidade, setCidade] = useState("");
  const [dataLargada, setDataLargada] = useState("");
  const [horario, setHorario] = useState("");
  const [organizacao, setOrganizacao] = useState("");
  const [informacoes, setInformacoes] = useState("");
  const [patrocinio, setPatrocinio] = useState([]);
  const [inscricoes, setInscricoes] = useState([""]);
  const [programacao, setProgramacao] = useState("");
  const [regulamento, setRegulamento] = useState("");

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
      location.state.regulamento
    ]);

    const addPatrocinio = () => {
        setPatrocinio([...patrocinio, { id: Date.now(), name: '' }]);
    };

    const removePatrocinio = (id) => {
    setPatrocinio(patrocinio.filter(item => item.id !== id));
    };

    const updatePatrocinio = (id, name) => {
    setPatrocinio(patrocinio.map(item => item.id === id ? { ...item, name } : item));
    };

  const UpdateData=() => {

      // console.log(fname, lname, email, password);
      fetch("http://localhost:5000/updateEvent",{
        method: "POST",
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
        },
        body:JSON.stringify({
            id:location.state._id,
          nome:nome,
          modalidade:modalidade,
          cidade:cidade,
          dataLargada:dataLargada,
          horario:horario,
          organizacao:organizacao,
          informacoes:informacoes,
          patrocinio:patrocinio,
          inscricoes:inscricoes,
          programacao:programacao,
          regulamento:regulamento
        }),
      }).then((res)=> {
        return res.json();
      })
      .then((data)=>{
        console.log(data,"eventEditado");
        window.location.href = "./adminHome";
      })
      .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
      });
  };

  return (
    <div cllassName="auth-wrapper">
      <h3>Cadastrar Evento</h3>

      <div className="mb-3">
        <label>Nome da competição</label>
        <input
          type="text"
          className="form-control"
          defaultValue={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Modalidade</label>
        <input type="text" className="form-control" defaultValue={modalidade}
          onChange={(e) => setModalidade(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Cidade</label>
        <input
          type="text"
          className="form-control"
          defaultValue={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Data de largada</label>
        <input
          type="text"
          className="form-control"
          defaultValue={dataLargada}
          onChange={(e) => setDataLargada(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Horário</label>
        <input
          type="text"
          className="form-control"
          defaultValue={horario}
          onChange={(e) => setHorario(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Organização</label>
        <input
          type="text"
          className="form-control"
          defaultValue={organizacao}
          onChange={(e) => setOrganizacao(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Informações</label>
        <input
          type="text"
          className="form-control"
          defaultValue={informacoes}
          onChange={(e) => setInformacoes(e.target.value)}
        />
      </div>

      <h4>Patrocínios</h4>
      {patrocinio.map((item) => (
        <PatrocinioItem 
          key={item.id} 
          patrocinio={item}
          onRemove={() => removePatrocinio(item.id)}
          onUpdate={() => updatePatrocinio(item.id, item.name)}
        />
      ))}
      <FontAwesomeIcon icon={faPlusSquare} onClick={addPatrocinio}>Adicionar Patrocínio</FontAwesomeIcon>

      <div className="mb-3">
        <label>Programação</label>
        <input
          type="text"
          className="form-control"
          defaultValue={programacao}
          onChange={(e) => setProgramacao(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Regulamento</label>
        <input
          type="text"
          className="form-control"
          defaultValue={regulamento}
          onChange={(e) => setRegulamento(e.target.value)}
        />
      </div>

      <div className="d-grid">
        <button className="btn btn-primary" onClick={UpdateData}>
          Atualizar
        </button>
      </div>
    </div>
  )
}