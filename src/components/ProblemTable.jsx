import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import axiosMain from '../utils/axios';
import {useNavigate} from "react-router"
const DifficultyBadge = ({ level }) => {
  const styles = {
    Easy: "text-teal-300 bg-teal-400/10 border-teal-300/30",
    Medium: "text-amber-300 bg-amber-300/10 border-amber-300/30",
    Hard: "text-rose-300 bg-rose-400/10 border-rose-300/30",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[level]}`}>
      {level}
    </span>
  );
};

const ProblemRow = ({ problem, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.005, backgroundColor: "rgba(24, 37, 52, 0.72)" }}
      className="group flex flex-col md:flex-row items-start md:items-center px-6 py-4 border-b border-white/5 transition-colors cursor-pointer"
    >
      {/* S.No & Status */}
      <div className="flex items-center gap-4 w-full md:w-24 mb-2 md:mb-0">
        <span className="text-slate-400 text-sm font-mono w-6">{index + 1}</span>
        {problem.isSolved ? (
          <FiCheckCircle className="text-emerald-500 w-5 h-5" />
        ) : (
          <FiCircle className="text-slate-600 w-5 h-5" />
        )}
      </div>

      {/* Title */}
      <div className="flex-1 mb-3 md:mb-0">
        <h3 className="text-slate-100 font-medium group-hover:text-amber-300 transition-colors">
          {problem.title}
        </h3>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 flex-1 mb-3 md:mb-0">
        {problem.tags.map((tag, tagIndex) => (
          <span key={`${problem._id || problem.id}-${tag}-${tagIndex}`} className="px-2 py-0.5 bg-[#1a2636] text-slate-300 text-[10px] uppercase tracking-wider rounded border border-white/10">
            {tag}
          </span>
        ))}
      </div>

      {/* Difficulty */}
      <div className="w-full md:w-24 flex justify-end">
        <DifficultyBadge level={problem.difficultyLevel} />
      </div>
    </motion.div>
  );
};

const ProblemsTable = ({ problems }) => {

  const navigate =useNavigate();

  const handleroute=(id)=>{
    navigate(`${id}`);
  }

  // console.log(problems);
  return (
    <div className="bg-[#111b2a]/70 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
      {/* Desktop Header */}
      <div className="hidden md:flex px-6 py-4 bg-[#1b2839]/70 border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest">
        <div className="w-24">Status</div>
        <div className="flex-1">Title</div>
        <div className="flex-1">Topics</div>
        <div className="w-24 text-right">Difficulty</div>
      </div>

      {/* Problem List */}
      <div className="divide-y divide-slate-800/50">
        {problems.length > 0 ? (
          problems.map((problem, idx) => (
            <button key={problem._id || problem.id || idx} onClick={()=>{handleroute(problem._id)}} className='min-w-full text-left'><ProblemRow problem={problem} index={idx} /></button>
          ))
        ) : (
          <div className="p-12 text-center text-slate-500">
            No problems found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsTable;