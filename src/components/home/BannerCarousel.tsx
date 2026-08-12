import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2, Zap } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
interface Banner {
  id: number;
  imageUrl: string;
  title: string;
}

type TabKey = "past" | "ongoing" | "upcoming";

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  banners: Banner[];
}

// ── Data — add your Cloudinary URLs here ──────────────────────
const TABS: Tab[] = [
  {
    key: "past",
    label: "Past Events",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
    banners: [
      {
        id: 1,
        imageUrl: "https://res.cloudinary.com/dcxadfbih/image/upload/v1780759437/PE1_gqoui4.jpg",
        title: "Past Event 1",
      },
      {
        id: 2,
        imageUrl: "https://res.cloudinary.com/dcxadfbih/image/upload/v1780759547/PE2_uwh8wu.jpg",
        title: "Past Event 2",
      },
      {
        id: 3,
        imageUrl: "https://res.cloudinary.com/dcxadfbih/image/upload/v1780759554/PE3_s0dufn.png",
        title: "Past Event 3",
      },
      {
        id: 4,
        imageUrl: "https://res.cloudinary.com/dcxadfbih/image/upload/v1780759568/SummerCamp_xr2uww.jpg",
        title: "Summer Camp",
      },
    ],
  },
  {
    key: "ongoing",
    label: "Ongoing Events",
    icon: <Zap className="w-4 h-4" />,
    color: "#34d399",
    glow: "rgba(52,211,153,0.35)",
    banners: [
      
    ],
  },
  {
    key: "upcoming",
    label: "Upcoming Events",
    icon: <Calendar className="w-4 h-4" />,
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
    banners: [
      // Add upcoming posters here
      // { id: 1, imageUrl: "cloudinary_url", title: "Event Name" },
    ],
  },
];

// ── Carousel for one tab ──────────────────────────────────────
const Carousel: React.FC<{ tab: Tab }> = ({ tab }) => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgHeight, setImgHeight] = useState<number>(0);

  const banners = tab.banners;
  const isEmpty = banners.length === 0;

  // Reset slide when tab changes
  useEffect(() => {
    setCurrent(0);
    setImgHeight(0);
  }, [tab.key]);

  // Track image natural height for container sizing
  useEffect(() => {
    if (!imgRef.current) return;
    const ro = new ResizeObserver(() => {
      if (imgRef.current) setImgHeight(imgRef.current.offsetHeight);
    });
    ro.observe(imgRef.current);
    return () => ro.disconnect();
  }, [current, tab.key]);

  const go = (dir: 1 | -1) => {
    if (transitioning || banners.length <= 1) return;
    setTransitioning(true);
    setCurrent((p) => (p + dir + banners.length) % banners.length);
  };

  // Empty state
  if (isEmpty) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-3xl py-20 w-full"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px dashed ${tab.color}44`,
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ fontSize: 48, opacity: 0.4 }}>
          {tab.key === "upcoming" ? "🗓️" : tab.key === "ongoing" ? "⚡" : "📋"}
        </span>
        <p
          className="mt-4 text-sm font-medium"
          style={{
            color: `${tab.color}88`,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          No {tab.label} yet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Arrow nav */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => go(-1)}
          disabled={banners.length <= 1}
          className="p-3 rounded-full glass glow disabled:opacity-30 transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Previous"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => go(1)}
          disabled={banners.length <= 1}
          className="p-3 rounded-full glass glow disabled:opacity-30 transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Next"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide container — height follows the image */}
      <div
        className="relative w-full flex items-center justify-center transition-all duration-500"
        style={{ minHeight: imgHeight > 0 ? imgHeight : undefined }}
      >
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            onTransitionEnd={() => setTransitioning(false)}
            className="transition-all duration-700 ease-in-out"
            style={{
              position: i === current ? "relative" : "absolute",
              opacity: i === current ? 1 : 0,
              transform: i === current ? "scale(1)" : "scale(1.03)",
              pointerEvents: i === current ? "auto" : "none",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              top: i === current ? undefined : 0,
              left: i === current ? undefined : 0,
            }}
          >
            <a
              href={banner.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-fit max-w-full"
            >
              <img
                ref={i === current ? imgRef : null}
                src={banner.imageUrl}
                alt={banner.title}
                className="rounded-3xl object-contain max-w-full h-auto block"
                style={{ maxHeight: "75vh" }}
                onLoad={() => {
                  if (i === current && imgRef.current) {
                    setImgHeight(imgRef.current.offsetHeight);
                  }
                }}
              />
            </a>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="flex gap-2.5 mt-8">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (!transitioning) { setTransitioning(true); setCurrent(i); } }}
              aria-label={`Go to slide ${i + 1}`}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: i === current ? "2rem" : "0.625rem",
                background:
                  i === current ? tab.color : "rgba(255,255,255,0.3)",
                boxShadow: i === current ? `0 0 8px ${tab.glow}` : "none",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────
const BannerCarousel: React.FC = () => {
  // Default to "ongoing"
  const [activeKey, setActiveKey] = useState<TabKey>("ongoing");
  const activeTab = TABS.find((t) => t.key === activeKey)!;

  return (
    <section className="py-16 pb-10">
      <div className="container w-screen mx-auto px-4">
        <div className="max-w-[90%] w-full mx-auto">

          {/* ── Master heading — no icon ── */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <h2
              className="text-3xl font-bold bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Events
            </h2>
          </div>

          {/* ── Tab switcher ── */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
            {TABS.map((tab) => {
              const isActive = tab.key === activeKey;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveKey(tab.key)}
                  className="relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 select-none"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: isActive
                      ? `linear-gradient(135deg, ${tab.color}33, ${tab.color}18)`
                      : "rgba(15,18,40,0.85)",
                    border: `1.5px solid ${isActive ? tab.color : "rgba(255,255,255,0.3)"}`,
                    color: isActive ? tab.color : "#e2e8f0",
                    boxShadow: isActive
                      ? `0 0 18px ${tab.glow}, inset 0 0 12px ${tab.color}11`
                      : "0 2px 12px rgba(0,0,0,0.5)",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  {/* Active dot pulse */}
                  {isActive && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping"
                      style={{ background: tab.color, opacity: 0.7 }}
                    />
                  )}
                  <span
                    style={{
                      color: isActive ? tab.color : "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {tab.icon}
                  </span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {/* Mobile: short label */}
                  <span className="sm:hidden">
                    {tab.key === "past"
                      ? "Past"
                      : tab.key === "ongoing"
                      ? "Ongoing"
                      : "Upcoming"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Thin colored divider that matches active tab */}
          <div
            className="mx-auto mb-8 rounded-full transition-all duration-500"
            style={{
              width: "64px",
              height: "2px",
              background: activeTab.color,
              boxShadow: `0 0 10px ${activeTab.glow}`,
            }}
          />

          {/* ── Carousel — keyed so it resets on tab switch ── */}
          <Carousel key={activeKey} tab={activeTab} />
        </div>
      </div>
    </section>
  );
};

export default BannerCarousel;
