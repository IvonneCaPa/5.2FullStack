import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Activities from './pages/Activities';
import GalleryList from './components/gallery/GalleryList';
import GalleryForm from './components/gallery/GalleryForm';
import GalleryDetail from './components/gallery/GalleryDetail';
import Header from './components/Header';
import './components/gallery/Gallery.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  return user ? (
    <>
      <Header />
      {children}
    </>
  ) : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/activities" element={
              <ProtectedRoute>
                <Activities />
              </ProtectedRoute>
            } />
            <Route path="/galleries" element={
              <ProtectedRoute>
                <GalleryList />
              </ProtectedRoute>
            } />
            <Route path="/galleries/new" element={
              <ProtectedRoute>
                <GalleryForm />
              </ProtectedRoute>
            } />
            <Route path="/galleries/edit/:id" element={
              <ProtectedRoute>
                <GalleryForm />
              </ProtectedRoute>
            } />
            <Route path="/galleries/:id" element={
              <ProtectedRoute>
                <GalleryDetail />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;