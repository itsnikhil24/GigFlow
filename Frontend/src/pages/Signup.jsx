/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // --- Logic Preserved Exactly as Requested ---
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            })

            let data = {}
            const text = await res.text()
            if (text) data = JSON.parse(text)

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed')
            }

            // redirect to login after signup
            navigate('/login')

        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900">
            {/* Left Panel - Decorative */}
            {/* FIXED GRADIENT HERE */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden bg-indigo-600">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-700 opacity-90"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-md text-center text-white"
                >
                    <h2 className="text-4xl font-bold mb-6 tracking-tight">
                        Start Your Freelance Journey Today
                    </h2>
                    <p className="text-indigo-100 text-lg leading-relaxed">
                        Whether you want to hire top talent or find exciting projects,
                        GigFlow makes it simple.
                    </p>
                </motion.div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white transition-transform group-hover:scale-110">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            Gig<span className="text-indigo-600">Flow</span>
                        </span>
                    </Link>

                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create an account</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Join GigFlow and start your journey today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ... Inputs ... */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200" />
                                </div>
                                <p className="text-[0.8rem] text-gray-500">Must be at least 8 characters</p>
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </motion.div>
                        )}

                        <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 w-full shadow-sm">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>) : (<>Create Account<ArrowRight className="ml-2 h-4 w-4" /></>)}
                        </button>

                        <div className="text-center text-sm">
                            <span className="text-gray-500">Already have an account? </span>
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}