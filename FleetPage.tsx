import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  User,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { CarCard } from './CarCard';

interface FleetPageProps {
  fleet: any[];
  onBook: (car: any) => void;
  onBack: () => void;
  user?: any;
  onLogout?: () => void;
}

export const FleetPage: React.FC<FleetPageProps> = ({ fleet, onBook, onBack, user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Luxury', 'SUV', 'Electric', 'Sports', 'Performance'];

  const filteredFleet = fleet.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         car.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || car.type.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 cursor-pointer hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold hidden sm:inline">Back to Home</span>
            </div>

            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by model or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
              
              {user && (
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-100">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.role}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Explore Our Vehicles</h1>
            <p className="text-slate-500 font-medium">Find the perfect vehicle for your next journey</p>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 mr-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">Filter</span>
            </div>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                    : 'bg-white text-slate-600 border border-slate-100 hover:border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Showing {filteredFleet.length} Results
          </p>
        </div>

        {/* Grid/List View */}
        {filteredFleet.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {filteredFleet.map((car) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={car.id}
              >
                <CarCard {...car} onBook={onBook} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No vehicles found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-8 text-indigo-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
