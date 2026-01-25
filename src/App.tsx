import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { StatsPage } from './pages/StatsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/vibes" element={<StatsPage />} />
      <Route path="/sample_1" element={<StatsPage sampleId="default" />} />
      <Route path="/sample_2" element={<StatsPage sampleId="night_owl" />} />
      <Route path="/sample_3" element={<StatsPage sampleId="polite" />} />
      <Route path="/sample_4" element={<StatsPage sampleId="essay_writer" />} />
    </Routes>
  );
}

export default App;
