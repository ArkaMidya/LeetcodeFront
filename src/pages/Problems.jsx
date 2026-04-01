import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FiltersBar from '../components/FiltersBar';
import ProblemsTable from '../components/ProblemTable';
import axiosMain from "../utils/axios"
import { useSelector,useDispatch } from "react-redux"
import { problemSlice,getAllProblem } from '../Slice';
// Dummy Data
// const INITIAL_PROBLEMS = [
//   { id: 1, title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Table"], isSolved: true },
//   { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", tags: ["String", "Sliding Window"], isSolved: false },
//   { id: 3, title: "Median of Two Sorted Arrays", difficulty: "Hard", tags: ["Array", "Binary Search"], isSolved: false },
//   { id: 4, title: "Reverse Integer", difficulty: "Easy", tags: ["Math"], isSolved: true },
//   { id: 5, title: "Container With Most Water", difficulty: "Medium", tags: ["Array", "Two Pointers"], isSolved: true },
//   { id: 6, title: "Merge k Sorted Lists", difficulty: "Hard", tags: ["Linked List", "Heap"], isSolved: false },
//   { id: 7, title: "Climbing Stairs", difficulty: "Easy", tags: ["DP"], isSolved: true },
//   { id: 8, title: "Word Search", difficulty: "Medium", tags: ["Backtracking", "Matrix"], isSolved: false },
//   { id: 9, title: "Binary Tree Level Order Traversal", difficulty: "Medium", tags: ["Tree", "BFS"], isSolved: true },
//   { id: 10, title: "Trapping Rain Water", difficulty: "Hard", tags: ["Stack", "Array"], isSolved: false },
//   { id: 11, title: "Valid Parentheses", difficulty: "Easy", tags: ["Stack", "String"], isSolved: true },
//   { id: 12, title: "Search in Rotated Sorted Array", difficulty: "Medium", tags: ["Array", "Binary Search"], isSolved: false },
//   { id: 13, title: "Rotate Image", difficulty: "Medium", tags: ["Array", "Matrix"], isSolved: false },
//   { id: 14, title: "Group Anagrams", difficulty: "Medium", tags: ["Hash Table", "String"], isSolved: true },
//   { id: 15, title: "Maximum Subarray", difficulty: "Medium", tags: ["Array", "DP"], isSolved: true },
//   { id: 16, title: "N-Queens", difficulty: "Hard", tags: ["Backtracking"], isSolved: false },
//   { id: 17, title: "Jump Game", difficulty: "Medium", tags: ["Greedy", "Array"], isSolved: false },
//   { id: 18, title: "Merge Intervals", difficulty: "Medium", tags: ["Array", "Sorting"], isSolved: true },
//   { id: 19, title: "Unique Paths", difficulty: "Medium", tags: ["DP"], isSolved: false },
//   { id: 20, title: "Edit Distance", difficulty: "Hard", tags: ["String", "DP"], isSolved: false },
// ];
const Problems = () => {

    const [filterStatus, setFilterStatus] = useState("All"); // All, Solved
    const [filterDifficulty, setFilterDifficulty] = useState("All");
    const [selectedTag, setSelectedTag] = useState("All");
    const [solveProblem, setSolveProblem] = useState([]);
    // const getAllProblem = async () => {
    //     try {
    //         const response = await axiosMain.get("problem/getAllproblem");
    //         setINITIAL_PROBLEMS(response.data);
    //         console.log(response.data);
    //     } catch (err) {
    //         console.log(err.message);
    //     }
    // }
    const {problems=[]}=useSelector((state)=>state.problem);
    const dispatch=useDispatch();
    const getsolvedProblem = async () => {
        try {
            const response = await axiosMain.get("problem/problemSolvedByUser");
            const solved=response.data.map((p)=>p._id);          
            setSolveProblem(solved);
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
         if(problems.length==0)dispatch(getAllProblem());
    }, [problems,dispatch])
    useEffect(()=>{
        getsolvedProblem();
    },[])
    const filteredProblems = useMemo(() => {
        return problems
            .map(problem => ({
                ...problem,
                isSolved: solveProblem.includes(problem._id)
            }))
            .filter(problem => {
                const statusMatch =
                    filterStatus === "All" ||
                    (filterStatus === "Solved" && problem.isSolved);

                const difficultyMatch =
                    filterDifficulty === "All" ||
                    problem.difficultyLevel === filterDifficulty;

                const tagMatch =
                    selectedTag === "All" ||
                    problem.tags.includes(selectedTag);

                return statusMatch && difficultyMatch && tagMatch;
            });
    }, [problems, solveProblem, filterStatus, filterDifficulty, selectedTag]);

    const solvedCount = filteredProblems.filter((problem) => problem.isSolved).length;
    return (
        <div className="min-h-screen bg-[#0b131c] text-slate-200 p-4 md:p-8 pt-24">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-6">
                <aside className="lg:col-span-3 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-white/10 bg-[#152031]/70 p-6"
                    >
                        <p className="text-xs uppercase tracking-[0.26em] text-teal-300/80 mb-3">Workspace</p>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-amber-300 to-teal-300 bg-clip-text text-transparent">
                            Problems
                        </h1>
                        <p className="text-slate-300/80 text-sm mt-3">Master your coding skills with our curated problem set.</p>
                    </motion.div>

                    <div className="rounded-2xl border border-white/10 bg-[#121d2b]/75 p-5 space-y-4">
                        <MetricCard label="Available" value={filteredProblems.length} tone="text-amber-300" />
                        <MetricCard label="Solved" value={solvedCount} tone="text-emerald-300" />
                        <MetricCard label="In Progress" value={Math.max(filteredProblems.length - solvedCount, 0)} tone="text-cyan-300" />
                    </div>
                </aside>

                <section className="lg:col-span-9 space-y-6">
                    <div className="sticky top-4 z-30 rounded-2xl border border-white/10 bg-[#101a28]/90 p-3 backdrop-blur-xl">
                        <FiltersBar
                            status={filterStatus} setStatus={setFilterStatus}
                            difficulty={filterDifficulty} setDifficulty={setFilterDifficulty}
                            tag={selectedTag} setTag={setSelectedTag}
                        />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#101826]/65 p-2 md:p-4">
                        <ProblemsTable problems={filteredProblems} />
                    </div>
                </section>
            </div>
        </div>
    );
};

function MetricCard({ label, value, tone }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/3 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</p>
            <p className={`text-2xl font-bold ${tone}`}>{value}</p>
        </div>
    );
}

export default Problems;