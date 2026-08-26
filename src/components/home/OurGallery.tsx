import React, { useState, useRef, useEffect, useCallback } from "react";

const workshopImages = [
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513375/ws3_m6a9df.jpg" },
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513385/ws5_nakyms.jpg" },
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513365/ws1_a0ifqk.jpg" },
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513371/ws2_q8jwhh.jpg" },
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513380/ws4_ltgsh5.jpg" },
];

const classImages = [
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768666771/WhatsApp_Image_2026-01-17_at_9.46.34_PM_glqiml.jpg" },
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768674124/img2_lrkvp6.jpg" },
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768674311/img3_hrn0xf.jpg" },
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768675188/img5_lwzaus.jpg" },
];

const projectImages = [
    { src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768675134/img4_vkibzm.jpg" },
];

// ── Video data (add YouTube embed or direct .mp4 URLs here) ──
const workshopVideos: { src: string; title: string }[] = [
    { src: "https://res.cloudinary.com/dcxadfbih/video/upload/v1787768420/video_2026-08-26_23-49-36_y4b6fw.mp4", title: "Workshop Highlight 1" },
];

const classroomVideos: { src: string; title: string }[] = [
    { src: "https://res.cloudinary.com/dcxadfbih/video/upload/v1769332020/Vid1_sse2px.mp4", title: "Classroom Clip 1" },
];

const feedbackVideos: { src: string; title: string }[] = [
    { src: "https://res.cloudinary.com/dcxadfbih/video/upload/v1787769285/video_2026-08-27_00-04-12_mquy0i.mp4", title: "Feedback 1" },
];

const allVideos = [...workshopVideos, ...feedbackVideos, ...classroomVideos];

// Helper: detect if a video URL is a direct file (mp4) vs YouTube embed
const isDirectVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

const allImages = [...workshopImages, ...classImages, ...projectImages];

// ── Responsive dimensions hook ──
function useResponsiveDimensions() {
    const getDims = useCallback(() => {
        const w = typeof window !== "undefined" ? window.innerWidth : 1024;
        if (w < 480) return { containerH: 240, cardW: 170, cardH: 150, offsetX: 120, rotateY: -24, zMul: 100 };
        if (w < 768) return { containerH: 300, cardW: 220, cardH: 190, offsetX: 160, rotateY: -28, zMul: 130 };
        return { containerH: 420, cardW: 320, cardH: 280, offsetX: 260, rotateY: -32, zMul: 160 };
    }, []);

    const [dims, setDims] = useState(getDims);

    useEffect(() => {
        const onResize = () => setDims(getDims());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [getDims]);

    return dims;
}

function Coverflow({ images, onImageClick }) {
    const [current, setCurrent] = useState(Math.floor(images.length / 2));
    const touchStartX = useRef(0);
    const dims = useResponsiveDimensions();

    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (diff > 50) prev();
        if (diff < -50) next();
    };

    if (images.length === 0) return null;

    return (
        <div className="relative">
            <div
                className="relative flex items-center justify-center"
                style={{ height: dims.containerH, perspective: "1600px" }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                    {images.map((img, i) => {
                        const offset = i - current;
                        const abs = Math.abs(offset);
                        const isActive = offset === 0;

                        const x = offset * dims.offsetX;
                        const scale = Math.max(1 - abs * 0.16, 0.6);
                        const rotateY = offset * dims.rotateY;
                        const z = -abs * dims.zMul;
                        const opacity = abs > 2 ? 0 : 1;
                        const blur = abs * 1.2;

                        return (
                            <div
                                key={i}
                                onClick={() => (isActive ? onImageClick(i) : setCurrent(i))}
                                className={`absolute top-1/2 left-1/2 rounded-2xl overflow-hidden cursor-pointer border bg-gray-900 transition-all duration-500 ease-out ${isActive ? "border-purple-400/60" : "border-white/10"
                                    }`}
                                style={{
                                    width: dims.cardW,
                                    height: dims.cardH,
                                    transform: `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                                    zIndex: 100 - abs,
                                    opacity,
                                    filter: `brightness(${1 - abs * 0.15}) blur(${blur}px)`,
                                    boxShadow: isActive ? "0 25px 50px -12px rgba(124,58,237,0.45)" : "0 15px 30px rgba(0,0,0,0.4)",
                                }}
                            >
                                <img src={img.src} className="w-full h-full object-cover" draggable={false} />
                            </div>
                        );
                    })}
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Previous image"
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white flex items-center justify-center hover:bg-gradient-to-br hover:from-teal-400 hover:to-purple-500 hover:border-transparent transition-all"
                        >
                            ‹
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next image"
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white flex items-center justify-center hover:bg-gradient-to-br hover:from-teal-400 hover:to-purple-500 hover:border-transparent transition-all"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-5">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to image ${i + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-gradient-to-r from-teal-400 to-purple-500" : "w-2 bg-white/20 hover:bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function VideoCoverflow({ videos, onVideoClick }) {
    const [current, setCurrent] = useState(Math.floor(videos.length / 2));
    const touchStartX = useRef(0);
    const dims = useResponsiveDimensions();

    const prev = () => setCurrent((c) => (c - 1 + videos.length) % videos.length);
    const next = () => setCurrent((c) => (c + 1) % videos.length);

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (diff > 50) prev();
        if (diff < -50) next();
    };

    if (videos.length === 0) return null;

    // Extract YouTube video ID for thumbnail, or return a placeholder for direct videos
    const getThumbUrl = (url: string) => {
        const match = url.match(/\/embed\/([^?]+)/);
        if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        // For direct .mp4 videos, there's no auto-thumbnail — show a placeholder
        return "";
    };

    return (
        <div className="relative">
            <div
                className="relative flex items-center justify-center"
                style={{ height: dims.containerH, perspective: "1600px" }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                    {videos.map((vid, i) => {
                        const offset = i - current;
                        const abs = Math.abs(offset);
                        const isActive = offset === 0;

                        const x = offset * dims.offsetX;
                        const scale = Math.max(1 - abs * 0.16, 0.6);
                        const rotateY = offset * dims.rotateY;
                        const z = -abs * dims.zMul;
                        const opacity = abs > 2 ? 0 : 1;
                        const blur = abs * 1.2;

                        return (
                            <div
                                key={i}
                                onClick={() => (isActive ? onVideoClick(i) : setCurrent(i))}
                                className={`absolute top-1/2 left-1/2 rounded-2xl overflow-hidden cursor-pointer border bg-gray-900 transition-all duration-500 ease-out group ${isActive ? "border-purple-400/60" : "border-white/10"
                                    }`}
                                style={{
                                    width: dims.cardW,
                                    height: dims.cardH,
                                    transform: `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                                    zIndex: 100 - abs,
                                    opacity,
                                    filter: `brightness(${1 - abs * 0.15}) blur(${blur}px)`,
                                    boxShadow: isActive
                                        ? "0 25px 50px -12px rgba(124,58,237,0.45)"
                                        : "0 15px 30px rgba(0,0,0,0.4)",
                                }}
                            >
                                {isDirectVideo(vid.src) ? (
                                    <video
                                        src={vid.src}
                                        className="w-full h-full object-cover"
                                        muted
                                        playsInline
                                        preload="metadata"
                                    />
                                ) : (
                                    <img
                                        src={getThumbUrl(vid.src)}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                        alt={vid.title}
                                    />
                                )}
                                {/* Play button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Title label */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-white text-sm font-medium truncate">{vid.title}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {videos.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Previous video"
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white flex items-center justify-center hover:bg-gradient-to-br hover:from-teal-400 hover:to-purple-500 hover:border-transparent transition-all"
                        >
                            ‹
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next video"
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white flex items-center justify-center hover:bg-gradient-to-br hover:from-teal-400 hover:to-purple-500 hover:border-transparent transition-all"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {videos.length > 1 && (
                <div className="flex justify-center gap-2 mt-5">
                    {videos.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to video ${i + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${i === current
                                ? "w-6 bg-gradient-to-r from-teal-400 to-purple-500"
                                : "w-2 bg-white/20 hover:bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function OurGalleryPreview() {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

    const closePopup = () => setSelectedIndex(null);
    const nextImage = () => selectedIndex !== null && setSelectedIndex((selectedIndex + 1) % allImages.length);
    const prevImage = () => selectedIndex !== null && setSelectedIndex((selectedIndex - 1 + allImages.length) % allImages.length);

    const closeVideoPopup = () => setSelectedVideoIndex(null);
    const nextVideo = () => selectedVideoIndex !== null && setSelectedVideoIndex((selectedVideoIndex + 1) % allVideos.length);
    const prevVideo = () => selectedVideoIndex !== null && setSelectedVideoIndex((selectedVideoIndex - 1 + allVideos.length) % allVideos.length);

    return (
        <section id="our-gallery" className="py-8 sm:py-16 bg-gray-950 min-h-screen">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-14">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                        Our Gallery
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A glimpse of our robotics, IoT projects, workshops, and events.
                    </p>
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-white">Workshop Memories</h3>
                <Coverflow images={workshopImages} onImageClick={(i) => setSelectedIndex(i)} />

                <h3 className="text-xl sm:text-2xl font-semibold mt-10 sm:mt-16 mb-6 text-center text-white">Classroom Moments</h3>
                <Coverflow images={classImages} onImageClick={(i) => setSelectedIndex(workshopImages.length + i)} />

                <h3 className="text-xl sm:text-2xl font-semibold mt-10 sm:mt-16 mb-6 text-center text-white">Our Project Pictures</h3>
                <Coverflow
                    images={projectImages}
                    onImageClick={(i) => setSelectedIndex(workshopImages.length + classImages.length + i)}
                />

                {/* ── Divider ── */}
                <div className="mt-20 mb-14 flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <span className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-widest text-sm">
                            Videos
                        </span>
                        <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-white">Workshop Highlights</h3>
                <VideoCoverflow
                    videos={workshopVideos}
                    onVideoClick={(i) => setSelectedVideoIndex(i)}
                />

                <h3 className="text-xl sm:text-2xl font-semibold mt-10 sm:mt-16 mb-6 text-center text-white">Feedbacks</h3>
                <VideoCoverflow
                    videos={feedbackVideos}
                    onVideoClick={(i) => setSelectedVideoIndex(workshopVideos.length + i)}
                />

                <h3 className="text-xl sm:text-2xl font-semibold mt-10 sm:mt-16 mb-6 text-center text-white">Classroom Clips</h3>
                <VideoCoverflow
                    videos={classroomVideos}
                    onVideoClick={(i) => setSelectedVideoIndex(workshopVideos.length + feedbackVideos.length + i)}
                />
            </div>

            {selectedIndex !== null && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                    <button onClick={closePopup} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-2xl sm:text-3xl z-50 p-2 sm:p-4">✕</button>
                    <button onClick={prevImage} className="absolute left-2 sm:left-6 text-white text-3xl sm:text-4xl z-50 p-2 sm:p-4 hover:scale-110 transition-transform">‹</button>
                    <div className="relative max-w-[90%] max-h-[80%] flex items-center justify-center">
                        <img src={allImages[selectedIndex].src} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                    </div>
                    <button onClick={nextImage} className="absolute right-2 sm:right-6 text-white text-3xl sm:text-4xl z-50 p-2 sm:p-4 hover:scale-110 transition-transform">›</button>
                </div>
            )}

            {/* Video lightbox popup */}
            {selectedVideoIndex !== null && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                    <button onClick={closeVideoPopup} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-2xl sm:text-3xl z-50 p-2 sm:p-4 hover:text-red-400 transition-colors">✕</button>
                    <button onClick={prevVideo} className="absolute left-2 sm:left-6 text-white text-3xl sm:text-4xl z-50 p-2 sm:p-4 hover:scale-110 transition-transform">‹</button>
                    <div className="relative w-[90%] max-w-4xl aspect-video">
                        {isDirectVideo(allVideos[selectedVideoIndex].src) ? (
                            <video
                                key={selectedVideoIndex}
                                src={allVideos[selectedVideoIndex].src}
                                className="w-full h-full rounded-2xl shadow-2xl bg-black"
                                controls
                                autoPlay
                                playsInline
                            />
                        ) : (
                            <iframe
                                key={selectedVideoIndex}
                                src={allVideos[selectedVideoIndex].src + "&autoplay=1"}
                                title={allVideos[selectedVideoIndex].title}
                                className="w-full h-full rounded-2xl shadow-2xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                        <p className="text-center text-white/70 mt-4 text-sm">
                            {allVideos[selectedVideoIndex].title} — {selectedVideoIndex + 1} / {allVideos.length}
                        </p>
                    </div>
                    <button onClick={nextVideo} className="absolute right-2 sm:right-6 text-white text-3xl sm:text-4xl z-50 p-2 sm:p-4 hover:scale-110 transition-transform">›</button>
                </div>
            )}
        </section>
    );
}
