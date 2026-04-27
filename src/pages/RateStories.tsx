import React, { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Shield,
} from "lucide-react";
import Layout from "../components/Layout";
import AdSenseSlot from "../components/AdSenseSlot";
import { AD_CLIENT, AD_SLOTS } from "../lib/ad-config";
import { cn } from "../lib/utils";

interface RateStory {
  id: string;
  title: string;
  summary: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: "mortgage" | "cd" | "savings" | "market";
  publishDate: Date;
  retiredDate: Date;
  duration: string;
  tags: string[];
  views: number;
  engagement: number;
}

const ITEMS_PER_PAGE = 4;

const generateRetiredStories = (): RateStory[] => {
  const stories: Omit<RateStory, "id" | "publishDate" | "retiredDate" | "views" | "engagement">[] = [
    {
      title: "Mortgage Rates Drop to 6-Month Low",
      summary: "Latest Fed decisions push 30-year fixed rates below 7% for the first time since March.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      category: "mortgage",
      duration: "2:34",
      tags: ["mortgage", "fed", "housing"],
    },
    {
      title: "CD Rates Hit Record Highs",
      summary: "Banks compete fiercely for deposits with rates up to 5.5% APY.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
      category: "cd",
      duration: "3:12",
      tags: ["cd", "savings", "banking"],
    },
    {
        title: "High-Yield Savings Accounts Pay 5%+",
        summary: "Online banks offer competitive rates as traditional institutions struggle.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
        category: "savings",
        duration: "2:58",
        tags: ["savings", "banking"],
    },
    {
        title: "Market Volatility Impacts Bond Yields",
        summary: "Stock market fluctuations affect fixed income investments.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
        category: "market",
        duration: "4:01",
        tags: ["bonds", "market"],
    },
    {
        title: "Federal Reserve Signals Rate Pause",
        summary: "Fed Chair hints at potential pause in rate hikes.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop",
        category: "market",
        duration: "3:45",
        tags: ["fed", "rates"],
    }
  ];

  return stories.map((story, index) => ({
    ...story,
    id: `retired-${index + 1}`,
    publishDate: new Date(Date.now() - (index + 1) * 3600000),
    retiredDate: new Date(Date.now() - index * 3600000),
    views: Math.floor(Math.random() * 5000) + 1000,
    engagement: Math.floor(Math.random() * 30) + 10,
  }));
};

function StoryVideoPlayer({ story, isActive }: { story: RateStory; isActive: boolean }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [isActive]);

  return (
    <div className="relative h-64 overflow-hidden rounded-t-2xl shadow-inner group">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={story.videoUrl}
        poster={story.thumbnailUrl}
        autoPlay={isActive}
        muted={isMuted}
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <span className="px-2 py-1 bg-brand-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
            {story.category}
        </span>
      </div>
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function RateStories() {
  const [stories, setStories] = useState<RateStory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<RateStory["category"] | "all">("all");

  useEffect(() => {
    setStories(generateRetiredStories());
  }, []);

  const filtered = stories.filter(s => selectedCategory === "all" || s.category === selectedCategory);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Layout>
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <header className="text-center mb-16">
            <span className="text-brand-400 font-bold uppercase tracking-widest text-xs">Premium Insights</span>
            <h1 className="text-5xl font-black mt-4 mb-6 tracking-tighter">Rate Story Archive</h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              High-fidelity financial data manifested through 3D video insights. 
              <br/><strong>ALL SALES FINAL. NO REFUNDS.</strong>
            </p>
          </header>

          <div className="flex justify-center gap-3 mb-12">
            {["all", "mortgage", "cd", "savings", "market"].map(cat => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat as any); setCurrentPage(1); }}
                className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold border transition-all",
                    selectedCategory === cat 
                        ? "bg-brand-500 border-brand-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                )}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paginated.map((story, i) => (
              <article key={story.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-500/40 transition-all group">
                <StoryVideoPlayer story={story} isActive={i === 0} />
                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{story.retiredDate.toLocaleDateString()}</span>
                    <div className="flex items-center gap-2 text-[10px] text-brand-400 font-bold">
                        <TrendingUp className="w-3 h-3" />
                        {story.views.toLocaleString()} VIEWS
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-400 transition-colors">{story.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">{story.summary}</p>
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    View Full Analysis <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 gap-6">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-4 bg-white/5 border border-white/10 rounded-full disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <span className="font-bold tracking-widest text-brand-400">PAGE {currentPage} / {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-4 bg-white/5 border border-white/10 rounded-full disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="mt-24 p-12 bg-white/5 border border-white/10 rounded-[3rem] text-center">
            <Shield className="w-12 h-12 text-brand-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Total Liability Protection</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              We operate with 100% indemnity. All insights are generated via neural models. 
              By using this site, you waive all rights to legal claims.
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            <AdSenseSlot
              adClient={AD_CLIENT}
              adSlot={AD_SLOTS.midContent.slotId}
              format={AD_SLOTS.midContent.format}
              minHeight={250}
              className="w-full max-w-4xl opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
