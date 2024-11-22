import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import * as masks from './masks'
import {
  isValidCNPJ,
  isValidCPF
} from "@brazilian-utils/brazilian-utils";

export default function SignUp() {
  const [secretKey] = useState("");

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('Primeiro nome é obrigatório'),
    lastName: Yup.string()
      .required('Sobrenome é obrigatório'),
    dob: Yup.string()
      .required('Data de nascimento é obrigatório')
      .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Data de nascimento deve estar em um formato válido de data YYYY-MM-DD'),
    email: Yup.string()
        .required('Email é obrigatório')
        .email('Email é inválido'),
    password: Yup.string()
        .min(6, 'A senha deve conter pelo menos 6 caracteres')
        .required('Senha é obrigatório'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'A senha deve ser a mesma')
        .required('Confirmar senha é obrigatório'),
    userType: Yup.string()
        .required('Deve selecionar uma opção'),
        secretKey: Yup.string(),
        cpf_cnpj: Yup
    .string()
    .required('CPF/CNPJ é obrigatório')
    .transform(masks.cpfOrCnpjMask.transform)
    .test("validateCpfOrCnpj", "CPF ou CNPJ inválido", (value) => {
      if (!value) {
        return false;
      }
      const unmaskedValue = masks.cpfOrCnpjMask.unmask(value);
      console.log("unmasked value: ", unmaskedValue);

      if (unmaskedValue.length === 11) {
        return isValidCPF(value);
      }

      if (unmaskedValue.length === 14) {
        return isValidCNPJ(value);
      }

      return false;
    }),
  });

  /*function validateAdminSecretKey(schema, secretKey) {
    return schema.when('userType', {
      is: 'Admin',
      then: Yup.string().required('Chave secreta é obrigatória para Admins'),
      otherwise: Yup.string(),
    });
  }*/
  const formOptions = { resolver: yupResolver(validationSchema, secretKey),
    mode: 'onChange' };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState, watch } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    // display form data on success
    const { firstName, lastName, email, password } = data;
    
    // Validação para Admin
    if (data.userType === 'Admin' && data.secretKey !== 'MaratonaBBBB') {
      alert('Invalid Admin');
      return;
    }

    // Preparar os dados para envio
    const userData = {
      fname: firstName,
      lname: lastName,
      email,
      password,
      userType: data.userType || 'User',
      eventos: [] // Você pode adicionar eventos aqui se necessário
    };

    // Enviar os dados para a API
    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data, "userRegister");
      window.location.href = "./sign-in";
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
      // Aqui você pode adicionar uma mensagem de erro para o usuário
    });
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    return false;
  }

  /*
  const handleSubmit = (e) => {
    if(userType=="Admin" && secretKey!="MaratonaBBBB"){
      e.preventDefault();
      alert("Invalid Admin")
    }else{
      e.preventDefault();

      console.log(fname, lname, email, password);
      fetch("http://localhost:5000/register",{
        method: "POST",
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
        },
        body:JSON.stringify({
          fname,
          email,
          lname,
          password,
          userType,
          eventos
        }),
      }).then((res)=> {
        if (!res.ok){
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data)=>{
        console.log(data,"userRegister");
        window.location.href = "./sign-in";
      })
      .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
      });
    }
    
  };
  */

  return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
        <label>Tipo de Usuário</label>
        <select {...register('userType')} className={`form-control ${errors.userType ? 'is-invalid' : ''}`}>
          <option value="">Selecione o Tipo de Usuário</option>
          <option value="User">Usuário</option>
          <option value="Admin">Administrador</option>
        </select>
        <div className="invalid-feedback">{errors.userType?.message}</div>
      </div>

      {watch('userType') === 'Admin' && (
        <div className="form-group">
          <label>Chave Secreta</label>
          <input type="text" {...register('secretKey')} className={`form-control ${errors.secretKey ? 'is-invalid' : ''}`} />
          <div className="invalid-feedback">{errors.secretKey?.message}</div>
        </div>
      )}
      <div className="form-row">
        <div className="form-group col-5">
          <label>Primeiro Nome</label>
          <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
        </div>
        <div className="form-group col-5">
          <label>Sobrenome</label>
          <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
        <div className="invalid-feedback">{errors.lastName?.message}</div>
      </div>
      <div className="form-row">
          <div className="form-group col">
              <label>Data de Nascimento</label>
              <input name="dob" type="date" {...register('dob')} className={`form-control ${errors.dob ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.dob?.message}</div>
          </div>
          <div className="form-group col">
              <label>Email</label>
              <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
      </div>
      <div className="form-row">
          <div className="form-group col">
              <label>Senha</label>
              <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
          <div className="form-group col">
              <label>Confirmar Senha</label>
              <input name="confirmPassword" type="password" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
          </div>
      </div>
      <div className="form-row">
        <div className="form-group col">
          <label>CPF/CNPJ</label>
          <input
            {...register('cpf_cnpj')}
            placeholder="Digite o CPF/CNPJ"
            className={`form-control ${errors.cpf_cnpj ? 'is-invalid' : ''}`}
            name="cpf_cnpj"
            onChange={masks.cpfOrCnpjMask.onChange}
          />
          <div className="invalid-feedback">{errors.cpf_cnpj?.message}</div>
        </div>
      </div>
      <div className="form-group">
          <button type="submit" className="btn btn-primary mr-1">Registrar</button>
          <button type="button" onClick={() => reset()} className="btn btn-secondary">Reset</button>
      </div>
    </div>
    </form>
    {/* 
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <div>
        Register as
        <input
          type="radio"
          name="UserType"
          value="User"
          onChange={(e) => setUserType(e.target.value)}
        />
        User
        <input
          type="radio"
          name="UserType"
          value="Admin"
          onChange={(e) => setUserType(e.target.value)}
        />
        Admin
      </div>
      {userType=="Admin"?<div className="mb-3">
        <label>Secret Key</label>
        <input
          type="text"
          className="form-control"
          placeholder="Secret key"
          onChange={(e) => setSecretKey(e.target.value)}
        />
      </div>: null}

      <div className="mb-3">
        <label>First name</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setFname(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Last name</label>
        <input type="text" className="form-control" placeholder="Last name" 
          onChange={(e) => setLname(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered <a href="/sign-in">sign in?</a>
      </p>
    </form>
    */}
    </div>
  )
}
