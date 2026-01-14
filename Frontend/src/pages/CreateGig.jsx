/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Send, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Layout } from '../components/layout/layout'; // Check this path matches your file structure

const API_URL = import.meta.env.VITE_API_URL;

const CreateGig = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.title || !formData.description || !formData.budget) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // The backend expects { title, description, budget }
      // The cookie is sent automatically by 'api' if withCredentials is true
      const response = await api.post("/gigs", {
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget) // Ensure budget is sent as a number
      });

      if (response.status === 201) {
        toast.success('Gig posted successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Create Gig Error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to post gig';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              {/* Header Section */}
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <Briefcase className="w-8 h-8 text-cyan-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Post a New Gig</h1>
                  <p className="text-gray-500 mt-1">Describe your project and set a budget to attract freelancers</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Gig Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                    Gig Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Build a React Dashboard with Analytics"
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500">
                    Be specific. A clear title attracts the right freelancers.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project in detail. Include requirements, deliverables, timeline, and any relevant skills needed..."
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    The more detail you provide, the better proposals you'll receive.
                  </p>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-900">
                    Budget (USD)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="1500"
                      min="1"
                      className="block w-full rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Set a fair budget. Freelancers can propose their own rates.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all w-full sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 text-sm font-medium text-white bg-indigo-900 rounded-xl hover:bg-indigo-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-indigo-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Gig
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateGig;