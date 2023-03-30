import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem; 
`;

export const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 3rem;
`;

export const Spot = styled.span`
  color: rgb(230, 230, 230)
`;

export const Finder = styled.span`
  color: rgb(0, 255, 149)
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Input = styled.input`
  padding: 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
`;

export const SubmitButton = styled.button`
  background-color: #00adb5;
  margin-top: 0.5rem;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #393e46;
  }
`;

export const Link = styled.p`
  margin-top: 1rem;
  cursor: pointer;
  color: #00adb5;

  &:hover {
    text-decoration: underline;
  }
`;
