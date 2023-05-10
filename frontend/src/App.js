import { Routes, Route, Navigate } from 'react-router-dom';

import './index.scss';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/UserContext';
import AdminRoute from './Routes/AdminRoute';
import ThemeMode from './Routes/ThemeMode';

function App() {
  return (
    <AuthProvider>
      <ThemeMode>
        <Routes>
          <Route
            path="/"
            element={
              <AdminRoute>
                <HomePage />
              </AdminRoute>
            }
          />
          <Route exact path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/test" element={<div>hello</div>} />
        </Routes>
      </ThemeMode>
    </AuthProvider>
  );
}

export default App;
