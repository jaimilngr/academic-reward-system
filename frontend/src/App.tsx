import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; 
import IndividualReward from './components/Individual';
import MarksReward from './components/Marksrewards';
import ParticipationReward from './components/Participation';
import CreateAssignment from './components/CreateAssignment';
import Assignment from './components/Assignments';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reward/transfer" element={<IndividualReward />} />
        <Route path="/reward/marks" element={<MarksReward />} />
        <Route path="/reward/participation" element={<ParticipationReward />} />
        <Route path="/reward/Create" element={<CreateAssignment />} />
        <Route path="/reward/assignments" element={<Assignment />} />

      </Routes>
    </Router>
  );
};

export default App;
