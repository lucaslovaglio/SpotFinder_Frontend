import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Spot,
  Finder,
  Form,
  Input,
  SubmitButton,
  Link
} from "./styles";

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
        const response = await axios.post("http://localhost:3001/users", {
          "mail": email,
          "userName": name, 
          "psw": password
        });
  
        if (response.status === 200) {
          //TODO deberia logearse automaticamente
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
    <PageWrapper>
      <Title>
        <Spot>Spot</Spot>
        <Finder>Finder</Finder>
      </Title>
      <Form name="f1" onSubmit={handleSubmint}>
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input
          type="password"
          placeholder="Repeat password"
          value={repeatPassword}
          onChange={handleRepeatPasswordChange}
          required
        />
        {passwordError && <PasswordError>{passwordError}</PasswordError>}
        <SubmitButton type="submit">Sing Up</SubmitButton>
      </Form>
      <Link onClick={handleLogInClick}>You're already singed up? Log in here.</Link>
    </PageWrapper>
  );
};