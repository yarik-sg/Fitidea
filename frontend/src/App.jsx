import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Gyms from "./pages/Gyms";
import Programs from "./pages/Programs";
import ProductDetail from "./pages/ProductDetail";
import SupplementDetail from "./pages/SupplementDetail";
import GymDetail from "./pages/GymDetail";
import ProgramDetail from "./pages/ProgramDetail";
import CoachDetail from "./pages/CoachDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import { useAuth } from "./lib/auth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/20 to-transparent" aria-hidden />
      <Header />
      <main className="section-shell py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/supplements/:id" element={<SupplementDetail />} />
          <Route path="/gyms/:id" element={<GymDetail />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/coaches/:id" element={<CoachDetail />} />
          <Route path="/gyms" element={<Gyms />} />
          <Route path="/programs" element={<Programs />} />
          <Route
            path="/favorites"
            element={<ProtectedRoute><Favorites /></ProtectedRoute>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
