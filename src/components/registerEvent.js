import React, { useState } from 'react'

let nextId = 0;

export default function RegisterEvent() {
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
  const [inscricoes, setInscricoes] = useState([]);
  const [name, setName] = useState("");
  const [programacao, setProgramacao] = useState("");
  const [regulamento, setRegulamento] = useState("");

  const handleSubmit = (e) => {
      e.preventDefault();
      setInscricoes([]);
      console.log(nome,
        modalidade,
        cidade,
        dataLargada,
        horario,
        organizacao,
        informacoes,
        patrocinio,
        inscricoes,
        programacao,
        regulamento);
      fetch("http://localhost:5000/register-event",{
        method: "POST",
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
        },
        body:JSON.stringify({
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
          regulamento
        }),
      }).then((res)=> {
        if (!res.ok){
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data)=>{
        console.log(data,"eventRegister");
        window.location.href = "./adminHome";
      })
      .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cadastrar Evento</h3>

      <div className="mb-3">
        <label>Nome da competição</label>
        <input
          type="text"
          className="form-control"
          placeholder="nome"
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Modalidade</label>
        <input type="text" className="form-control" placeholder="Modalidade" 
          onChange={(e) => setModalidade(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Cidade</label>
        <input
          type="text"
          className="form-control"
          placeholder="Cidade"
          onChange={(e) => setCidade(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Data de largada</label>
        <input
          type="text"
          className="form-control"
          placeholder="DD/MM/AAAA"
          onChange={(e) => setDataLargada(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Horário</label>
        <input
          type="text"
          className="form-control"
          placeholder="HH:MM"
          onChange={(e) => setHorario(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Organização</label>
        <input
          type="text"
          className="form-control"
          placeholder="Organização"
          onChange={(e) => setOrganizacao(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Informações</label>
        <input
          type="text"
          className="form-control"
          placeholder="Informação"
          onChange={(e) => setInformacoes(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Patrocínio</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={() => {
          setPatrocinio([
            ...patrocinio,
            { id: nextId++, name: name }
          ]);
        }}>Add</button>
        <ul>
          {patrocinio.map(patro => (
            <li key={patro.id}>{patro.name}</li>
          ))}
        </ul>
      </div>

      <div className="mb-3">
        <label>Programação</label>
        <input
          type="text"
          className="form-control"
          placeholder="Programação"
          onChange={(e) => setProgramacao(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Regulamento</label>
        <input
          type="text"
          className="form-control"
          placeholder="Regulamento"
          onChange={(e) => setRegulamento(e.target.value)}
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </div>
    </form>
  )
}