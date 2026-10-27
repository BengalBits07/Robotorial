import React, { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   DATA — all existing Cloudinary media
   ══════════════════════════════════════════════════════════════ */

interface PhotoItem { src: string; alt?: string }
interface VideoItem { type: "file" | "youtube"; src: string; thumb: string; title: string }
interface PhotoCategory { id: string; title: string; cover?: string; items: PhotoItem[] }
interface VideoCategory { id: string; title: string; cover?: string; items: VideoItem[] }

const GALLERY: {
  photos: PhotoCategory[];
  videos: VideoCategory[];
} = {
  photos: [
    {
      id: "workshop",
      title: "Workshop Memories",
      items: [
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513375/ws3_m6a9df.jpg", alt: "Workshop 1" },
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513385/ws5_nakyms.jpg", alt: "Workshop 2" },
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513365/ws1_a0ifqk.jpg", alt: "Workshop 3" },
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513371/ws2_q8jwhh.jpg", alt: "Workshop 4" },
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513380/ws4_ltgsh5.jpg", alt: "Workshop 5" },
      ],
    },
    {
      id: "classroom",
      title: "Classroom Moments",
      items: [
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768666771/WhatsApp_Image_2026-01-17_at_9.46.34_PM_glqiml.jpg", alt: "Classroom 1" },
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768674124/img2_lrkvp6.jpg", alt: "Classroom 2" },
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768674311/img3_hrn0xf.jpg", alt: "Classroom 3" },
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768675188/img5_lwzaus.jpg", alt: "Classroom 4" },
      ],
    },
    {
      id: "projects",
      title: "Our Project Pictures",
      items: [
        { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768675134/img4_vkibzm.jpg", alt: "Project 1" },
      ],
    },
  ],
  videos: [
    {
      id: "highlights",
      title: "Workshop Highlights",
      items: [
        { type: "file", src: "https://res.cloudinary.com/dcxadfbih/video/upload/v1787768420/video_2026-08-26_23-49-36_y4b6fw.mp4", thumb: "https://res.cloudinary.com/dcxadfbih/video/upload/so_2/v1787768420/video_2026-08-26_23-49-36_y4b6fw.jpg", title: "Workshop Highlight 1" },
      ],
    },
    {
      id: "feedbacks",
      title: "Feedbacks",
      items: [
        { type: "file", src: "https://res.cloudinary.com/dcxadfbih/video/upload/v1787769285/video_2026-08-27_00-04-12_mquy0i.mp4", thumb: "https://res.cloudinary.com/dcxadfbih/video/upload/so_2/v1787769285/video_2026-08-27_00-04-12_mquy0i.jpg", title: "Feedback 1" },
      ],
    },
    {
      id: "clips",
      title: "Classroom Clips",
      items: [
        { type: "file", src: "https://res.cloudinary.com/dcxadfbih/video/upload/v1769332020/Vid1_sse2px.mp4", thumb: "https://res.cloudinary.com/dcxadfbih/video/upload/so_2/v1769332020/Vid1_sse2px.jpg", title: "Classroom Clip 1" },
      ],
    },
  ],
};

/* ══════════════════════════════════════════════════════════════
   STYLES (scoped via unique class names — matches artifact aesthetic)
   ══════════════════════════════════════════════════════════════ */
const galleryStyles = `
/* Gallery section */
.og-gallery {
  --og-card: rgba(23, 25, 36, 0.85);
  --og-card-border: rgba(255,255,255,0.08);
  --og-accent: #4dd0e1;
  --og-accent2: #8b5cf6;
  --og-muted: #9aa3c7;
  --og-ease: cubic-bezier(.22,.8,.24,1);
  --og-radius: 16px;
}

/* Tabs */
.og-tabs {
  display: inline-flex; gap: 4px; padding: 4px;
  border: 1px solid var(--og-card-border); border-radius: 999px;
  background: var(--og-card); margin-bottom: 36px;
}
.og-tab {
  border: 0; background: none; color: var(--og-muted);
  font-family: inherit; font-weight: 600; padding: 10px 28px;
  border-radius: 999px; cursor: pointer;
  transition: .3s var(--og-ease);
}
.og-tab:hover { color: #fff; }
.og-tab[aria-selected="true"] {
  color: #fff;
  background: linear-gradient(135deg, var(--og-accent2), var(--og-accent));
  box-shadow: 0 0 18px rgba(139,92,246,.35);
}

/* View animations */
.og-view { animation: ogIn .45s var(--og-ease); }
@keyframes ogIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }

/* Category grid — flexbox for natural centering of odd items */
.og-cat-grid {
  display: flex; flex-wrap: wrap;
  gap: 28px; justify-content: center;
  align-items: stretch;
}
.og-cat {
  all: unset; box-sizing: border-box; cursor: pointer;
  background: var(--og-card); border: 1px solid var(--og-card-border);
  border-radius: var(--og-radius); padding: 10px 10px 16px;
  text-align: center; transition: .35s var(--og-ease);
  width: clamp(260px, 28vw, 380px);
  flex-shrink: 0;
}
/* Video category cards — square thumbnails */
.og-cat-grid--videos .og-cat-thumb { aspect-ratio: 1/1; }
.og-cat-grid--videos .og-cat { width: clamp(220px, 24vw, 300px); }
.og-cat:hover, .og-cat:focus-visible {
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(139,92,246,.6);
  box-shadow: 0 10px 30px rgba(139,92,246,.22);
}
.og-cat-thumb {
  display: block; position: relative; aspect-ratio: 4/3;
  border-radius: calc(var(--og-radius) - 6px); overflow: hidden;
}
.og-cat-thumb img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .6s var(--og-ease);
}
.og-cat:hover .og-cat-thumb img { transform: scale(1.07); }
.og-cat-count {
  position: absolute; right: 8px; bottom: 8px;
  font-size: .75rem; padding: 3px 10px; border-radius: 999px;
  background: rgba(13,15,26,.75); backdrop-filter: blur(4px);
  color: #fff;
}
.og-cat-name {
  display: block; margin-top: 14px; font-weight: 600; color: #fff;
  transition: color .3s;
}
.og-cat:hover .og-cat-name { color: var(--og-accent); }

/* Bar (back + title) */
.og-bar {
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 28px; flex-wrap: wrap;
}
.og-back {
  border: 1px solid var(--og-card-border); background: var(--og-card);
  color: #fff; font-family: inherit; padding: 9px 18px;
  border-radius: 999px; cursor: pointer; transition: .3s var(--og-ease);
  font-size: 0.9rem;
}
.og-back:hover {
  border-color: var(--og-accent); color: var(--og-accent);
  transform: translateX(-3px);
}
.og-bar-title {
  margin: 0 auto; padding-right: 130px;
  font-size: 1.4rem; color: #fff;
}
@media(max-width:600px) {
  .og-bar-title { padding: 0; flex-basis: 100%; order: 2; text-align: center; }
}

/* 3D Carousel */
.og-carousel {
  position: relative;
  height: clamp(230px, 42vw, 360px);
  perspective: 1200px; overflow: hidden;
  touch-action: pan-y; user-select: none;
}
.og-slide {
  position: absolute; left: 50%; top: 50%;
  width: min(300px, 62%); aspect-ratio: 8/6;
  margin-top: calc(min(300px,62%) * -0.375);
  margin-left: calc(min(300px,62%) / -2);
  border-radius: 12px; overflow: hidden; cursor: pointer;
  transition: transform .6s var(--og-ease), opacity .6s, box-shadow .6s;
  box-shadow: 0 8px 24px rgba(0,0,0,.5);
}
.og-slide img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  pointer-events: none;
}
.og-slide.og-active {
  border: 1px solid rgba(139,92,246,.7);
  box-shadow: 0 0 36px rgba(139,92,246,.45);
}
.og-arrow {
  position: absolute; top: 50%; z-index: 5;
  width: 36px; height: 36px; margin-top: -18px; border-radius: 50%;
  border: 1px solid var(--og-card-border);
  background: rgba(23,25,36,.85); color: #fff;
  cursor: pointer; font-size: 1.1rem;
  transition: .3s var(--og-ease);
  display: flex; align-items: center; justify-content: center;
}
.og-arrow:hover { border-color: var(--og-accent); color: var(--og-accent); }
.og-arrow-prev { left: 6px; }
.og-arrow-next { right: 6px; }
.og-dots {
  display: flex; justify-content: center; gap: 8px;
  margin-top: 22px; flex-wrap: wrap;
  max-width: 320px; margin-inline: auto;
}
.og-dot {
  width: 8px; height: 8px; border-radius: 99px;
  border: 0; padding: 0; background: #3a4066;
  cursor: pointer; transition: .4s var(--og-ease);
}
.og-dot.og-active-dot {
  width: 30px;
  background: linear-gradient(90deg, var(--og-accent2), var(--og-accent));
}

/* Video grid — flexbox for centering single items */
.og-vid-grid {
  display: flex; flex-wrap: wrap;
  gap: 22px; justify-content: center;
}
.og-vid {
  all: unset; box-sizing: border-box; cursor: pointer;
  background: var(--og-card); border: 1px solid var(--og-card-border);
  border-radius: var(--og-radius); overflow: hidden;
  text-align: left; transition: .35s var(--og-ease);
  width: clamp(260px, 30vw, 380px); flex-shrink: 0;
}
.og-vid:hover, .og-vid:focus-visible {
  transform: translateY(-5px) scale(1.02);
  border-color: rgba(139,92,246,.6);
  box-shadow: 0 10px 30px rgba(139,92,246,.22);
}
.og-vid-thumb { position: relative; aspect-ratio: 1/1; }
.og-vid-thumb img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.og-play {
  position: absolute; inset: 0; display: grid; place-items: center;
  background: linear-gradient(transparent 40%, rgba(13,15,26,.7));
}
.og-play-icon {
  width: 52px; height: 52px; border-radius: 50%;
  display: grid; place-items: center;
  background: rgba(255,255,255,.18); backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,.4);
  transition: .3s var(--og-ease);
}
.og-vid:hover .og-play-icon {
  background: var(--og-accent2); transform: scale(1.1);
}
.og-play-icon::after {
  content: ""; border-left: 14px solid #fff;
  border-block: 9px solid transparent; margin-left: 4px;
}
.og-vid-title {
  display: block; padding: 12px 14px;
  font-weight: 500; font-size: .95rem; color: #fff;
}

/* Lightbox */
.og-lb {
  position: fixed; inset: 0; z-index: 100;
  display: none; place-items: center;
  background: rgba(3,5,16,.88); backdrop-filter: blur(8px); padding: 20px;
}
.og-lb.og-lb-open { display: grid; animation: ogIn .3s var(--og-ease); }
.og-lb-box {
  max-width: min(960px, 90vw); max-height: 85vh;
  background: #000; border-radius: 12px; overflow: hidden;
  box-shadow: 0 0 50px rgba(139,92,246,.35);
  display: flex; align-items: center; justify-content: center; color: var(--og-muted);
}
.og-lb-box video { max-width: 90vw; max-height: 85vh; border: 0; border-radius: 12px; object-fit: contain; }
.og-lb-box iframe { width: min(960px, 90vw); aspect-ratio: 16/9; border: 0; }
.og-lb-close {
  position: absolute; top: 14px; right: 16px;
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid var(--og-card-border); background: var(--og-card);
  color: #fff; font-size: 1.2rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: .3s var(--og-ease);
}
.og-lb-close:hover {
  border-color: #ef4444; color: #ef4444;
}
.og-empty { color: var(--og-muted); padding: 40px 0; }

/* Image lightbox */
.og-img-lb {
  position: fixed; inset: 0; z-index: 100;
  display: none; place-items: center;
  background: rgba(3,5,16,.92); backdrop-filter: blur(10px); padding: 20px;
}
.og-img-lb.og-lb-open { display: grid; animation: ogIn .3s var(--og-ease); }
.og-img-lb img {
  max-width: 90%; max-height: 85vh; object-fit: contain;
  border-radius: 12px; box-shadow: 0 0 50px rgba(139,92,246,.35);
}
.og-img-nav {
  position: absolute; top: 50%; z-index: 5;
  width: 44px; height: 44px; margin-top: -22px; border-radius: 50%;
  border: 1px solid var(--og-card-border);
  background: rgba(23,25,36,.85); color: #fff;
  cursor: pointer; font-size: 1.3rem;
  transition: .3s var(--og-ease);
  display: flex; align-items: center; justify-content: center;
}
.og-img-nav:hover { border-color: var(--og-accent); color: var(--og-accent); transform: scale(1.1); }
.og-img-prev { left: 16px; }
.og-img-next { right: 16px; }

@media(prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
`;

/* ══════════════════════════════════════════════════════════════
   3D Coverflow Carousel Component
   ══════════════════════════════════════════════════════════════ */
function Carousel({ items, onImageClick }: { items: PhotoItem[]; onImageClick: (idx: number) => void }) {
  const n = items.length;
  const [current, setCurrent] = useState(Math.floor(n / 2));
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerX = useRef<number | null>(null);

  const go = useCallback((k: number) => {
    setCurrent(((k % n) + n) % n);
  }, [n]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "ArrowRight") go(current + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, go]);

  // compute gap based on container width
  const getGap = () => {
    if (!stageRef.current) return 200;
    return Math.min(230, stageRef.current.clientWidth * 0.3);
  };

  if (n === 0) return <p className="og-empty">Coming soon.</p>;

  return (
    <div>
      <div className="og-carousel" ref={stageRef}
        onPointerDown={(e) => { pointerX.current = e.clientX; }}
        onPointerUp={(e) => {
          if (pointerX.current !== null && Math.abs(e.clientX - pointerX.current) > 40) {
            go(current + (e.clientX < pointerX.current ? 1 : -1));
          }
          pointerX.current = null;
        }}
      >
        {items.map((item, k) => {
          const d = k - current;
          const a = Math.abs(d);
          const gap = getGap();
          return (
            <div
              key={k}
              className={`og-slide${a === 0 ? " og-active" : ""}`}
              onClick={() => (a === 0 ? onImageClick(k) : go(k))}
              style={{
                transform: `translateX(${d * gap}px) translateZ(${-a * 90}px) rotateY(${-d * 14}deg) scale(${a ? 0.88 : 1})`,
                opacity: a > 2 ? 0 : a ? 0.75 : 1,
                pointerEvents: a > 2 ? "none" : "auto",
                zIndex: 10 - a,
              }}
            >
              <img src={item.src} alt={item.alt || ""} loading="lazy" draggable={false} />
            </div>
          );
        })}

        <button className="og-arrow og-arrow-prev" onClick={() => go(current - 1)} aria-label="Previous">‹</button>
        <button className="og-arrow og-arrow-next" onClick={() => go(current + 1)} aria-label="Next">›</button>
      </div>

      {n > 1 && (
        <div className="og-dots">
          {items.map((_, k) => (
            <button
              key={k}
              className={`og-dot${k === current ? " og-active-dot" : ""}`}
              onClick={() => go(k)}
              aria-label={`Photo ${k + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Video Grid Component
   ══════════════════════════════════════════════════════════════ */
function VideoGrid({ items, onVideoClick }: { items: VideoItem[]; onVideoClick: (v: VideoItem) => void }) {
  if (items.length === 0) return <p className="og-empty">Coming soon.</p>;
  return (
    <div className="og-vid-grid">
      {items.map((v, i) => (
        <button key={i} className="og-vid" onClick={() => onVideoClick(v)}>
          <span className="og-vid-thumb">
            <img src={v.thumb} alt="" loading="lazy" />
            <span className="og-play"><i className="og-play-icon" /></span>
          </span>
          <span className="og-vid-title">{v.title}</span>
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Category View Component (back button + carousel / video grid)
   ══════════════════════════════════════════════════════════════ */
function CategoryView({
  category,
  type,
  onBack,
  onImageClick,
  onVideoClick,
}: {
  category: PhotoCategory | VideoCategory;
  type: "photos" | "videos";
  onBack: () => void;
  onImageClick: (items: PhotoItem[], idx: number) => void;
  onVideoClick: (v: VideoItem) => void;
}) {
  return (
    <div className="og-view">
      <div className="og-bar">
        <button className="og-back" onClick={onBack}>
          ← Back to {type === "photos" ? "Photos" : "Videos"}
        </button>
        <h3 className="og-bar-title">{category.title}</h3>
      </div>

      {type === "photos" ? (
        <Carousel
          items={(category as PhotoCategory).items}
          onImageClick={(idx) => onImageClick((category as PhotoCategory).items, idx)}
        />
      ) : (
        <VideoGrid
          items={(category as VideoCategory).items}
          onVideoClick={onVideoClick}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Category Grid Component (shows all categories as cards)
   ══════════════════════════════════════════════════════════════ */
function CategoryGrid({
  type,
  onSelect,
}: {
  type: "photos" | "videos";
  onSelect: (cat: PhotoCategory | VideoCategory) => void;
}) {
  const categories = GALLERY[type];
  const isVideo = type === "videos";

  return (
    <div className={`og-view og-cat-grid${isVideo ? " og-cat-grid--videos" : ""}`}>
      {categories.map((c) => {
        const first = c.items[0];
        const cover =
          c.cover ||
          (isVideo ? (first as VideoItem)?.thumb : (first as PhotoItem)?.src) ||
          "";
        return (
          <button key={c.id} className="og-cat" onClick={() => onSelect(c)}>
            <span className="og-cat-thumb">
              <img src={cover} alt="" loading="lazy" />
              <span className="og-cat-count">
                {c.items.length} {isVideo ? (c.items.length === 1 ? "video" : "videos") : (c.items.length === 1 ? "photo" : "photos")}
              </span>
            </span>
            <span className="og-cat-name">{c.title}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Gallery Component
   ══════════════════════════════════════════════════════════════ */
export default function OurGalleryPreview() {
  const [type, setType] = useState<"photos" | "videos">("photos");
  const [selectedCat, setSelectedCat] = useState<PhotoCategory | VideoCategory | null>(null);

  // Image lightbox state
  const [imgLb, setImgLb] = useState<{ items: PhotoItem[]; idx: number } | null>(null);
  // Video lightbox state
  const [vidLb, setVidLb] = useState<VideoItem | null>(null);

  // Escape key closes lightboxes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setImgLb(null);
        setVidLb(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleTabSwitch = (t: "photos" | "videos") => {
    setType(t);
    setSelectedCat(null);
  };

  return (
    <>
      {/* Inject scoped styles */}
      <style>{galleryStyles}</style>

      <section id="our-gallery" className="og-gallery py-8 sm:py-16 min-h-screen" style={{ background: "rgb(var(--background))" }}>
        <div className="max-w-[1100px] mx-auto px-5 text-center">
          {/* Header */}
          <h2
            className="font-bold mb-7"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              background: "linear-gradient(90deg, var(--og-accent), var(--og-accent2))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Gallery
          </h2>

          {/* Photos / Videos Tabs */}
          <div className="og-tabs" role="tablist">
            <button
              className="og-tab"
              role="tab"
              aria-selected={type === "photos"}
              onClick={() => handleTabSwitch("photos")}
            >
              📸 Photos
            </button>
            <button
              className="og-tab"
              role="tab"
              aria-selected={type === "videos"}
              onClick={() => handleTabSwitch("videos")}
            >
              🎬 Videos
            </button>
          </div>

          {/* Content */}
          {selectedCat === null ? (
            <CategoryGrid
              type={type}
              onSelect={(cat) => setSelectedCat(cat)}
            />
          ) : (
            <CategoryView
              category={selectedCat}
              type={type}
              onBack={() => setSelectedCat(null)}
              onImageClick={(items, idx) => setImgLb({ items, idx })}
              onVideoClick={(v) => setVidLb(v)}
            />
          )}
        </div>
      </section>

      {/* ── Image Lightbox ── */}
      <div
        className={`og-img-lb${imgLb ? " og-lb-open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setImgLb(null); }}
      >
        {imgLb && (
          <>
            <button
              className="og-lb-close"
              onClick={() => setImgLb(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <button
              className="og-img-nav og-img-prev"
              onClick={() =>
                setImgLb((prev) =>
                  prev
                    ? { ...prev, idx: (prev.idx - 1 + prev.items.length) % prev.items.length }
                    : null
                )
              }
              aria-label="Previous image"
            >
              ‹
            </button>
            <img
              src={imgLb.items[imgLb.idx].src}
              alt={imgLb.items[imgLb.idx].alt || ""}
            />
            <button
              className="og-img-nav og-img-next"
              onClick={() =>
                setImgLb((prev) =>
                  prev
                    ? { ...prev, idx: (prev.idx + 1) % prev.items.length }
                    : null
                )
              }
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* ── Video Lightbox ── */}
      <div
        className={`og-lb${vidLb ? " og-lb-open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setVidLb(null); }}
      >
        {vidLb && (
          <>
            <button
              className="og-lb-close"
              onClick={() => setVidLb(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="og-lb-box">
              {vidLb.type === "youtube" ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${vidLb.src}?autoplay=1&rel=0`}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={vidLb.title}
                />
              ) : vidLb.src ? (
                <video src={vidLb.src} controls autoPlay playsInline />
              ) : (
                <span>Video source not available.</span>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
