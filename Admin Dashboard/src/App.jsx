// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/loginpage';
import Complaints from './components/complaints'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Complaints" element={<Complaints />} />
      </Routes>
    </Router>
  );
}

export default App;
