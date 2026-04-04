import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

// Video and story data - in production, this would come from an API
interface HeroStory {
  id: string;
  title: string;
  summary: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: 'mortgage' | 'cd' | 'savings' | 'market';
  publishDate: Date;
  duration: string; // video duration
  tags: string[];
  views?: number;
  engagement?: number;
}

// Generate mock hero stories with relevant financial content
const generateHeroStories = (): HeroStory[] => {
  const stories: Omit<HeroStory, 'id' | 'publishDate'>[] = [
    {
      title: 'Mortgage Rates Drop to 6-Month Low',
      summary: 'Latest Fed decisions push 30-year fixed rates below 7% for the first time since March. What this means for homebuyers and refinancers.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Placeholder - replace with actual financial videos
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
    id: `hero-${index + 1}`,
    publishDate: new Date(Date.now() - (index * 3600000)), // Each story 1 hour apart
  }));
};

// Load archived stories from localStorage
const loadArchivedStories = (): HeroStory[] => {
  try {
    const archived = localStorage.getItem('findmerates_archived_stories');
    return archived ? JSON.parse(archived) : [];
  } catch {
    return [];
  }
};

// Save story to archive
const archiveStory = (story: HeroStory) => {
  const archived = loadArchivedStories();
  const archivedStory = {
    ...story,
    retiredDate: new Date(),
    views: Math.floor(Math.random() * 5000) + 1000,
    engagement: Math.floor(Math.random() * 30) + 10,
  };
  archived.unshift(archivedStory); // Add to beginning

  // Keep only last 50 archived stories
  if (archived.length > 50) {
    archived.splice(50);
  }

  localStorage.setItem('findmerates_archived_stories', JSON.stringify(archived));
};

interface HeroVideoProps {
  onStoryChange?: (story: HeroStory) => void;
  className?: string;
}

export default function HeroVideo({ onStoryChange, className }: HeroVideoProps) {
  const [currentStory, setCurrentStory] = useState<HeroStory | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [timeUntilNext, setTimeUntilNext] = useState(3600); // 1 hour in seconds
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with first story
  useEffect(() => {
    const stories = generateHeroStories();
    setCurrentStory(stories[0]);
    onStoryChange?.(stories[0]);
  }, [onStoryChange]);

  // Auto-rotate stories every hour
  useEffect(() => {
    const rotateStory = () => {
      const stories = generateHeroStories();
      const currentIndex = stories.findIndex(s => s.id === currentStory?.id) || 0;
      const nextIndex = (currentIndex + 1) % stories.length;
      const nextStory = stories[nextIndex];

      // Archive the current story before rotating
      if (currentStory) {
        archiveStory(currentStory);
        console.log('Story archived to rate stories:', currentStory.title);
      }

      setCurrentStory(nextStory);
      onStoryChange?.(nextStory);
      setTimeUntilNext(3600); // Reset countdown
    };

    // Set up countdown timer
    intervalRef.current = setInterval(() => {
      setTimeUntilNext(prev => {
        if (prev <= 1) {
          rotateStory();
          return 3600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStory, onStoryChange]);

  // Video controls - simplified for auto-play only
  // Removed toggle functions as per requirements (no media buttons)

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentStory) {
    return (
      <div className={cn('relative h-96 bg-slate-200 animate-pulse', className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-500">Loading hero content...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('relative h-96 overflow-hidden', className)}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={currentStory.videoUrl}
        poster={currentStory.thumbnailUrl}
        autoPlay
        muted={isMuted}
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-brand-600 text-white text-sm font-medium rounded-full">
                {currentStory.category.toUpperCase()}
              </span>
              <span className="text-white text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(timeUntilNext)} until next story
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {currentStory.title}
            </h1>

            <p className="text-xl text-white text-opacity-90 mb-6 leading-relaxed">
              {currentStory.summary}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {currentStory.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Compare Rates Now
              </button>
              <button className="text-white hover:text-brand-200 transition-colors flex items-center gap-2">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Controls - REMOVED: No media buttons as requested */}
      {/* Controls hidden for clean auto-play experience */}

      {/* Next Story Indicator */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
        Next story in {formatTime(timeUntilNext)}
      </div>
    </div>
  );
}