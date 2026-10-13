import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Tractor, 
  Droplets, 
  Truck, 
  Sprout, 
  FlaskConical, 
  Plane, 
  Wheat, 
  Warehouse, 
  Check, 
  ArrowRight,
  Clock,
  Tag,
  Loader2,
  Sparkles
} from 'lucide-react';

export const CatalogPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await apiClient.get('/catalog/categories');
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedCategory(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Tractor': return Tractor;
      case 'Droplets': return Droplets;
      case 'Truck': return Truck;
      case 'Sprout': return Sprout;
      case 'FlaskConical': return FlaskConical;
      case 'Plane': return Plane;
      case 'Wheat': return Wheat;
      case 'Warehouse': return Warehouse;
      default: return Sprout;
    }
  };

  const currentCategoryData = categories.find((c) => c.id === selectedCategory);
  
  // Filter items across all categories or current category
  const allItems = categories.flatMap(c => (c.items || []).map(i => ({ ...i, categoryName: c.name })));
  
  const displayedItems = searchQuery.trim() !== ''
    ? allItems.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : (currentCategoryData?.items || []);

  const handleBook = (item) => {
    if (!user) {
      navigate('/login?redirect=/farmer/book?itemId=' + item.id);
    } else {
      navigate(`/farmer/book?itemId=${item.id}&categoryId=${item.categoryId || currentCategoryData?.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-farm-900 via-emerald-800 to-slate-900 rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Transparent Agricultural Service Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
            Explore Farm Services & Standardized Rates
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Book certified machinery, drone pilots, soil testing agronomists, and logistics teams with direct digital tracking and transparent unit pricing.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services (e.g. Tractor, Drone Spray, Soil Test, Mandi Truck)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-medium placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-farm-600 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading agricultural services catalog...</span>
        </div>
      ) : (
        <div>
          {/* Categories Horizontal Tabs */}
          {searchQuery.trim() === '' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap shrink-0 border ${
                      isSelected
                        ? 'bg-farm-600 text-white border-farm-600 shadow-md shadow-farm-600/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-farm-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-farm-600'}`} />
                    <span>{cat.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {cat.items?.length || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Current Category Info Banner */}
          {searchQuery.trim() === '' && currentCategoryData && (
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-farm-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                {React.createElement(getCategoryIcon(currentCategoryData.icon), { className: 'w-5 h-5' })}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{currentCategoryData.name}</h3>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{currentCategoryData.description}</p>
              </div>
            </div>
          )}

          {/* Items Grid */}
          {displayedItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 text-sm">No services found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-farm-400 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Item Image */}
                    {item.imageUrl && (
                      <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                          ₹{item.basePrice} <span className="text-slate-300 font-normal">{item.unitLabel}</span>
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      {item.categoryName && searchQuery.trim() !== '' && (
                        <span className="text-[10px] font-bold text-farm-600 uppercase tracking-wider block mb-1">
                          {item.categoryName}
                        </span>
                      )}

                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-farm-700 transition line-clamp-1">
                        {item.name}
                      </h4>

                      <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-farm-600" />
                          {item.unitType?.replace('_', ' ')}
                        </span>
                        {item.estimatedDurationHours && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-farm-600" />
                            ~{item.estimatedDurationHours} hrs duration
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleBook(item)}
                      className="w-full py-2.5 px-4 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 group-hover:shadow-farm-600/20"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
