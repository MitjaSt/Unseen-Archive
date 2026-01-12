import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ListPage from './pages/ListPage';
import AddPage from './pages/AddPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import TestDesignPage from './pages/TestDesignPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/list" replace />} />
        <Route path="list" element={<ListPage />} />
        <Route path="add" element={<AddPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="test-design" element={<TestDesignPage />} />
      </Route>
    </Routes>
  );
}

export default App;
