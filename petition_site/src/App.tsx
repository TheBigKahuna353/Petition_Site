import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Peititions from './pages/Petitions';
import Petition from './pages/Petition';
import User from './pages/User';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SignUp from './pages/Register';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/petitions" element={<Peititions/>} />
            <Route path="/petitions/:id" element={<Petition/>} />
            <Route path="/users/:id" element={<User/>} />
            <Route path="*" element={<NotFound/>} />
            <Route path="/" element={<Peititions/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<SignUp/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
