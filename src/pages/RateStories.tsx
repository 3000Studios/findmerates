import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Clock, ArrowRight, Play, Volume2, VolumeX } from 'lucide-react';
import Layout from '../components/Layout';
import AdSenseSlot from '../components/AdSenseSlot';
import { AD_CLIENT, AD_SLOTS } from '../lib/ad-config';
import { cn } from '../lib/utils';

// Rate Story interface - stories that have been retired from home page
interface RateStory {
  id: string;
  title: string;
  summary: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: 'mortgage' | 'cd' | 'savings' | 'market';
  publishDate: Date;
  retiredDate: Date; // When it was moved from home page
  duration: string;
  tags: string[];
  views: number;
  engagement: number; // percentage
}

// Mock retired stories - in production, this would come from localStorage or API
const generateRetiredStories = (): RateStory[] => {
  // First try to load from localStorage
  try {
    const archived = localStorage.getItem('findmerates_archived_stories');
    if (archived) {
      const parsed = JSON.parse(archived);
      // Convert date strings back to Date objects
      return parsed.map((story: any) => ({
        ...story,
        publishDate: new Date(story.publishDate),
        retiredDate: new Date(story.retiredDate),
      }));
    }
  } catch (error) {
    console.error('Error loading archived stories:', error);
  }

  // Fallback to mock data if no archived stories
  const stories: Omit<RateStory, 'id' | 'publishDate' | 'retiredDate' | 'views' | 'engagement'>[] = [
    {
      title: 'Mortgage Rates Drop to 6-Month Low',
      summary: 'Latest Fed decisions push 30-year fixed rates below 7% for the first time since March. What this means for homebuyers and refinancers.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      category: 'mortgage',
      duration: '2:34',
      tags: ['mortgage rates', 'fed decision', 'homebuying'],
    },
    {
      title: 'CD Rates Hit Record Highs',
      summary: 'Banks compete fiercely for deposits with rates up to 5.5% APY. Should you lock in now or wait for even higher rates?',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      category: 'cd',
      duration: '3:12',
      tags: ['cd rates', 'high yield', 'bank deposits'],
    },
    {
      title: 'High-Yield Savings Accounts Pay 5%+',
      summary: 'Online banks offer competitive rates as traditional institutions struggle. Compare the best options for your emergency fund.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop',
      category: 'savings',
      duration: '2:58',
      tags: ['savings accounts', 'high yield', 'online banking'],
    },
    {
      title: 'Market Volatility Impacts Bond Yields',
      summary: 'Stock market fluctuations affect fixed income investments. How rate-sensitive bonds perform in uncertain times.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
      category: 'market',
      duration: '4:01',
      tags: ['bond yields', 'market volatility', 'fixed income'],
    },
    {
      title: 'Federal Reserve Signals Rate Pause',
      summary: 'Fed Chair hints at potential pause in rate hikes. What this means for mortgage rates, credit cards, and loans.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop',
      category: 'market',
      duration: '3:45',
      tags: ['federal reserve', 'rate pause', 'monetary policy'],
    },
  ];

  return stories.map((story, index) => ({
    ...story,
    id: `retired-${index + 1}`,
    publishDate: new Date(Date.now() - ((index + 1) * 3600000)), // Published 1+ hours ago
    retiredDate: new Date(Date.now() - (index * 3600000)), // Retired 0-index hours ago
    views: Math.floor(Math.random() * 5000) + 1000,
    engagement: Math.floor(Math.random() * 30) + 10, // 10-40% engagement
  }));
};

// Video Player Component for Rate Stories
interface StoryVideoPlayerProps {
  story: RateStory;
  isActive: boolean;
  onVideoEnd?: () => void;
}

function StoryVideoPlayer({ story, isActive, onVideoEnd }: StoryVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play failed, user interaction required
        setIsPlaying(false);
      });
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className="relative h-96 overflow-hidden rounded-2xl shadow-2xl group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={story.videoUrl}
        poster={story.thumbnailUrl}
        autoPlay={isActive}
        muted={isMuted}
        loop
        playsInline
        onEnded={onVideoEnd}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn(
              "px-3 py-1 text-xs font-bold rounded-full",
              story.category === 'mortgage' && "bg-blue-500",
              story.category === 'cd' && "bg-green-500",
              story.category === 'savings' && "bg-purple-500",
              story.category === 'market' && "bg-orange-500"
            )}>
              {story.category.toUpperCase()}
            </span>
            <span className="text-sm opacity-80 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {story.duration}
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-3 leading-tight">{story.title}</h2>
          <p className="text-lg opacity-90 mb-4 leading-relaxed">{story.summary}</p>

          <div className="flex items-center gap-4 text-sm opacity-75">
            <span>{story.views.toLocaleString()} views</span>
            <span>{story.engagement}% engagement</span>
            <span>Retired {story.retiredDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Video Controls - Hidden by default, show on hover */}
      <div className={cn(
        'absolute bottom-4 right-4 flex items-center gap-2 transition-all duration-300',
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}>
        <button
          onClick={togglePlay}
          className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={toggleMute}
          className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

export default function RateStories() {
  const [stories, setStories] = useState<RateStory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RateStory['category'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-viewed'>('newest');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    // Load retired stories - in production, this would come from localStorage or API
    const retiredStories = generateRetiredStories();
    setStories(retiredStories);
  }, []);

  const filteredStories = stories
    .filter(story => selectedCategory === 'all' || story.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.retiredDate.getTime() - a.retiredDate.getTime();
        case 'oldest':
          return a.retiredDate.getTime() - b.retiredDate.getTime();
        case 'most-viewed':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const getCategoryColor = (category: RateStory['category']) => {
    const colors = {
      mortgage: 'bg-blue-100 text-blue-800 border-blue-200',
      cd: 'bg-green-100 text-green-800 border-green-200',
      savings: 'bg-purple-100 text-purple-800 border-purple-200',
      market: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[category];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">
                Rate Stories Archive
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Previously featured stories from our home page. Each story includes exclusive video content
                and in-depth analysis of financial rate trends.
              </p>
            </div>

            {/* AdSense Header Ad */}
            <div className="mt-8 flex justify-center">
              <AdSenseSlot
                adClient={AD_CLIENT}
                adSlot={AD_SLOTS.hero.slotId}
                format={AD_SLOTS.hero.format}
                minHeight={250}
                className="w-full max-w-4xl"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === 'all'
                      ? "bg-brand-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  All Stories
                </button>
                {(['mortgage', 'cd', 'savings', 'market'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize",
                      selectedCategory === category
                        ? getCategoryColor(category) + " shadow-lg border-2"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-viewed">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredStories.map((story, index) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Video Player */}
                <StoryVideoPlayer
                  story={story}
                  isActive={index === activeVideoIndex}
                  onVideoEnd={() => setActiveVideoIndex((index + 1) % filteredStories.length)}
                />

                {/* Story Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full",
                      getCategoryColor(story.category)
                    )}>
                      {story.category.toUpperCase()}
                    </span>
                    <span className="text-sm text-slate-500">
                      {formatDate(story.retiredDate)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                    {story.title}
                  </h3>

                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {story.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {story.views.toLocaleString()} views
                    </span>
                    <span>{story.engagement}% engagement</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mid-Content Ad */}
          <div className="mt-16 flex justify-center">
            <AdSenseSlot
              adClient={AD_CLIENT}
              adSlot={AD_SLOTS.midContent.slotId}
              format={AD_SLOTS.midContent.format}
              minHeight={250}
              className="w-full max-w-4xl"
            />
          </div>

          {/* Load More / Pagination would go here */}
          <div className="text-center mt-12">
            <p className="text-slate-500">
              Stories are automatically archived from the home page every hour.
              Check back for the latest retired content.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}