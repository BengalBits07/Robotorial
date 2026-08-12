import React, { useState } from "react";
import AnimateOnScroll from "../AnimateOnScroll";

const workshopImages = [
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513375/ws3_m6a9df.jpg"
        // title: "Hands-on Training",
    },
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513385/ws5_nakyms.jpg"
        // title: "Hands-on Training",
    },
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513365/ws1_a0ifqk.jpg"
        // title: "Hands-on Training",
    },
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513371/ws2_q8jwhh.jpg"
        // title: "Hands-on Training",
    },
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1786513380/ws4_ltgsh5.jpg"
        // title: "Hands-on Training",
    },
];

const classImages = [
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768666771/WhatsApp_Image_2026-01-17_at_9.46.34_PM_glqiml.jpg"
        // title: "Workshop Session",
    },
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768674124/img2_lrkvp6.jpg"
        // title: "Hands-on Training",
    },
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768674311/img3_hrn0xf.jpg"
        // title: "Hands-on Training",
    },
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768675188/img5_lwzaus.jpg"
        // title: "Classroom Moment",
    },
];

const projectImages = [
    {
        src: "https://res.cloudinary.com/dcxadfbih/image/upload/v1768675134/img4_vkibzm.jpg"
        // title: "Project Showcase",
    },
];

const allImages = [...workshopImages, ...classImages, ...projectImages];

const OurGallery: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const closePopup = () => setSelectedIndex(null);

    const nextImage = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex + 1) % allImages.length);
    };

    const prevImage = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex - 1 + allImages.length) % allImages.length);
    };

    const renderGrid = (images: typeof allImages, startIndex: number) =>
        images.map((img, index) => (
            <div
                key={index}
                onClick={() => setSelectedIndex(startIndex + index)}
                className="relative aspect-video w-full rounded-xl overflow-hidden cursor-pointer group bg-gray-900"
            >
                <img
                    src={img.src}
                    // alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white font-semibold text-lg text-center px-4">
                        {/* {img.title} */}
                    </span>
                </div>
            </div>
        ));

    return (
        <section id="our-gallery" className="py-20 bg-[rgb(var(--background))]">
            <div className="container mx-auto px-4">
                <AnimateOnScroll>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gradient mb-4">
                            Our Gallery
                        </h2>
                        <p className="text-[rgb(var(--foreground))]/70 max-w-2xl mx-auto">
                            A glimpse of our robotics, IoT projects, workshops, and events.
                        </p>
                    </div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                    <h3 className="text-2xl font-semibold mb-6">Workshop Memories</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderGrid(workshopImages, 0)}
                    </div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                    <h3 className="text-2xl font-semibold mt-12 mb-6">Classroom Moments</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderGrid(classImages, workshopImages.length)}
                    </div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                    <h3 className="text-2xl font-semibold mt-12 mb-6">Our Project Pictures</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderGrid(
                            projectImages,
                            workshopImages.length + classImages.length
                        )}
                    </div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                    <h3 className="text-2xl font-semibold mt-16 mb-6 text-[rgb(var(--foreground))]">
                        Video Gallery
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="w-full aspect-video rounded-xl overflow-hidden">
                            <iframe
                                className="w-full h-full"
                                src="https://res.cloudinary.com/dcxadfbih/video/upload/v1769332020/Vid1_sse2px.mp4"
                                title="Classroom video"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="w-full aspect-video rounded-xl overflow-hidden">
                            <iframe
                                className="w-full h-full"
                                // src="https://www.youtube.com/embed/9bZkp7q19f0"
                                title="YouTube video"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </AnimateOnScroll>
            </div>

            {selectedIndex !== null && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                    <button
                        onClick={closePopup}
                        className="absolute top-6 right-6 text-white text-3xl z-50 p-4"
                    >
                        ✕
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-6 text-white text-4xl z-50 p-4 hover:scale-110 transition-transform"
                    >
                        ‹
                    </button>

                    <div className="relative max-w-[90%] max-h-[80%] flex items-center justify-center">
                        <img
                            src={allImages[selectedIndex].src}
                            // alt={allImages[selectedIndex].title}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>

                    <button
                        onClick={nextImage}
                        className="absolute right-6 text-white text-4xl z-50 p-4 hover:scale-110 transition-transform"
                    >
                        ›
                    </button>
                </div>
            )}
        </section>
    );
};

export default OurGallery;
