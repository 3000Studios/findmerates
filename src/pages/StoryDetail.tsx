import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Newspaper,
  Clock,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  User,
  Send,
  Share2,
  Bookmark,
  Star,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Story, Comment } from "../types";
import { cn } from "../lib/utils";
import { auth, db } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";
import { fetchLatestFinancialNews } from "../services/intelligenceService";

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      setIsLoading(true);
      try {
        const news = await fetchLatestFinancialNews("general");
        const foundStory = news.find((s: Story) => s.slug === slug) || news[0];
        setStory(foundStory);
      } catch (err) {
        console.error("Failed to fetch story:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStory();
  }, [slug]);

  useEffect(() => {
    if (!story) return;
    const q = query(
      collection(db, "stories", story.id, "comments"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Comment,
      );
      setComments(commentsData);
    });
    return () => unsubscribe();
  }, [story]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !newComment.trim() || !story) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "stories", story.id, "comments"), {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName || "Anonymous",
        photoURL: auth.currentUser.photoURL,
        text: newComment.trim(),
        createdAt: serverTimestamp(),
        storyId: story.id,
      });
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-accent-gold animate-spin mx-auto mb-10" />
          <p className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">
            Accessing Intelligence Partition
          </p>
        </div>
      </div>
    );

  if (!story)
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-bold uppercase tracking-widest">
        Story not found.
      </div>
    );

  return (
    <div className="pb-32">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-brand-900/60 z-10" />
        <div className="absolute inset-0 -z-10">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover grayscale brightness-[0.2]"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <nav className="flex items-center justify-center gap-4 text-[10px] font-bold text-accent-gold mb-12 uppercase tracking-[0.5em]">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link
                to="/stories"
                className="hover:text-white transition-colors"
              >
                Intelligence
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{story.category}</span>
            </nav>
            <h1 className="text-5xl md:text-9xl font-display font-bold text-white mb-12 leading-[0.9] uppercase tracking-tighter">
              {story.title}
            </h1>
            <div className="flex items-center justify-center gap-12 text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">
              <span className="flex items-center gap-3">
                <User className="w-4 h-4 text-accent-gold" /> {story.author}
              </span>
              <span className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent-gold" />{" "}
                {new Date(story.publishedAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-600 border border-white/5 p-12 md:p-24 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-white prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-xl prose-strong:text-accent-gold prose-a:text-accent-gold hover:prose-a:text-white transition-colors">
                <ReactMarkdown>{story.content}</ReactMarkdown>
              </div>

              <div className="mt-32 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-12">
                <div className="flex items-center gap-12">
                  <button className="flex items-center gap-3 text-[10px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-[0.3em]">
                    <Share2 className="w-4 h-4" /> Share Intelligence
                  </button>
                  <button className="flex items-center gap-3 text-[10px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-[0.3em]">
                    <Bookmark className="w-4 h-4" /> Archive Report
                  </button>
                </div>
                <div className="flex items-center gap-4 text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">
                  <ShieldCheck className="w-5 h-5" /> Institutional Verified
                </div>
              </div>
            </motion.div>

            {/* Comment Section */}
            <section className="mt-32 space-y-1">
              <div className="bg-brand-600 p-12 border border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-display font-bold text-white flex items-center gap-6 uppercase tracking-tight">
                  <MessageSquare className="w-6 h-6 text-accent-gold" />{" "}
                  Analysis Discussion ({comments.length})
                </h3>
              </div>

              {auth.currentUser ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleComment}
                  className="bg-brand-600 border border-white/5 p-12"
                >
                  <div className="flex gap-10">
                    <div className="w-14 h-14 bg-brand-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {auth.currentUser.photoURL ? (
                        <img
                          src={auth.currentUser.photoURL}
                          alt={auth.currentUser.displayName || ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-slate-700" />
                      )}
                    </div>
                    <div className="flex-grow space-y-10">
                      <textarea
                        placeholder="Contribute to the intelligence pool..."
                        className="w-full px-10 py-8 bg-brand-900 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-accent-gold/50 min-h-[200px] resize-none font-medium text-lg"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting || !newComment.trim()}
                          className="btn-corporate btn-corporate-gold disabled:opacity-50"
                        >
                          {isSubmitting ? "Syncing..." : "Submit Intelligence"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.form>
              ) : (
                <div className="bg-brand-600 border border-white/5 p-24 text-center">
                  <p className="text-slate-600 mb-12 font-bold uppercase tracking-[0.4em] text-[10px]">
                    Institutional authentication required
                  </p>
                  <button
                    onClick={() => navigate("/pro")}
                    className="btn-corporate btn-corporate-gold"
                  >
                    Initialize Authorization
                  </button>
                </div>
              )}

              <div className="space-y-1">
                {comments.map((comment, i) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-brand-600 border border-white/5 p-12 flex gap-10"
                  >
                    <div className="w-12 h-12 bg-brand-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {comment.photoURL ? (
                        <img
                          src={comment.photoURL}
                          alt={comment.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-slate-800" />
                      )}
                    </div>
                    <div className="grow">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-white uppercase tracking-widest text-xs">
                          {comment.displayName}
                        </h4>
                        <span className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em]">
                          {comment.createdAt &&
                          (comment.createdAt as any).toDate
                            ? (comment.createdAt as any)
                                .toDate()
                                .toLocaleDateString()
                            : "Just now"}
                        </span>
                      </div>
                      <p className="text-slate-500 text-lg leading-relaxed font-medium">
                        {comment.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-1">
            <div className="ad-slot h-[600px]">Vertical Ad Placement</div>

            <div className="bg-brand-600 border border-white/5 p-12">
              <h3 className="text-xl font-display font-bold text-white mb-12 uppercase tracking-tight">
                Related Intel
              </h3>
              <div className="space-y-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group flex gap-8 cursor-pointer">
                    <div className="w-24 h-24 bg-brand-900 border border-white/5 overflow-hidden shrink-0">
                      <img
                        src={`https://picsum.photos/seed/rel${i}/300/300`}
                        alt="Related"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-white text-sm leading-tight group-hover:text-accent-gold transition-all uppercase tracking-tight group-hover:scale-[1.05] origin-left">
                        Strategic Market Shift Analysis
                      </h4>
                      <p className="text-[9px] font-bold text-slate-700 mt-4 uppercase tracking-widest">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent-gold p-12">
              <h3 className="text-brand-900 text-xl font-display font-bold mb-8 uppercase tracking-tight">
                Pro Intelligence
              </h3>
              <p className="text-brand-900/70 text-sm font-bold uppercase tracking-widest mb-12 leading-relaxed">
                Unlock real-time predictive modeling and institutional alerts.
              </p>
              <Link
                to="/pro"
                className="w-full btn-corporate bg-brand-900 text-white border-none flex items-center justify-center gap-4"
              >
                Upgrade Access <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
