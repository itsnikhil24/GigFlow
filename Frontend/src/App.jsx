import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateGig from "./pages/CreateGig";
import BrowseGigs from "./pages/BrowseGigs";
import GigDetail from "./pages/GigDetail";


function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Login />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gigs/new" element={<CreateGig />} />
        <Route path="/browse-gigs" element={<BrowseGigs />} />
        <Route path="/gig/:id" element={<GigDetail />} />


        {/* Protected Page (for now open) */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
