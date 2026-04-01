import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
    Trophy, CheckCircle2, Circle, Activity, Search,
    ChevronLeft, ChevronRight, LayoutDashboard, ExternalLink,
    ShieldCheck, Zap, Database, Clock, TrendingUp, Award,
    Code2, Brain, Target, Sparkles, Flame, Star
} from 'lucide-react';
import axiosMain from '../utils/axios';
import DashboardSkeleton from '../components/DashboardShimmer';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProblem } from '../Slice';
import { useNavigate } from 'react-router';

// --- UTILS ---
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// --- COMPONENTS ---

const Badge = ({ children, variant = "default" }) => {
    const styles = {
        accepted: "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
        wrong: "bg-gradient-to-r from-rose-500/20 to-rose-600/20 text-rose-400 border-rose-500/30",
        admin: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
        default: "bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-slate-300 border-slate-600"
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[variant]}`}>
            {children}
        </span>
    );
};

const Card = ({ children, className = "", adminGlow = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`bg-gradient-to-br from-[#0f172a]/90 to-[#1e1b4b]/90 backdrop-blur-sm border border-indigo-500/20 rounded-2xl overflow-hidden relative transition-all duration-300 ${adminGlow ? 'shadow-[0_0_30px_rgba(99,102,241,0.15)] border-indigo-500/30' : 'hover:border-indigo-500/30'} ${className}`}
    >
        {children}
    </motion.div>
);

const StatsCard = ({ title, value, icon: Icon, color, index }) => {
    const gradients = {
        'bg-blue-500/10': 'from-blue-500 to-cyan-500',
        'bg-emerald-500/10': 'from-emerald-500 to-teal-500',
        'bg-rose-500/10': 'from-rose-500 to-pink-500',
        'bg-purple-500/10': 'from-purple-500 to-indigo-500'
    };
    
    const gradient = gradients[color] || 'from-blue-500 to-cyan-500';
    
    return (
        <Card className="p-6 group">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between relative"
            >
                <div className="z-10">
                    <p className="text-indigo-300/70 text-sm font-medium tracking-wide">{title}</p>
                    <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-[0_0_28px_rgba(99,102,241,0.25)]`}>
                    <Icon className="w-6 h-6 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                </div>
            </motion.div>
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:w-full w-0`} />
        </Card>
    );
};

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [solvedProblemDetails, setSolvedProblemDetails] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const limit = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [API_DATA, SetAPI_DATA] = useState({});
    const { user = {}, submissions = [], pagination = {} } = API_DATA;
    const isAdmin = user?.role === "admin";

    const handleAdmin = () => {
        navigate("/admin");
    }

    const { problems } = useSelector((state) => state.problem);
    useEffect(() => {
        if (problems.length == 0)
            dispatch(getAllProblem());
    }, [problems, dispatch])
    
    const handleClick = (idx) => {
        navigate(`/problems/${submissions[idx].problemId._id}`)
    }
    
    // Process data for charts
    const chartData = useMemo(() => {
        if (!submissions || submissions.length === 0) {
            return [
                { name: "No Data", runtime: 0, memory: 0 }
            ];
        }
        return submissions.map(s => ({
            name: formatDate(s.createdAt),
            runtime: s.runtime || 0,
            memory: s.memory || 0
        }));
    }, [submissions]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axiosMain.get(`user/getProfile?page=${page}&limit=${limit}`);
                SetAPI_DATA(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [page])

    useEffect(() => {
        const fetchSolvedProblems = async () => {
            try {
                const response = await axiosMain.get('problem/problemSolvedByUser');
                setSolvedProblemDetails(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error(error);
                setSolvedProblemDetails([]);
            }
        };
        fetchSolvedProblems();
    }, []);
    
    const totalProblems = problems?.length || 0;
    const solvedProblems = user?.totalProblemSolved || 0;
    const achievementScore = useMemo(() => {
        if (!Array.isArray(solvedProblemDetails) || solvedProblemDetails.length === 0) {
            return 0;
        }

        const weighted = solvedProblemDetails.reduce((sum, problem) => {
            const level = (problem?.difficultyLevel || problem?.difficulty || '').toLowerCase();
            if (level === 'easy') return sum + 5;
            if (level === 'medium') return sum + 10;
            if (level === 'hard') return sum + 15;
            return sum;
        }, 0);

        // If legacy API data misses difficulty field, avoid showing 0 for solved users.
        if (weighted === 0 && solvedProblems > 0) {
            return solvedProblems * 10;
        }
        return weighted;
    }, [solvedProblemDetails, solvedProblems]);

    const pieData = [
        { name: 'Solved', value: solvedProblems, color: '#6366F1' },
        { name: 'Unsolved', value: totalProblems - solvedProblems, color: '#334155' }
    ];
    const acceptanceRate = submissions.length ? ((pieData[0].value / totalProblems) * 100).toFixed(1) : 0;

    return (
        <>
            {loading == true ? <DashboardSkeleton /> : (
                <div 
                    className="min-h-screen text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30 relative overflow-hidden"
                    style={{ 
                        backgroundColor: 'oklab(0.242051 -0.0070097 -0.0356803 / 0.7)',
                        backgroundImage: 'radial-gradient(circle at 25% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
                    }}
                >
                    
                    {/* Animated Background Elements - Adjusted for new background */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 -left-40 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] animate-pulse delay-1000" />
                        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-2000" />
                    </div>

                    {/* HEADER SECTION */}
                    <header className="max-w-7xl mx-auto mb-10 relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-5">
                                <motion.div 
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="relative group"
                                >
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl ${isAdmin ? 'ring-3 ring-indigo-500/50 ring-offset-4 ring-offset-[#0a0f1a]' : ''}`}>
                                        {user?.firstName?.[0] || "U"}
                                    </div>
                                    {isAdmin && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-xl shadow-lg"
                                        >
                                            <ShieldCheck size={14} className="text-white" />
                                        </motion.div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                                </motion.div>
                                
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                                            Welcome back, {user.firstName}
                                        </h1>
                                        {isAdmin && <Badge variant="admin">✨ Admin Elite</Badge>}
                                    </div>
                                    <p className="text-indigo-300/70 text-sm mt-1 flex items-center gap-2">
                                        <Sparkles size={14} />
                                        {user.emailId}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-right mr-4 hidden sm:block"
                                >
                                    <p className="text-xs text-indigo-400/60 uppercase tracking-wider font-semibold flex items-center gap-1 justify-end">
                                        <Trophy size={12} /> Achievement Score
                                    </p>
                                    <p className="text-2xl font-mono font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                        {achievementScore}
                                    </p>
                                </motion.div>
                                
                                {isAdmin && (
                                    <motion.button
                                        onClick={handleAdmin}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative px-6 py-3 rounded-xl overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative flex items-center gap-2 text-white font-semibold">
                                            <LayoutDashboard size={18} /> Dashboard Pro
                                        </span>
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </header>

                    <main className="max-w-7xl mx-auto space-y-8 relative z-10">
                        {/* STATS SECTION */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatsCard index={0} title="Total Submissions" value={pagination.total} icon={Activity} color="bg-blue-500/10" />
                            <StatsCard index={1} title="Problems Solved" value={user.totalProblemSolved} icon={CheckCircle2} color="bg-emerald-500/10" />
                            <StatsCard index={2} title="Remaining" value={pieData[1].value} icon={Target} color="bg-rose-500/10" />
                            <StatsCard index={3} title="Success Rate" value={`${acceptanceRate}%`} icon={TrendingUp} color="bg-purple-500/10" />
                        </div>

                        {/* CHARTS SECTION */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                            <Card className="lg:col-span-2 p-6" adminGlow={isAdmin}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-indigo-500/20">
                                            <Activity size={18} className="text-indigo-400" />
                                        </div>
                                        Performance Analytics
                                    </h3>
                                    <Badge variant="default">Last {submissions.length} submissions</Badge>
                                </div>
                                <div className="h-[320px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorRuntime" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366F1', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ color: '#818cf8' }}
                                            />
                                            <Area type="monotone" dataKey="runtime" stroke="#6366F1" fillOpacity={1} fill="url(#colorRuntime)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="p-6 flex flex-col" adminGlow={isAdmin}>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-purple-500/20">
                                        <PieChart size={18} className="text-purple-400" />
                                    </div>
                                    Problem Distribution
                                </h3>
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                innerRadius={70}
                                                outerRadius={95}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366F1', borderRadius: '12px' }}
                                            />
                                            <Legend 
                                                verticalAlign="bottom" 
                                                height={36}
                                                formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 text-center">
                                    <p className="text-sm text-indigo-300/70">
                                        {solvedProblems} / {totalProblems} problems conquered
                                    </p>
                                </div>
                            </Card>
                        </div>

                        {/* TABLE SECTION */}
                        <Card className="p-0 overflow-hidden">
                            <div className="p-6 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-transparent">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Code2 size={22} className="text-indigo-400" />
                                            Recent Submissions
                                        </h3>
                                        <p className="text-sm text-indigo-300/60 mt-1">
                                            Showing {submissions.length} of {pagination.total} code solutions
                                        </p>
                                    </div>

                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search problems..."
                                            className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-indigo-300/70 text-xs uppercase tracking-wider bg-slate-900/30">
                                            <th className="px-6 py-4 font-semibold">Problem</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold">Runtime</th>
                                            <th className="px-6 py-4 font-semibold">Memory</th>
                                            <th className="px-6 py-4 font-semibold">Submitted</th>
                                            <th className="px-6 py-4 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-indigo-500/10">
                                        {submissions.length == 0 ? (
                                            <tr>
                                                <td colSpan="6" className="py-16 text-center">
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="flex flex-col items-center gap-3"
                                                    >
                                                        <Code2 size={48} className="text-indigo-500/30" />
                                                        <p className="text-slate-500">No submissions yet</p>
                                                        <p className="text-sm text-slate-600">Start coding to see your progress!</p>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        ) : (
                                            <AnimatePresence>
                                                {submissions
                                                    .filter(s => s.problemId?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
                                                    .map((sub, idx) => (
                                                        <motion.tr
                                                            key={sub._id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="hover:bg-indigo-500/5 transition-all duration-300 group"
                                                        >
                                                            <td className="px-6 py-4">
                                                                <span className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors cursor-pointer">
                                                                    {sub.problemId?.title}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant={sub.status === "Accepted" ? "accepted" : "wrong"}>
                                                                    {sub.status === "Accepted" ? (
                                                                        <span className="flex items-center gap-1">
                                                                            <CheckCircle2 size={12} /> Accepted
                                                                        </span>
                                                                    ) : (
                                                                        <span className="flex items-center gap-1">
                                                                            <Circle size={12} /> Failed
                                                                        </span>
                                                                    )}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                                                    <Zap size={14} className="text-indigo-400" /> {sub.runtime} ms
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                                                    <Database size={14} className="text-indigo-400" /> {sub.memory} KB
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Clock size={12} /> {formatDate(sub.createdAt)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => { handleClick(idx) }}
                                                                    className="text-slate-500 hover:text-indigo-400 transition-colors"
                                                                >
                                                                    <ExternalLink size={18} />
                                                                </motion.button>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                            </AnimatePresence>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINATION */}
                            <div className="p-6 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-transparent to-indigo-500/5">
                                <p className="text-sm text-indigo-300/60">
                                    Page <span className="text-indigo-400 font-medium">{pagination.page}</span> of {pagination.totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </motion.button>
                                    {Array.from({ length: Math.min(pagination.totalPages || 1, 5) }, (_, i) => i + 1).map(num => (
                                        <motion.button
                                            key={num}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setPage(num)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${pagination.page === num
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                                                    : 'border border-indigo-500/30 hover:bg-indigo-500/20'
                                                }`}
                                        >
                                            {num}
                                        </motion.button>
                                    ))}
                                    {pagination.totalPages > 5 && (
                                        <span className="flex items-center px-2 text-slate-500">...</span>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages || 1))}
                                        disabled={page === pagination.totalPages}
                                        className="p-2 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </motion.button>
                                </div>
                            </div>
                        </Card>
                    </main>

                    {/* Decorative Footer */}
                    <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-600/5 to-transparent pointer-events-none" />
                </div>
            )}
        </>
    );
};

export default Dashboard;