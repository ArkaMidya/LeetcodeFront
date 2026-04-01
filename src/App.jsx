import { Routes, Route, useLocation, Navigate } from "react-router";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { authSlice, checkAuth } from "./Slice"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Navbar from "./common/navbar";
import Problems from "./pages/Problems";
import CreateProblem from "./pages/CreateProblem"
import ProblemDetail from "./pages/ProblemDetail"
import Profile from "./pages/Profile"
import AdminDashboard from "./pages/AdminPanel";
import DeleteProblem from "./pages/DeleteProblem"
import AdminRegister from "./pages/AdminRegister";
import VideoCreator from "./components/VideoCreator"
function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
function AdminRoute({ children }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}


function AnimatedRoutes() {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])
  const { loading, isAuthenticated,role } = useSelector((state) => state.auth)
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
        <Route
          path="/problems"
          element={ 
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/registerAdmin"
          element={
            <AdminRoute>
              <AdminRegister />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/createProblem"
          element={
            <AdminRoute>
              <CreateProblem/>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/deleteProblem"
          element={
            <AdminRoute>
              <DeleteProblem/>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/uploadVideo"
          element={
            <AdminRoute>
              <VideoCreator/>
            </AdminRoute>
          }
        />
        
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemDetail/>
            </ProtectedRoute>
          }
        />
      </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#0a1017] overflow-hidden relative app-noise">

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-24 w-80 h-80 bg-cyan-800/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-80 h-80 bg-amber-700/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-teal-900/20 rounded-full blur-3xl" />

        {/* Dot matrix */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1.6px)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      <AnimatedRoutes />

    </div>
  );
}

export default App;