import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  FaCode, 
  FaTrophy, 
  FaBriefcase, 
  FaArrowRight, 
  FaQuoteLeft,
  FaRocket,
  FaBrain,
  FaUsers,
  FaChartLine,
  FaStar,
  FaGithub,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa';
import { SiLeetcode, SiHackerrank } from 'react-icons/si';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import FloatingBackground from "../components/floatingParticle";
import HeroCodeEditor from "../components/animatedCodeEditor";
import { useNavigate } from "react-router";

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -1200]);
  const testimonialX = useSpring(rawX, {
    stiffness: 120,
    damping: 30,
    mass: 0.5
  });

  return (
    <main className="bg-gradient-to-br from-[#0a0c15] via-[#0f1222] to-[#0a0c15] text-white selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Hero Section - Redesigned with neon effects */}
      <section className="relative min-h-screen px-6 lg:px-20 pt-16 pb-10 flex items-center overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        
        <div className="container mx-auto grid lg:grid-cols-12 gap-10 items-center w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            {/* AlgoForge Logo */}
            {/* <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-cyan-600 px-3 py-2 rounded-lg flex items-center justify-center">
                  <FaBrain className="text-white text-2xl" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">AlgoForge</span>
                <span className="text-xs text-purple-300/70 font-mono tracking-wider">CODE MASTERY PLATFORM</span>
              </div>
            </motion.div> */}

            {/* Animated badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-sm font-mono text-purple-300">#CODE_NEW_SEASON</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Master the
              </span>
              <br />
              <span className="relative inline-block">
                Art of Code
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                />
              </span>
            </h1>

            <p className="text-gray-300 text-lg lg:text-xl mb-8 leading-relaxed max-w-xl">
              Level up your problem-solving skills with our cutting edge platform focused on algorithms, data structures, and interview success.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/problems')}
                className="group relative px-8 py-4 rounded-full font-bold text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2 text-white">
                  Start Coding <FaRocket className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/problems')}
                className="px-8 py-4 rounded-full font-bold text-lg border-2 border-purple-500/50 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20 bg-white/5 backdrop-blur-sm"
              >
                Explore Challenges
              </motion.button>
            </div>

            {/* Stats with glassmorphism */}
            {/* <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Active Users", value: "100K+", icon: FaUsers },
                { label: "Problems", value: "2.5K+", icon: FaCode },
                { label: "Success Rate", value: "94%", icon: FaChartLine }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all group"
                >
                  <stat.icon className="text-2xl text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <HeroCodeEditor />
          </motion.div>
        </div>
      </section>

      {/* Features Section - Modern card design */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AlgoForge
              </span>
              ?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to accelerate your coding journey and land your dream job
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaCode />} 
              title="Smart Practice" 
              desc="AI-powered problem recommendations based on your skill level and learning pace" 
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard 
              icon={<FaTrophy />} 
              title="Global Competitions" 
              desc="Weekly coding contests with real-time rankings and exciting prizes" 
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard 
              icon={<FaBriefcase />} 
              title="Interview Ready" 
              desc="Curated problems from top tech companies with detailed solutions" 
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works - Interactive timeline */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Your Path to{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="text-gray-400">Three simple steps to level up your coding skills</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 hidden md:block" />
            <Step number="01" title="Choose Your Challenge" desc="Select from  Problem Pool across various difficulty levels and topics" />
            <Step number="02" title="Code & Debug" desc="Write, test, and optimize your solution in our advanced editor" />
            <Step number="03" title="Master & Repeat" desc="Learn from solutions, track progress, and tackle harder problems" />
          </div>
        </div>
      </section>

      {/* Stats Section - Animated counters */}
      {/* <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat value={2500} label="Problems Solved" suffix="+" prefix="" />
            <AnimatedStat value={100} label="Countries" suffix="+" prefix="" />
            <AnimatedStat value={50000} label="Active Coders" suffix="+" prefix="" />
            <AnimatedStat value={95} label="Success Rate" suffix="%" prefix="" />
          </div>
        </div>
      </section> */}

      {/* Testimonials - Carousel style */}
      {/* <section className="py-24 px-6 overflow-hidden relative">
        <div className="container mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              What Our{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Community
              </span>{' '}
              Says
            </h2>
            <p className="text-gray-400">Join thousands of developers who transformed their careers</p>
          </motion.div>
        </div>

        <motion.div
          style={{ x: testimonialX }}
          className="flex gap-6 px-6"
        >
          {[...Array(8)].map((_, i) => (
            <TestimonialCard key={i} />
          ))}
        </motion.div>
      </section> */}

      {/* CTA Section - Modern gradient */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-600/20 to-purple-600/20 blur-3xl" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-xl border border-white/10 p-12 text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join a growing community of developers mastering algorithms on AlgoForge.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/problems')}
              className="group px-12 py-5 rounded-full font-bold text-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:shadow-2xl hover:shadow-purple-500/50 transition-all inline-flex items-center gap-3"
            >
              Start Your Journey <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer - Redesigned */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                AlgoForge
              </h3>
              <p className="text-gray-400 text-sm">
                Empowering developers to achieve their coding goals through smart practice and community learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">Problems</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Contests</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Discussions</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Support</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition text-xl"><FaGithub /></a>
                <a href="https://www.linkedin.com/in/arka-midya-040b58322" target='_blank' className="text-gray-400 hover:text-purple-400 transition text-xl"><FaLinkedin /></a>
                {/* <a href="#" className="text-gray-400 hover:text-purple-400 transition text-xl"><FaTwitter /></a> */}
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm pt-8 border-t border-white/10">
            © 2026 AlgoForge. All rights reserved. Made with ❤️ for the coding community.
          </div>
        </div>
      </footer>
    </main>
  );
}

// Updated Feature Card with hover effects
function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-transparent transition-all overflow-hidden cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="relative">
        <div className="text-4xl mb-4 text-purple-400 group-hover:scale-110 transition-transform inline-block">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// Updated Step component with hover effects
function Step({ number, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative p-6 text-center group"
    >
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-2xl font-bold relative z-10 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 -translate-x-1/2 hidden md:block" />
      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </motion.div>
  );
}

// Animated Stat component
function AnimatedStat({ value, label, suffix, prefix }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all"
    >
      <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
        {inView && <CountUp end={value} duration={3} separator="," />}
        {suffix}
      </h3>
      <p className="text-gray-400 text-sm uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}

// Updated Testimonial Card
function TestimonialCard() {
  const testimonials = [
    { name: "Sarah Chen", role: "Software Engineer @ Google", quote: "The problem quality and solutions are exceptional. Helped me ace my technical interviews!" },
    { name: "Michael Rodriguez", role: "Senior Developer @ Amazon", quote: "Best platform for interview prep. The AI recommendations saved me hours of practice time." },
    { name: "Emma Watson", role: "Full Stack Developer", quote: "Love the community and contest features. Made learning fun and competitive!" }
  ];
  
  const testimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="min-w-[350px] p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all"
    >
      <FaQuoteLeft className="text-purple-500/30 text-3xl mb-4" />
      <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold">
          {testimonial.name[0]}
        </div>
        <div>
          <h4 className="font-bold text-sm">{testimonial.name}</h4>
          <p className="text-gray-500 text-xs">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}