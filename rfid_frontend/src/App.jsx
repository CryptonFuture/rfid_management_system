import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import RfidTags from './pages/RfidTags';
import Scans from './pages/Scans';
import Locations from './pages/Locations';
import SimulateScan from './pages/SimulateScan';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="rfid-tags" element={<RfidTags />} />
          <Route path="scans" element={<Scans />} />
          <Route path="locations" element={<Locations />} />
          <Route path="simulate" element={<SimulateScan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;