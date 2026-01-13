import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Clock, MessageSquare, UserCircle } from 'lucide-react';
import { Layout } from '../components/layout/layout';
import api from '../api/axios';
import { formatDistanceToNow } from 'date-fns';

const BrowseGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const delay = setTimeout(() => {
      fetchGigs(isMounted);
    }, 400); // debounce

    return () => {
      isMounted = false;
      clearTimeout(delay);
    };
  }, [searchTerm]);

  const fetchGigs = async (isMounted) => {
    try {
      setLoading(true);

      const endpoint = searchTerm
        ? `/gigs?q=${encodeURIComponent(searchTerm)}`
        : "/gigs";

      const { data } = await api.get(endpoint);

      if (isMounted) {
        setGigs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch gigs:", error);
      if (isMounted) setGigs([]);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Browse Gigs</h1>
            <p className="text-gray-500 mt-2 text-lg">Find the perfect project that matches your skills</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search gigs by title..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button className="inline-flex items-center px-4 py-3 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                All Status
              </button>
              <button className="inline-flex items-center px-4 py-3 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
                <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-500" />
                Newest First
              </button>
            </div>
          </div>

          <div className="mb-6">
             <p className="text-sm text-gray-500">Showing {gigs.length} gigs</p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-64 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                  <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
                </div>
              ))}
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
               <div className="mx-auto h-12 w-12 text-gray-400">
                 <Search className="h-full w-full" />
               </div>
               <h3 className="mt-2 text-sm font-medium text-gray-900">No gigs found</h3>
               <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                /* The Link component below handles the click.
                   It points to /gig/:id which will load the GigDetail page.
                */
                <Link to={`/gig/${gig._id}`} key={gig._id} className="block group h-full">
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 h-full flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {gig.title}
                      </h3>
                      <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gig.status === 'open' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-800'}`}>
                        {gig.status === 'open' ? 'Open' : 'Assigned'}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span>
                        {gig.createdAt ? formatDistanceToNow(new Date(gig.createdAt), { addSuffix: true }) : 'Recently'}
                      </span>
                    </div>

                    {/* Body */}
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                      {gig.description}
                    </p>

                    <div className="border-t border-gray-100 my-4"></div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                           {gig.ownerId?.name ? gig.ownerId.name.charAt(0).toUpperCase() : <UserCircle className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                          {gig.ownerId?.name || "Unknown"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className="flex items-center text-gray-400 text-xs" title="Bids">
                            <MessageSquare className="w-3.5 h-3.5 mr-1" />
                            <span>-</span> 
                         </div>

                         <div className="flex items-center text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-lg">
                            <span className="text-green-600 mr-1">$</span>
                            {gig.budget.toLocaleString()}
                         </div>
                      </div>
                    </div>

                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BrowseGigs;