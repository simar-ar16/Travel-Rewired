import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
// Placeholder imports for pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
// import Home from './pages/Home';

import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import TripPlanner from './pages/TripPlanner';
import GuideHome from './pages/GuideHome';
import BookGuide from './pages/BookGuide';
import GuideProfile from './pages/GuideProfile';
import TripDetails from './pages/TripDetails';
import GuideRequests from './pages/GuideRequests';

// Protected Route Wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* Add other protected routes here */}
            {/* Protected home route for travelers */}
            <Route path="/home" element={<Landing />} />

            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/guide/:id" element={<GuideProfile />} />

            <Route path="/trip-planner" element={<ProtectedRoute roles={['traveler', 'admin']}><TripPlanner /></ProtectedRoute>} />
            <Route path="/trip-planner/:id" element={<ProtectedRoute roles={['traveler', 'admin']}><TripDetails /></ProtectedRoute>} />
            <Route path="/book-guide/:guideId" element={<ProtectedRoute roles={['traveler']}><BookGuide /></ProtectedRoute>} />

            <Route path="/guide/home" element={<ProtectedRoute roles={['guide']}><GuideHome /></ProtectedRoute>} />
            <Route path="/guide/requests" element={<ProtectedRoute roles={['guide']}><GuideRequests /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
