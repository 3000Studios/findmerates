import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { SavedSearch, RateAlert } from '../types';
import { Search, Bell, Settings, Trash2, ExternalLink, Plus, TrendingDown, TrendingUp, Star } from 'lucide-react';
import { formatPercent, cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [alerts, setAlerts] = useState<RateAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const searchesQuery = query(
      collection(db, `users/${user.uid}/savedSearches`),
      orderBy('createdAt', 'desc')
    );

    const alertsQuery = query(
      collection(db, `users/${user.uid}/rateAlerts`),
      orderBy('createdAt', 'desc')
    );

    const unsubSearches = onSnapshot(searchesQuery, (snapshot) => {
      setSavedSearches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedSearch)));
    });

    const unsubAlerts = onSnapshot(alertsQuery, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RateAlert)));
      setLoading(false);
    });

    return () => {
      unsubSearches();
      unsubAlerts();
    };
  }, []);

  const removeSavedSearch = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/savedSearches`, id));
    } catch (err) {
      console.error('Failed to remove saved search', err);
    }
  };

  const removeAlert = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/rateAlerts`, id));
    } catch (err) {
      console.error('Failed to remove alert', err);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading your dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-display font-bold text-slate-900">User Dashboard</h1>
        <Link to="/signup" className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
          <Settings className="w-4 h-4 mr-2" /> Account
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Saved Searches */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-brand-600" /> Saved Searches
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedSearches.length > 0 ? savedSearches.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-600 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">{s.category}</span>
                    <button
                      onClick={() => removeSavedSearch(s.id)}
                      aria-label="Delete saved search"
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-4">{s.query}</h3>
                  <Link
                    to={`/rates/${s.category}${s.query ? `?q=${encodeURIComponent(s.query)}` : ''}`}
                    className="w-full py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold group-hover:bg-brand-600 group-hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    View Rates <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )) : (
                <div className="col-span-2 py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                  <p className="text-slate-400">No saved searches yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Rate Alerts */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-600" /> Active Alerts
              </h2>
              <Link to="/pro" className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Create Alert
              </Link>
            </div>
            <div className="space-y-4">
              {alerts.length > 0 ? alerts.map(a => (
                <div key={a.id} className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      a.condition === 'less_than' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {a.condition === 'less_than' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 capitalize">{a.category.replace('_', ' ')}</h3>
                      <p className="text-sm text-slate-500">Alert when rate is {a.condition.replace('_', ' ')} {formatPercent(a.targetRate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-400">Status:</span>
                      <span className={cn("text-xs font-bold uppercase", a.isActive ? "text-emerald-600" : "text-slate-400")}>
                        {a.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAlert(a.id)}
                      aria-label="Delete alert"
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                  <p className="text-slate-400">No active alerts. Set one up to stay informed.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-brand-900 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-display font-bold mb-4">Pro Status</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="font-bold">Active Member</p>
                <p className="text-xs text-brand-300">Renews Oct 2026</p>
              </div>
            </div>
            <Link to="/guide" className="w-full py-3 bg-white text-brand-900 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-50 transition-colors">
              Access Pro Guide <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="ad-slot">Advertisement - Dashboard</div>
        </div>
      </div>
    </div>
  );
}
