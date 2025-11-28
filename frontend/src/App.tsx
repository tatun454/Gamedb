import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminDashboard from "./pages/AdminDashboard";
import GameDetailPage from "./pages/GameDetailPage";

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <video
        autoPlay
        muted
        loop
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source
          src="https://cdn.pixabay.com/video/2022/06/13/120172-720504774_large.mp4"
          //https://cdn.pixabay.com/video/2019/08/13/26007-353916139_large.mp4
          //https://cdn.pixabay.com/video/2017/06/11/9810-221185517_large.mp4
          type="video/mp4"
        />
      </video>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <RegisterPage />}
        />
        <Route
          path="/favorites"
          element={user ? <FavoritesPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={
            user?.role === "ADMIN" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
