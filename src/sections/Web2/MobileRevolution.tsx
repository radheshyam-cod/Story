import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { retroPosts, retroLinks, trendingTopics, friendSuggestions } from '../../utils/data/web2';
import { staggerChildren, slideUp } from '../../utils/animation';

interface Props {
  expandedPostId: number | null;
  onTogglePost: (id: number | null) => void;
}

export const MobileRevolution = memo(function MobileRevolution({
  expandedPostId,
  onTogglePost,
}: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="mt-16" ref={ref}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="retro-nav-heading">The Mobile Revolution (2007+)</h3>
          <p className="retro-nav-sub max-w-xl">
            The iPhone (2007) pushed the feed into your pocket. By 2016, mobile traffic topped desktop. App stores and
            in-app browsers walled off data while touch UIs forced designers to rethink the classic three-column Web 2.0
            layout.
          </p>
        </div>
      </div>

      <motion.div
        layout
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 24 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="retro-shell mx-auto w-full"
      >
        <div className="retro-nav">
          <div className="retro-chrome">
            <div className="w-2.5 h-2.5 rounded-full bg-[#e45c5c]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f0a500]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#4ab866]" />
            <span className="text-[#3b5998] text-sm font-semibold">Classic Browser</span>
          </div>
          <div className="retro-nav-links">
            {['Home', 'Profile', 'Messages', 'Settings'].map((item) => (
              <button key={item} type="button" className="retro-button">
                {item}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <input placeholder="Search the feed" className="retro-input w-56 max-sm:w-40" aria-label="Search feed" />
            <button className="retro-button" data-active="true">
              Search
            </button>
          </div>
        </div>

        <motion.div
          layout
          className="retro-layout grid gap-3 grid-cols-1 md:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_260px]"
          variants={staggerChildren(0.05)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.aside variants={slideUp} className="retro-panel p-3 space-y-4">
            <div className="retro-panel retro-panel--soft p-3 space-y-3">
              <div className="retro-profile">
                <div className="retro-avatar" />
                <div>
                  <p className="font-bold text-[#3b5998] leading-tight">Early Web User</p>
                  <p className="text-xs text-[#4a5568]">Joined: 2007</p>
                </div>
              </div>
              <button className="retro-button w-full justify-center text-sm py-2">Update Status</button>
            </div>

            <div>
              <p className="retro-sidebar-title">Navigation</p>
              <div className="space-y-1">
                {retroLinks.map((link) => (
                  <button key={link} className="retro-nav-item">
                    {link}
                    <span className="text-[#b7c1d4]">›</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="retro-panel p-3">
              <p className="retro-sidebar-title">Widgets</p>
              <div className="space-y-2 text-sm text-[#4a5568]">
                <p>Weather: 72°F · Sunny</p>
                <p>Inbox: 2 unread messages</p>
                <p>Events: 1 invite pending</p>
              </div>
            </div>
          </motion.aside>

          <motion.main variants={slideUp} className="space-y-3">
            {retroPosts.map((post, index) => {
              const expanded = expandedPostId === post.id;
              return (
                <motion.article
                  key={post.id}
                  layout
                  onClick={() => onTogglePost(expanded ? null : post.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`retro-panel retro-feed-card ${expanded ? 'border-[#3b5998] bg-gradient-to-b from-white to-indigo-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="retro-feed-meta">{post.meta}</p>
                      <h4 className="retro-feed-title">{post.title}</h4>
                    </div>
                    <span className="text-[11px] text-[#3b5998] font-semibold">Feed · 2008</span>
                  </div>
                  <p className="retro-feed-body">{post.body}</p>

                  {expanded && (
                    <div className="mt-3 space-y-2 text-sm text-[#4a5568]">
                      <p>Touch UI forced nav bars to shrink and content to stack. The feed became the primary canvas — perfect for ads and tracking pixels.</p>
                      <p className="text-[#3b5998] font-semibold">Engagement simulated · comments wake the algorithm</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    {['Like', 'Comment', 'Share'].map((action) => (
                      <button key={action} className="retro-button text-sm py-1.5">
                        {action}
                      </button>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </motion.main>

          <motion.aside variants={slideUp} className="retro-panel p-3 space-y-4 hidden xl:block">
            <div className="retro-panel retro-panel--widget p-3">
              <p className="text-xs font-semibold text-[#6b7280] mb-1">Sponsored</p>
              <p className="text-sm text-[#2d3748] font-semibold">"There’s an app for that"</p>
              <p className="text-xs text-[#4a5568]">Download the latest weather + stocks widget for your new iPhone.</p>
            </div>

            <div className="retro-panel">
              <div className="retro-card-header">
                <p className="text-sm font-bold text-[#3b5998]">Trending Topics</p>
              </div>
              <div className="p-3 space-y-2 text-sm text-[#4a5568]">
                {trendingTopics.map((topic) => (
                  <div key={topic} className="retro-list-item">
                    <span className="retro-tag-dot" />
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            <div className="retro-panel">
              <div className="retro-card-header">
                <p className="text-sm font-bold text-[#3b5998]">Friend Suggestions</p>
              </div>
              <div className="p-3 space-y-2 text-sm text-[#4a5568]">
                {friendSuggestions.map((friend) => (
                  <div key={friend} className="flex items-center justify-between">
                    <span>{friend}</span>
                    <button className="retro-button text-xs px-2 py-1 font-semibold">Add</button>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </motion.div>

      <p className="text-center text-[#4a5568] text-xs font-mono mt-3 md:hidden">
        Mobile stack · single column · touch targets
      </p>
      <p className="text-center text-[#4a5568] text-xs font-mono mt-3 hidden md:block">
        Desktop · 3-column feed · 1200px+
      </p>
    </section>
  );
});
