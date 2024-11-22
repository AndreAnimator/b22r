import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import axios from 'axios';

export default function UpdateUser() {
    const location = useLocation();
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [id, setId] = useState("");
    const [imagePath, setImagePath] = useState(null);


    useEffect(() => {
        console.log(location);
        setFname(location.state.fname);
        setLname(location.state.lname);
        setEmail(location.state.email);
        setId(location.state._id);
        setImage(location.state.image);
        console.log('esqueci');
        console.log(image);
        console.log(location.state.image);
        console.log('esqueci');
        setImagePath(require("../images/"+location.state.image));
    }, [location, image]);

    const UpdateData=()=>{
        console.log(fname, lname);
        fetch("http://localhost:5000/updateUser", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Acces-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                id:location.state._id,
                fname:fname,
                lname: lname
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            window.location.href="/userHome"
        });

    }
    const submitImage= async (e)=>{
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("image", image);
        formData.append("id", id);
        console.log("Imagem: ");
        console.log(image);
        const result = await axios.post(
          "http://localhost:5000/upload-image",
          formData,
          {
            headers: { "Contet-Type": "multipart/form-data"},
          }
        )
        console.log(result);
    }
    const onInputChange=(e)=>{
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
    }

    return (
        <div cllassName="auth-wrapper">
            <div className="auth-inner">

                Primeiro Nome <br/>
                <input placeholder="First Name" className="form-control" defaultValue={fname} onChange={(e) => setFname(e.target.value)}/><br/>
                Sobrenome <br />
                <input placeholder="Last Name" className="form-control" defaultValue={lname} onChange={(e) => setLname(e.target.value)}/><br />
                Email<br />
                <input placeholder="email" className="form-control" defaultValue={email} disabled/><br />
                {imagePath == null
                ? <div>Sem Imagem</div>
                : <img alt="user profile" src={imagePath} height={100} width={100}>{console.log("../images/"+image)}</img>}
                <div>
                    <form onSubmit={submitImage}>
                        <input type="file" accept="image" onChange={onInputChange}></input>
                        <button type="submit">Enviar</button>
                    </form>
                </div>

                <button onClick={UpdateData}>Atualizar Detalhes</button>
            </div>
        </div>
    )
}