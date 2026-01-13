/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Briefcase,
    MessageSquare,
    DollarSign,
    Plus,
    TrendingUp,
    Clock,
    CheckCircle,
} from "lucide-react";
import { Layout } from '../components/layout/layout';


export default function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [gigs, setGigs] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔐 Load everything
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [userRes, gigsRes, bidsRes] = await Promise.all([
                    fetch("http://localhost:3000/api/auth/me", { credentials: "include" }),
                    fetch("http://localhost:3000/api/gigs/mygig", { credentials: "include" }),
                    fetch("http://localhost:3000/api/bids/mybid", { credentials: "include" }),
                ]);

                if (!userRes.ok) {
                    navigate("/login");
                    return;
                }

                const userData = await userRes.json();
                const gigsData = await gigsRes.json();
                const bidsData = await bidsRes.json();

                setUser(userData.user);
                setGigs(Array.isArray(gigsData) ? gigsData : []);
                setBids(Array.isArray(bidsData) ? bidsData : []);
            } catch (err) {
                console.error("Dashboard load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [navigate]);

    // 🧮 Stats Logic
    const myGigs = gigs;
    const pendingBids = bids.filter(b => b.status === "pending");
    const hiredBids = bids.filter(b => b.status === "hired");

    // Helper to find gig title
    const getGigTitle = (bid) => {
        if (!bid?.gigId) return "Unknown Gig";
        if (typeof bid.gigId === "object") {
            return bid.gigId.title;
        }
        const gig = gigs.find(g => g._id === bid.gigId);
        return gig ? gig.title : "Unknown Gig";
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900"></div>
            </div>
        );
    }

    const stats = [
        {
            title: "Active Gigs",
            value: myGigs.filter(g => g.status === "open").length,
            icon: Briefcase,
            bg: "bg-cyan-100",
            color: "text-cyan-600"
        },
        {
            title: "Pending Bids",
            value: pendingBids.length,
            icon: Clock,
            bg: "bg-orange-100",
            color: "text-orange-600"
        },
        {
            title: "Jobs Won",
            value: hiredBids.length,
            icon: CheckCircle,
            bg: "bg-green-100",
            color: "text-green-600"
        },
        {
            title: "Total Earnings",
            value: "₹" + hiredBids.reduce((s, b) => s + b.price, 0).toLocaleString(),
            icon: DollarSign,
            bg: "bg-indigo-100",
            color: "text-indigo-600"
        },
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-white text-slate-800 font-sans">
                <div className="max-w-7xl mx-auto px-6 py-10">

                    {/* Header / Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-4xl font-bold mb-2 text-slate-900 flex items-center gap-3">
                            Welcome back, {user?.name?.split(" ")[0]}! <span className="text-4xl">👋</span>
                        </h1>
                        <p className="text-slate-500 text-lg">Here’s an overview of your activity on GigFlow.</p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.title}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-slate-500 font-medium mb-1">{s.title}</p>
                                        <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${s.bg}`}>
                                        <s.icon className={`w-6 h-6 ${s.color}`} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Action Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        {/* Post Gig Card */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex justify-between items-center relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2 text-slate-900">Post a New Gig</h3>
                                <p className="text-slate-500 mb-6 max-w-xs">Need something done? Post a gig and receive bids from talented freelancers.</p>
                                <Link
                                    to="/gigs/new"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-900 text-white rounded-xl font-medium hover:bg-indigo-800 transition-colors"
                                >
                                    <Plus size={18} /> Create Gig
                                </Link>
                            </div>
                            <div className="p-4 bg-cyan-50 rounded-2xl">
                                <Briefcase size={40} className="text-cyan-600" />
                            </div>
                        </div>

                        {/* Find Work Card */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2 text-slate-900">Find Work</h3>
                                <p className="text-slate-500 mb-6 max-w-xs">Browse open gigs and submit proposals to start earning.</p>
                                <Link
                                    to="/gigs"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors bg-white"
                                >
                                    <TrendingUp size={18} /> Browse Gigs
                                </Link>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-2xl">
                                <MessageSquare size={40} className="text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    {/* Lists Section */}
                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* Recent Bids List Container */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <MessageSquare className="text-cyan-600" size={24} />
                                <h3 className="text-xl font-bold text-slate-900">My Recent Bids</h3>
                            </div>

                            {bids.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-slate-400">You haven't placed any bids yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bids.slice(0, 3).map(b => (
                                        <Link
                                            key={b._id}
                                            to={`/gig/${typeof b.gigId === 'object' ? b.gigId._id : b.gigId}`}
                                            className="flex justify-between items-center p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                                        >
                                            <div>
                                                <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                                    {getGigTitle(b)}
                                                </p>
                                                <p className="text-sm text-slate-500 mt-1">Your bid: ₹{b.price}</p>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                                                ${b.status === 'hired' ? 'bg-green-100 text-green-700' :
                                                    b.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'}`}>
                                                {b.status}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Posted Gigs List Container */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <Briefcase className="text-indigo-600" size={24} />
                                <h3 className="text-xl font-bold text-slate-900">My Posted Gigs</h3>
                            </div>

                            {myGigs.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-slate-400">You haven't posted any gigs yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myGigs.slice(0, 3).map(g => (
                                        <Link
                                            key={g._id}
                                            to={`/gigs/${g._id}`}
                                            className="flex justify-between items-center p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                                        >
                                            <div>
                                                <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                                    {g.title}
                                                </p>
                                                <div className="flex gap-3 text-sm text-slate-500 mt-1">
                                                   
                                                    <span>₹{g.budget}</span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                                                ${g.status === 'assigned' ? 'bg-green-100 text-green-700' :
                                                    'bg-slate-200 text-slate-700'}`}>
                                                {g.status === 'open' ? 'Open' : 'Assigned'}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}