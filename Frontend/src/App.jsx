import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateGig from "./pages/CreateGig";
import BrowseGigs from "./pages/BrowseGigs";
import GigDetail from "./pages/GigDetail";

import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";

function App() {

  
  return (
    <>
    <Toaster position="top-right" />
    <Router>
      <Routes>

        {/* 🌍 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/browse-gigs" element={<BrowseGigs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* 🔒 Protected Routes */}
       

        <Route
          path="/gigs/new"
          element={
            <PrivateRoute>
              <CreateGig />
            </PrivateRoute>
          }
        />

        <Route
          path="/gig/:id"
          element={
            <PrivateRoute>
              <GigDetail />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
    </>
  );
}

export default App;
