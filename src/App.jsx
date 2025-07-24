import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeparturesBoard from './components/DeparturesBoard';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/departures" element={<DeparturesBoard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<DeparturesBoard />} />
      </Routes>
    </Router>
  );
}

export default App;