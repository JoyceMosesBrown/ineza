import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Tracker from './pages/Tracker';
import Progress from './pages/Progress';
import Learn from './pages/Learn';
import Peers from './pages/Peers';
import CHW from './pages/CHW';

function Inner() {
  const { onboarded } = useApp();
  if (!onboarded) return <Onboarding />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/peers" element={<Peers />} />
        <Route path="/chw" element={<CHW />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Inner />
      </AppProvider>
    </BrowserRouter>
  );
}
