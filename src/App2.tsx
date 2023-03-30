import {Component} from 'react';
import { Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Button from "./components/LogInButtom";

import EventBus from "./prueba/common/EventBus";
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { HomePage } from './pages/homepage';

function App() {
  return (
    <div className="container mt-3">
      <Routes>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </div>

  );
}

export default App;
