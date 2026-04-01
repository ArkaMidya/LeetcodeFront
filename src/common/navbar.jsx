import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { User } from 'lucide-react';
import { FaBrain } from 'react-icons/fa';
import { loginUser, logoutUser } from "../Slice";
import { useNavigate } from "react-router";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth)
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handlelogout = () => {
    dispatch(logoutUser());
    console.log("User Logout Successfully");
  }

  return (
    <nav className="sticky top-0 bg-[#0b131c]/85 backdrop-blur-xl text-white px-6 py-4 flex justify-between items-center border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.28)] relative z-50">
      {/* Left Section: Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-teal-300 cursor-pointer tracking-tight flex items-center gap-2"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-teal-300 rounded-lg blur-md opacity-50"></div>
          <div className="relative bg-gradient-to-br from-amber-400 to-teal-400 px-2 py-1 rounded-lg flex items-center justify-center">
            <FaBrain className="text-white text-lg" />
          </div>
        </div>
        <button onClick={()=>{navigate("/")}}>AlgoForge</button>
      </motion.div>

      {/* Right Section: Auth UI */}
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <button onClick={() => { navigate("/login") }} className="bg-white/10 hover:bg-white/15 text-white px-5 py-2 rounded-full transition duration-200 font-medium border border-white/15">
            Login
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            {/* Username Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full transition duration-200 border border-white/15"
            >
              <span className="font-medium">{user.firstName}</span>
              <User size={14} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-48 bg-[#111a25] rounded-2xl shadow-xl border border-white/10 py-2 overflow-hidden"
                >
                  <div className="px-4 py-2 text-xs text-slate-400 uppercase font-bold tracking-wider">
                    User Settings
                  </div>
                  <button onClick={()=>{navigate("/profile")}} className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors duration-150 flex items-center gap-2">
                    <span className="text-sm">Profile</span>
                  </button>
                  <button onClick={()=>{navigate('/problems')}} className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors duration-150 flex items-center gap-2">
                    <span className="text-sm">
                      All Problems</span>
                  </button>
                  <hr className="border-white/10 my-1" />
                  <button
                    className="w-full text-left px-4 py-2.5 hover:bg-red-500/10 text-red-400 transition-colors duration-150 flex items-center gap-2"
                    onClick={handlelogout}
                  >
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;