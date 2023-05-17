import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/login&register.css';
import { useAuthProvider } from "../services/auth";


export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const auth = useAuthProvider();


    const handleRegisterClick = () => {
        navigate("/register");
    };

    const handleSubmint = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/users/" + email, {
              "psw": password
            });
            
            //TODO el codigo de status correcto seria 202 que es acepted
            if (response.status === 200) {
              auth.addCredenials(response.data.token, response.data.userName, response.data.userMail);
              navigate("/homepage");
            }
          } catch (error) {
            alert(error);
        }
    };

    return (
      <div className="LogInPageWrapper">
        <h1 className="LogInTitle">
          <span className="Spot">Spot</span>
          <span className="Finder">Finder</span>
        </h1>
        <form className="LogForm" onSubmit={handleSubmint}>
          <input className="LogInput" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="LogInput" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="LogSubmit" type="submit">Log In</button>
        </form>
        <p className="Link" onClick={handleRegisterClick}>Don't have an account? Register here.</p>
        </div>
  );
};


