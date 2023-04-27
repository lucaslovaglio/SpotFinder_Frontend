import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/login&register.css';
import { useAuthProvider } from "../services/auth";


export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem; 
`;

const Title = styled.h1`
  color: rgb(0, 255, 149);
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const PasswordError = styled.span`
  color: red;
  margin-bottom: 1rem;
`;


export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const auth = useAuthProvider();



  const handleLogInClick = () => {
    navigate("/");
  };

  const handleSubmint = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== repeatPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
        const response = await axios.post("http://localhost:3001/users/", {
          "mail": email,
          "username": name, 
          "psw": password
        });
  
        // TODO el codigo correcto seria 201 que es created
        if (response.status === 200) {
          //TODO deberia logearse automaticamente
          auth.addCredenials(response.data.token, response.data.userName, response.data.userMail);
          navigate("/homepage");
        }
      } catch (error) {
        alert(error);
    }
  };

  const handleRepeatPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(event.target.value);
    setPasswordError("");
  };

  return (
    <div className="RegisterPageWrapper">
      <h1 className="RegisterTitle">
        <span className="Spot">Spot</span>
        <span className="Finder">Finder</span>
      </h1>
      <form className="LogForm" onSubmit={handleSubmint}>
        <input className="LogInput" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="LogInput" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="LogInput" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input className="LogInput"
          type="password"
          placeholder="Repeat password"
          value={repeatPassword}
          onChange={handleRepeatPasswordChange}
          required
        />
        {passwordError && <span className="PasswordError">{passwordError}</span>}
        <button className="LogSubmit" type="submit">Sign Up</button>
      </form>
      <p className="Link" onClick={handleLogInClick}>You're already singed up? Log in here.</p>
    </div>
  );
};