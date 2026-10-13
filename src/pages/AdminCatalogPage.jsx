import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { 
  Grid, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Tag, 
  Check, 
  X, 
  Loader2, 
  Sparkles,
  Tractor
} from 'lucide-react';

export const AdminCatalogPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [itemForm, setItemForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    basePrice: '',
    unitType: 'PER_ACRE',
    unitLabel: 'per Acre',
    imageUrl: '',
    isAvailable: true,
    estimatedDurationHours: 4
  });
  const [saving, setSaving] = useState(false);

  const loadCatalog = async () => {
    try {
      const res = await apiClient.get('/catalog/categories/all');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const openNewItemModal = (catId) => {
    setIsNewItem(true);
    setEditingItem(null);
    setItemForm({
      categoryId: catId || (categories[0]?.id || ''),
      name: '',
      description: '',
      basePrice: '',
      unitType: 'PER_ACRE',
      unitLabel: 'per Acre',
      imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&auto=format&fit=crop&q=60',
      isAvailable: true,
      estimatedDurationHours: 4
    });
  };

  const openEditItemModal = (item) => {
    setIsNewItem(false);
    setEditingItem(item);
    setItemForm({
      categoryId: item.categoryId,
      name: item.name,
      description: item.description,
      basePrice: item.basePrice,
      unitType: item.unitType,
      unitLabel: item.unitLabel,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable,
      estimatedDurationHours: item.estimatedDurationHours || 4
    });
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...itemForm,
        categoryId: Number(itemForm.categoryId),
        basePrice: Number(itemForm.basePrice),
        estimatedDurationHours: Number(itemForm.estimatedDurationHours)
      };

      if (isNewItem) {
        await apiClient.post('/catalog/items', payload);
      } else {
        await apiClient.put(`/catalog/items/${editingItem.id}`, payload);
      }
      setEditingItem(null);
      setIsNewItem(false);
      loadCatalog();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service item?')) return;
    try {
      await apiClient.delete(`/catalog/items/${id}`);
      loadCatalog();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete item');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Agricultural Catalog & Standard Rates</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure approved machinery categories, equipment specs, unit definitions, and baseline tariff rates
          </p>
        </div>

        <button
          onClick={() => openNewItemModal()}
          className="px-5 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-center shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" /> Add New Service Item
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-farm-600 animate-spin" />
          <span className="text-xs text-slate-500">Loading catalog management...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                      {cat.code}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{cat.description}</p>
                </div>

                <button
                  onClick={() => openNewItemModal(cat.id)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-farm-600" />
                  Add to Category
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {(!cat.items || cat.items.length === 0) ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No service items defined under this category yet.
                  </div>
                ) : (
                  cat.items.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3.5">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {item.isAvailable ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{item.description}</p>
                          <div className="text-slate-400 text-[10px] mt-1 flex items-center gap-3">
                            <span>Unit: <strong>{item.unitType}</strong></span>
                            <span>Est: <strong>{item.estimatedDurationHours} hrs</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                        <div className="text-right">
                          <span className="font-black text-sm text-farm-800 block">₹{item.basePrice}</span>
                          <span className="text-[10px] text-slate-400">{item.unitLabel}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditItemModal(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Edit Item"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Create / Edit Modal */}
      {(isNewItem || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-farm-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                {isNewItem ? 'Add New Agricultural Service Item' : `Edit: ${editingItem.name}`}
              </h3>
              <button onClick={() => { setIsNewItem(false); setEditingItem(null); }} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 text-xs text-slate-700 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Service Category</label>
                  <select
                    required
                    value={itemForm.categoryId}
                    onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-farm-500 font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Service Title / Machinery</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 55HP Tractor Deep Ploughing"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description & Specifications</label>
                <textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-farm-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    step="10"
                    value={itemForm.basePrice}
                    onChange={(e) => setItemForm({ ...itemForm, basePrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-farm-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Unit Model</label>
                  <select
                    value={itemForm.unitType}
                    onChange={(e) => setItemForm({ ...itemForm, unitType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-farm-500"
                  >
                    <option value="PER_ACRE">PER_ACRE</option>
                    <option value="PER_HOUR">PER_HOUR</option>
                    <option value="PER_DAY">PER_DAY</option>
                    <option value="PER_KG">PER_KG</option>
                    <option value="PER_TON">PER_TON</option>
                    <option value="PER_VISIT">PER_VISIT</option>
                    <option value="FIXED">FIXED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Unit Label</label>
                  <input
                    type="text"
                    required
                    placeholder="per Acre"
                    value={itemForm.unitLabel}
                    onChange={(e) => setItemForm({ ...itemForm, unitLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Image URL</label>
                <input
                  type="url"
                  value={itemForm.imageUrl}
                  onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-farm-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={itemForm.isAvailable}
                  onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                  className="rounded text-farm-600 focus:ring-farm-500"
                />
                <label htmlFor="availCheck" className="font-semibold text-slate-700">
                  Service item is actively available for farmer booking
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsNewItem(false); setEditingItem(null); }}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Service Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
