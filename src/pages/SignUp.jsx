import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { registerUser,authSlice} from "../Slice";
import {useSelector,useDispatch} from "react-redux";


const schema = z.object({
  firstName: z.string().min(3, "Name is too short"),
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
  initial: { opacity: 0, x: 60, filter: "blur(8px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 80, filter: "blur(8px)", transition: { duration: 0.35 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function InputField({ label, type, placeholder, register, name, error }) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div variants={fadeUp}>
      <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
        {label}
      </label>

      <div className="relative">
        <motion.div
          animate={{ opacity: focused ? 1 : 0 }}
          className="absolute -inset-0.5 rounded-xl bg-linear-to-r from-amber-500/40 to-teal-500/40 blur-sm"
        />

        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="relative w-full bg-white/3 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-teal-400/60"
        />
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
    </motion.div>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const strength = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1,2,3,4].map((i)=>(
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              strength >= i ? colors[strength] : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-slate-400">{labels[strength]}</p>
    </div>
  );
}

export default function SignUp() {

  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState:{errors}
  } = useForm({
    resolver:zodResolver(schema)
  });
  const loading=useSelector((state)=>state.auth.loading);
  const password = watch("password") || "";
  const submittedForm = async (data)=>{
    try {
      await dispatch(registerUser(data)).unwrap();
      console.log("User Registered");
    } catch (error) {
      console.error("Signup failed:", error);
    }
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

        <div className="hidden lg:flex lg:col-span-2 p-8 bg-linear-to-br from-amber-500/20 via-orange-500/10 to-transparent border-r border-white/10 flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300/80 mb-4">Signup portal</p>
            <h2 className="text-3xl font-bold text-white leading-tight">Build your profile and start solving today.</h2>
            <p className="text-slate-300/80 text-sm mt-4">Create an account to save submissions, unlock progress history, and continue your practice journey.</p>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Curated problem lists</p>
            <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Difficulty-wise practice tracking</p>
            <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Cleaner interview preparation workflow</p>
          </div>
        </div>

        <div className="lg:col-span-3 p-6 sm:p-8">

        <motion.div variants={fadeUp} className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            Create your account
          </h1>
          <p className="text-sm text-slate-500">
            Get started in seconds
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(submittedForm)} className="space-y-5">

          <InputField
            label="Full Name"
            type="text"
            placeholder="John Doe"
            register={register}
            name="firstName"
            error={errors.firstName}
          />

          <InputField
            label="Email"
            type="email"
            placeholder="you@email.com"
            register={register}
            name="emailId"
            error={errors.emailId}
          />

          <div>
            <InputField
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              register={register}
              name="password"
              error={errors.password}
            />

            <PasswordStrength password={password}/>
          </div>

          <motion.button
            variants={fadeUp}
            type="submit"
            disabled={loading}
            whileHover={{scale:1.02}}
            whileTap={{scale:0.97}}
            className="w-full py-3 rounded-xl bg-linear-to-r from-teal-400 to-cyan-500 text-[#082126] font-bold"
          >
            {loading ? "Creating account..." : "Create account"}
          </motion.button>

        </form>

        <motion.p
          variants={fadeUp}
          className="text-center text-sm text-slate-500 mt-6"
        >
          Already have an account?{" "}
          <button
            onClick={()=>navigate("/login")}
            className="text-teal-300 hover:text-teal-200 font-semibold"
          >
            Sign in
          </button>
        </motion.p>

        </div>
      </div>
    </motion.div>
    </div>
  );
}