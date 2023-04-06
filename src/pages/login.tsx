// import Button from "../components/LogInButtom";


// export const LoginPage = () => {
//     return (
//         <div>
//             <h1 color='green'>SpotFinder </h1>
//             <form name='f1'>
//                 <input type="email" required></input>
//                 <br></br>
//                 <input type="password" required></input>
//                 <br></br>
//                 <input type="submit" value="Log in"></input>
//                 <br></br>
//                 <br></br>
//                 <Button
//                     border="none"
//                     color="green"
//                     height = "50px"
//                     onClick={() => alert("You clicked on the pink circle!")}
//                     radius = "35%"
//                     width = "100px"
//                     children = "Log In"
//                 ></Button>
//             </form>
//         </div>
//     )
// }

import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './styles/login&register.css';
// import {
//   PageWrapper,
//   Title,
//   Spot,
//   Finder,
//   Form,
//   Input,
//   SubmitButton,
//   Link
// } from "./styles";


function setToken(userToken: any) {
  sessionStorage.setItem('token', userToken);
}

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


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
              setToken(response.data.token);
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


