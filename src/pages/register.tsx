import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/login&register.css';
import { useAuthProvider } from "../services/auth";
import { Status, alertProps } from "../types/alertTypes";
import Alert from "../components/Alert";
import useUrlProvider from "../services/url";


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
  const url = useUrlProvider();



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
        const response = await axios.post(url + "users/", {
          "mail": email,
          "username": name, 
          "psw": password
        });
  
        // TODO el codigo correcto seria 201 que es created
        if (response.status === 200) {
          auth.addCredenials(response.data.token, response.data.userName, response.data.userMail);
          navigate("/homepage");
        }
      } catch (error) {
          const errorMessage = error ? (error as any).message : '';
          handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
    }
  };

  const handleRepeatPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(event.target.value);
    setPasswordError("");
  };


  // // ALERT
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState<alertProps>(
      {
          action: () => {},
          type: Status.UNDEFINED,
          message: "",
          confirmation: false, 
      }
  );
  const handleOpenAlert = (action: () => void, type: Status, message: string, confirmation: boolean) => {
      setOpenAlert(true);
      setAlert(
          {
              action: action,
              type: type,
              message: message,
              confirmation: confirmation
          }
      );
  }
  const handleCloseAlert = () => setOpenAlert(false);

  return (
    <>
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
    <Alert
            open={openAlert}
            message={alert.message}
            handleClose={handleCloseAlert}
            confirmation={alert.confirmation}
            type={alert.type}
            action={alert.action} />
    </>
  );
};