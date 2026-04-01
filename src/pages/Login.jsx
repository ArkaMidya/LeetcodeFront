import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../Slice";

const schema = z.object({
  emailId: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
});

const pageVariants = {
  initial: { opacity: 0, x: -60, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
    x: -80,
    filter: "blur(8px)",
    transition: { duration: 0.35 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function InputField({ label, type, placeholder, register, name, error }) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div variants={fadeUp} className="relative">
      <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
        {label}
      </label>

      <div className="relative">
        <motion.div
          animate={{ opacity: focused ? 1 : 0 }}
          className="absolute -inset-0.5 rounded-xl bg-linear-to-r from-amber-500/40 to-teal-500/40 blur-sm pointer-events-none"
        />

        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="relative w-full bg-white/3 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-amber-400/60"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1">{error.message}</p>
      )}
    </motion.div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const submittedForm = (data) => {
    console.log("User Logged in")
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen px-4 py-10 lg:py-16 flex items-center justify-center">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-5xl"
      >
        <div className="grid lg:grid-cols-5 rounded-3xl border border-white/10 overflow-hidden bg-[#101927]/80 backdrop-blur-xl shadow-2xl shadow-black/40">

          <div className="hidden lg:flex lg:col-span-2 p-8 bg-linear-to-br from-teal-500/20 via-cyan-500/10 to-transparent border-r border-white/10 flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-teal-300/80 mb-4">Login portal</p>
              <h2 className="text-3xl font-bold text-white leading-tight">Welcome back to your coding workspace.</h2>
              <p className="text-slate-300/80 text-sm mt-4">Track solved problems, continue submissions, and review your progress from one place.</p>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Daily streak insights</p>
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Submission history snapshots</p>
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Practice recommendations</p>
            </div>
          </div>

          <div className="lg:col-span-3 p-6 sm:p-8">

          {/* Heading */}
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to continue
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(submittedForm)} className="space-y-5">

            <InputField
              label="Email"
              type="email"
              placeholder="you@company.com"
              register={register}
              name="emailId"
              error={errors.emailId}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              register={register}
              name="password"
              error={errors.password}
            />

            {/* Button */}
            <motion.button
              variants={fadeUp}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-[#1a1207] font-bold"
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
            {error && (
              <p className="text-red-400 text-xs mt-1">{error}</p>
            )}
          </form>

          <motion.p
            variants={fadeUp}
            className="text-center text-sm text-slate-500 mt-6"
          >
            New here?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-amber-300 hover:text-amber-200 font-semibold"
            >
              Create account →
            </button>
          </motion.p>

          </div>
        </div>
      </motion.div>
    </div>
  );
}