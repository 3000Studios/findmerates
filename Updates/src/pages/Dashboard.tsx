import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { SavedSearch, RateAlert } from '../types';
import { Search, Bell, Settings, Trash2, ExternalLink, Plus, TrendingDown, TrendingUp, Star } from 'lucide-react';
import { formatPercent, cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Synchronizing Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter text-metallic-3d">Intelligence Dashboard</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your financial alerts and saved insights.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-6 py-3 bg-white/5 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs border border-white/10"
        >
          <Settings className="w-4 h-4 mr-3" /> Settings
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {/* Saved Searches */}
          <section>
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <h2 className="text-2xl font-display font-black text-white flex items-center gap-4 uppercase tracking-tight">
                <Search className="w-6 h-6 text-accent-gold" /> Saved Searches
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedSearches.length > 0 ? savedSearches.map((s, i) => (
                <motion.div 
                  key={s.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-accent-gold/30 transition-all group shadow-xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-accent-gold/20">{s.category}</span>
                    <button className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <h3 className="text-xl font-display font-black text-white mb-8 uppercase tracking-tight">{s.query}</h3>
                  <button className="btn-3d btn-3d-gold w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    View Rates <ExternalLink className="w-4 h-4" />
                  </button>
                </motion.div>
              )) : (
                <div className="col-span-2 py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center">
                  <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No saved searches available.</p>
                </div>
              )}
            </div>
          </section>

          {/* Rate Alerts */}
          <section>
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <h2 className="text-2xl font-display font-black text-white flex items-center gap-4 uppercase tracking-tight">
                <Bell className="w-6 h-6 text-accent-gold" /> Active Alerts
              </h2>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="text-xs font-black text-accent-gold hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors"
              >
                <Plus className="w-5 h-5" /> Create Alert
              </motion.button>
            </div>
            <div className="space-y-6">
              {alerts.length > 0 ? alerts.map((a, i) => (
                <motion.div 
                  key={a.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                      a.condition === 'less_than' ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"
                    )}>
                      {a.condition === 'less_than' ? <TrendingDown className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-black text-white capitalize tracking-tight">{a.category.replace('_', ' ')}</h3>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2">Alert when rate is {a.condition.replace('_', ' ')} {formatPercent(a.targetRate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status:</span>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border", a.isActive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-slate-600 border-white/5 bg-white/5")}>
                        {a.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <button className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </motion.div>
              )) : (
                <div className="py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center">
                  <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No active alerts. Set one up to stay informed.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-12">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900 rounded-[2.5rem] p-10 text-white border border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 blur-3xl rounded-full" />
            <h3 className="text-2xl font-display font-black mb-8 uppercase tracking-tight">Pro Status</h3>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-accent-gold rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-slate-950 fill-current" />
              </div>
              <div>
                <p className="text-xl font-black uppercase tracking-tight">Active Member</p>
                <p className="text-[10px] font-black text-accent-gold uppercase tracking-[0.2em] mt-1">Renews Oct 2026</p>
              </div>
            </div>
            <Link to="/guide" className="btn-3d btn-3d-gold w-full py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs">
              Access Pro Guide <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="ad-slot">Advertisement - Dashboard</div>
        </div>
      </div>
    </div>
  );
}
