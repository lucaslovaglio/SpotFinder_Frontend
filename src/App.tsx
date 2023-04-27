import { Routes, Route, Link } from "react-router-dom";
import './App.css';

import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { HomePage } from './pages/home';
import { OwnerPage } from './pages/owner';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/ownerpage" element={<OwnerPage />} />
      </Routes>
    </div>

  );
}

export default App;
