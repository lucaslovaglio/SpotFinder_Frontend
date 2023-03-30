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
import {
  PageWrapper,
  Title,
  Spot,
  Finder,
  Form,
  Input,
  SubmitButton,
  Link
} from "./styles";


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
      
            if (response.status === 200) {
              navigate("/homepage");
            }
          } catch (error) {
            alert(error);
        }
    };

    return (
        <PageWrapper>
            <Title>
                <Spot>Spot</Spot>
                <Finder>Finder</Finder>
            </Title>
            <Form name="f1" onSubmit={handleSubmint}>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <SubmitButton type="submit">Log In</SubmitButton>
            </Form>
            <Link onClick={handleRegisterClick}>Don't have an account? Register here.</Link>
        </PageWrapper>
  );
};
