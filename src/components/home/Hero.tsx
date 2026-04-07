import React, { useEffect, useRef } from "react";
import { Button } from "../ui/Button";
import RobotHelper from "./RobotHelper";
import { ChevronDown } from "lucide-react";

const Hero: React.FC = () => {
    const heroRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!heroRef.current) return;

            const { clientX, clientY } = e;
            const { width, height } = heroRef.current.getBoundingClientRect();

            const x = (clientX / width - 0.5) * 2;
            const y = (clientY / height - 0.5) * 2;

            heroRef.current.style.setProperty("--x", `${x * 5}px`);
            heroRef.current.style.setProperty("--y", `${y * 5}px`);

            if (textRef.current) {
                textRef.current.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => document.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const scrollToProjects = () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            ref={heroRef}
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
        >
            {/* Background Video Container */}
            <div className="absolute inset-0 z-0 w-full h-full">
                {/* Mobile Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute w-full h-full object-cover block md:hidden"
                    poster="https://res.cloudinary.com/dncj7tesy/image/upload/v1745333648/pc65jbshkezy53vi2pz6.jpg"
                >
                    <source src="https://res.cloudinary.com/dcxadfbih/video/upload/v1771250084/heroVideo_gkbyfn_uxgod0.mp4" type="video/mp4" />
                </video>

                {/* Desktop Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute w-full h-full object-cover hidden md:block"
                >
                    <source src="https://res.cloudinary.com/dcxadfbih/video/upload/v1771250084/heroVideo_gkbyfn_uxgod0.mp4" type="video/mp4" />
                </video>

                {/* Lightened Overlay: Changed from bg-gray-900/60 to bg-black/30 for clarity */}
                <div className="absolute inset-0 bg-black/30 z-[1]"></div>
            </div>

            {/* Decorative Overlays - Lowered Opacity to show video clearly */}
            <div className="absolute inset-0 z-[1] circuit-bg opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>

            {/* Content */}
            <div className="container mx-auto px-4 z-10 text-center">
                <RobotHelper
                    position="right"
                    variant="small"
                    className="top-32 animate-bounce"
                    message="Welcome to Bengal Bits!"
                />
                <RobotHelper position="left" variant="small" className="top-[40%]" />

                <div className="max-w-3xl mx-auto mt-12">
                    <h1
                        ref={textRef}
                        className="text-5xl md:text-7xl font-bold mb-6 transition-transform duration-300 ease-out text-white drop-shadow-2xl"
                    >
                        <span className="text-blue-500">Robotorial!</span>
                        <br />
                        <span>Future in Motion</span>
                    </h1>

                    <p className="text-xl mb-8 text-white/90 max-w-xl mx-auto drop-shadow-md">
                        Pioneering the next generation of intelligent robotics systems that
                        reshape industries and enhance human capabilities.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSeSqRQe3P7xY9lPg8iN_Fk0z20sYK-Il7ETX6VZMSP2GwGWZg/viewform" target="_blank" rel="noreferrer">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">Student Enrollment Form</Button>
                        </a>
                        {/* <a href="https://docs.google.com/forms/d/e/1FAIpQLSeSqRQe3P7xY9lPg8iN_Fk0z20sYK-Il7ETX6VZMSP2GwGWZg/viewform" target="_blank" rel="noreferrer">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">School Enrollment Form</Button>
                        </a> */}
                    </div>
                </div>
            </div>

            <div className="absolute z-10 bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                <button
                    onClick={scrollToProjects}
                    className="animate-bounce flex flex-col items-center text-white/70 hover:text-blue-400 transition-colors"
                >
                    <span className="text-sm mb-2">Discover Our Projects</span>
                    <ChevronDown />
                </button>
            </div>
        </section>
    );
};

export default Hero;
