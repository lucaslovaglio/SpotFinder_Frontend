import { Routes, Route, Link } from "react-router-dom";
import './App.css';

import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { HomePage } from './pages/home';
import { OwnerPage } from './pages/owner';
import { ManagerPage } from "./pages/manager";
import { ParkingDetails } from "./pages/parkingDetails";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/ownerpage" element={<OwnerPage />} />
        <Route path="/managerpage" element={<ManagerPage />} />
        <Route  path="/ownerpage/parking/:id" element={<ParkingDetails />} />
        <Route  path="/managerpage/parking/:id" element={<ParkingDetails />} />
        <Route  path="/homepage/parking/:id" element={<ParkingDetails />} />

      </Routes>
    </div>

  );
}

export default App;
