import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AddPage from './pages/AddPage';
import ListPage from './pages/ListPage';
import SettingsPage from './pages/SettingsPage';
import TestDesignPage from './pages/TestDesignPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/list" replace />} />
        <Route path="list" element={<ListPage />} />
        <Route path="add" element={<AddPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="test-design" element={<TestDesignPage />} />
      </Route>
    </Routes>
  );
}

export default App;
