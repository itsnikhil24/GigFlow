/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, UserCircle, Send, X,
  CheckCircle, Briefcase, MessageSquare, AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

import api from '../api/axios';
import { Layout } from '../components/layout/layout';
import { useAuth } from '../context/AuthContext';

export default function GigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]); // Owner: all bids
  const [myBid, setMyBid] = useState(null); // Freelancer: my bid
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showBidModal, setShowBidModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedBidToHire, setSelectedBidToHire] = useState(null);

  // Form & Action States
  const [bidForm, setBidForm] = useState({ price: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: gigData } = await api.get(`/gigs/${id}`);
        setGig(gigData);

        if (!user) return;

        const isOwner = gigData.ownerId._id === user.id;

        if (isOwner) {
          // OWNER → all bids
          const { data } = await api.get(`/bids/${id}`);
          setBids(data);
        } else {
          // FREELANCER → only my bid
          const { data } = await api.get(`/bids/mybid`);
          const foundBid = data.find(b =>
            (typeof b.gigId === "object" ? b.gigId._id : b.gigId) === id
          );
          setMyBid(foundBid || null);
        }

      } catch (err) {
        toast.error("Failed to load gig details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id && user) fetchData();
  }, [id, user]);


  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/bids', {
        gigId: id,
        price: Number(bidForm.price),
        message: bidForm.message
      });

      setMyBid(data.bid);
      setShowBidModal(false);
      toast.success("Bid placed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place bid");
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Open the confirmation modal
  const handleHireClick = (bidId) => {
    setSelectedBidToHire(bidId);
    setShowHireModal(true);
  };

  // 2. Actually execute the hire logic
  const confirmHire = async () => {
    if (!selectedBidToHire) return;

    setHiring(true);

    try {
      await api.patch(`/bids/${selectedBidToHire}/hire`);

      setGig(prev => ({ ...prev, status: 'assigned' }));

      setBids(prev =>
        prev.map(b =>
          b._id === selectedBidToHire
            ? { ...b, status: 'hired' }
            : { ...b, status: 'rejected' }
        )
      );

      toast.success("Freelancer hired successfully!");
      setShowHireModal(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to hire freelancer");
    } finally {
      setHiring(false);
      setSelectedBidToHire(null);
    }
  };


  if (loading) return (
    <Layout>
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900"></div>
      </div>
    </Layout>
  );

  if (!gig) return <Layout><div className="p-10 text-center">Gig not found</div></Layout>;

  const isOwner = user?.id === gig.ownerId._id;
  const isOpen = gig.status === 'open';
  const bidsCount = isOwner ? bids.length : (gig.bids?.length || 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN: Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Gig Details Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mb-4">
                      {isOpen ? 'Open for Bids' : 'Applications Closed'}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{gig.title}</h1>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <UserCircle className="text-orange-500 w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{gig.ownerId.name}</p>
                        <p className="text-xs text-gray-500">Client</p>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {gig.createdAt && formatDistanceToNow(new Date(gig.createdAt), { addSuffix: true })}
                  </span>
                </div>

                <div className="border-t border-gray-100 my-6"></div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Project Description</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {gig.description}
                  </p>
                </div>
              </div>

              {/* BIDS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Bids ({bidsCount})
                  </h3>
                </div>

                {/* SCENARIO 1: OWNER VIEW - LIST BIDS */}
                {isOwner && (
                  <>
                    {bids.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">No bids yet</h3>
                        <p className="text-gray-500 text-sm">Wait for freelancers to submit proposals.</p>
                      </div>
                    ) : (
                      bids.map(bid => (
                        <div key={bid._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                <span className="font-bold text-indigo-600">{bid.freelancerId.name[0]}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{bid.freelancerId.name}</h4>
                                <p className="text-xs text-gray-500 mb-2">
                                  {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
                                </p>
                                <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-3 rounded-lg">
                                  "{bid.message}"
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900 mb-3">
                                ${bid.price.toLocaleString()}
                              </div>
                              {bid.status === 'pending' && isOpen && (
                                <button
                                  onClick={() => handleHireClick(bid._id)} // Changed handler here
                                  className="px-4 py-2 bg-indigo-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors"
                                >

                                  Hire This Freelancer
                                </button>
                              )}
                              {bid.status === 'hired' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                  <CheckCircle className="w-4 h-4 mr-1" /> Hired
                                </span>
                              )}
                              {bid.status === 'rejected' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-600">
                                  Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {/* SCENARIO 2: FREELANCER - NOT BIDDED YET */}
                {!isOwner && !myBid && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">No bids yet</h3>
                    <p className="text-gray-500 text-sm">Be the first to submit a proposal!</p>
                  </div>
                )}

                {/* SCENARIO 3: FREELANCER - ALREADY BIDDED */}
                {!isOwner && myBid && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Bid Submitted</h3>
                        <p className="text-gray-500">You submitted a bid of <b>${myBid.price}</b> for this gig.</p>
                      </div>
                      <div className="ml-auto">
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold capitalize
                                 ${myBid.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            myBid.status === 'hired' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          Status: {myBid.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Budget</p>
                  <p className="text-4xl font-bold text-gray-900">${gig.budget.toLocaleString()}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Posted</span>
                    <span className="font-medium text-gray-900">
                      {new Date(gig.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium capitalize ${isOpen ? 'text-green-600' : 'text-gray-500'}`}>
                      {isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>

                {/* FREELANCER ACTION BUTTON */}
                {!isOwner && !myBid && isOpen && (
                  <div>
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mb-6">
                      Interested in this project?
                    </p>
                    <button
                      onClick={() => setShowBidModal(true)}
                      className="w-full py-3 bg-indigo-900 text-white rounded-xl font-bold hover:bg-indigo-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit a Bid
                    </button>
                  </div>
                )}

                {isOwner && (
                  <div className="text-center text-sm text-gray-500 py-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    You are the owner of this gig.
                  </div>
                )}

                {!isOpen && !isOwner && (
                  <div className="text-center py-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 font-medium">This gig is closed.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* --- MODAL: Submit Bid --- */}
        <AnimatePresence>
          {showBidModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Submit Your Bid</h3>
                  <button onClick={() => setShowBidModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handlePlaceBid} className="p-6 space-y-6">
                  {/* ... Form Content ... */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Your Price</label>
                      <span className="text-xs text-gray-500">Client's Budget: ${gig.budget}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        required
                        min="1"
                        value={bidForm.price}
                        onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
                        className="block w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Introduce yourself and explain why you're the perfect fit..."
                      value={bidForm.message}
                      onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                      className="block w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBidModal(false)}
                      className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 bg-indigo-900 text-white font-bold rounded-xl hover:bg-indigo-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {submitting ? 'Sending...' : <><Send className="w-4 h-4" /> Submit Bid</>}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL: Confirm Hire --- */}
        <AnimatePresence>
          {showHireModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hire this Freelancer?</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    This will mark the gig as <b>Assigned</b> and reject all other pending bids.
                    <br />This action cannot be undone.
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowHireModal(false)}
                      className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmHire}
                      disabled={hiring}
                      className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-70"
                    >
                      {hiring ? 'Processing...' : 'Confirm Hire'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}