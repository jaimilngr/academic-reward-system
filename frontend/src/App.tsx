import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; 
import IndividualReward from './components/Individual';
import MarksReward from './components/Marksrewards';
import ParticipationReward from './components/Participation';
import ExclusiveAccess from './components/Exclusiveaccess';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reward/individual" element={<IndividualReward />} />
        <Route path="/reward/marks" element={<MarksReward />} />
        <Route path="/reward/participation" element={<ParticipationReward />} />
        <Route path="/reward/exclusive" element={<ExclusiveAccess />} />
      </Routes>
    </Router>
  );
};

export default App;
