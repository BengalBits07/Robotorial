import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "../ui/Button";
import RobotHelper from "./RobotHelper";
import { ChevronDown } from "lucide-react";

const MOBILE_VIDEO =
	"https://res.cloudinary.com/dncj7tesy/video/upload/q_auto:low/v1745333648/pc65jbshkezy53vi2pz6.mp4";
const DESKTOP_VIDEO =
	"https://res.cloudinary.com/dncj7tesy/video/upload/q_auto:low/h_1000,w_2000/v1745923301/heroVideo_gkbyfn.mp4";
// Cloudinary can generate a poster frame from the video (first frame as jpg)
const MOBILE_POSTER =
	"https://res.cloudinary.com/dncj7tesy/video/upload/q_auto:low,so_0/v1745333648/pc65jbshkezy53vi2pz6.jpg";
const DESKTOP_POSTER =
	"https://res.cloudinary.com/dncj7tesy/video/upload/q_auto:low,so_0,h_1000,w_2000/v1745923301/heroVideo_gkbyfn.jpg";

const Hero: React.FC = () => {
	const heroRef = useRef<HTMLElement>(null);
	const textRef = useRef<HTMLHeadingElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isDesktop, setIsDesktop] = useState(true);
	const [videoPlaying, setVideoPlaying] = useState(false);

	// Detect screen size — only mount the correct video (CSS hidden prevents loading on mobile)
	useEffect(() => {
		const mql = window.matchMedia("(min-width: 768px)");
		setIsDesktop(mql.matches);

		const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	// Force-play helper
	const forcePlay = useCallback(() => {
		const video = videoRef.current;
		if (!video || videoPlaying) return;

		// Ensure muted (some browsers reset it)
		video.muted = true;

		video.play().then(() => {
			setVideoPlaying(true);
		}).catch(() => {
			// Still blocked — poster image is always visible as fallback
		});
	}, [videoPlaying]);

	// Attempt autoplay on mount + retry on first user interaction (touch/scroll/click)
	useEffect(() => {
		// Try immediately
		forcePlay();

		// Also try when video metadata is ready
		const video = videoRef.current;
		if (video) {
			const onCanPlay = () => forcePlay();
			video.addEventListener("canplay", onCanPlay);

			// Track playing state
			const onPlaying = () => setVideoPlaying(true);
			video.addEventListener("playing", onPlaying);

			return () => {
				video.removeEventListener("canplay", onCanPlay);
				video.removeEventListener("playing", onPlaying);
			};
		}
	}, [forcePlay, isDesktop]);

	// On mobile, autoplay often requires a user gesture — listen for first interaction
	useEffect(() => {
		if (videoPlaying) return;

		const onInteraction = () => {
			forcePlay();
		};

		const events = ["touchstart", "touchend", "scroll", "click", "pointerdown"];
		events.forEach((evt) => document.addEventListener(evt, onInteraction, { once: false, passive: true }));

		return () => {
			events.forEach((evt) => document.removeEventListener(evt, onInteraction));
		};
	}, [forcePlay, videoPlaying]);

	// Pause video when scrolled out of view (saves resources on mobile)
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					video.play().catch(() => {});
				} else {
					video.pause();
				}
			},
			{ threshold: 0.1 }
		);

		observer.observe(video);
		return () => observer.disconnect();
	}, [isDesktop]);

	// Parallax mouse effect (desktop only)
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
				textRef.current.style.transform = `translate(${x * -10}px, ${
					y * -10
				}px)`;
			}
		};

		document.addEventListener("mousemove", handleMouseMove);
		return () => document.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const scrollToProjects = () => {
		document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
	};

	const videoSrc = isDesktop ? DESKTOP_VIDEO : MOBILE_VIDEO;
	const posterSrc = isDesktop ? DESKTOP_POSTER : MOBILE_POSTER;

	return (
		<section
			ref={heroRef}
			id="home"
			className="relative min-h-screen flex items-center justify-center overflow-hidden"
			style={{
				backgroundPosition: "calc(50% + var(--x, 0)) calc(50% + var(--y, 0))",
			}}
		>
			{/* Tech Background with animated gradient */}
			<div className="absolute inset-0 circuit-bg"></div>
			{/* Animated gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--background),0.7)] via-transparent to-[rgb(var(--background))]"></div>
			{/* Particle effect overlay */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage:
						"radial-gradient(rgba(var(--primary), 0.1) 1px, transparent 1px)",
					backgroundSize: "50px 50px",
				}}
			></div>
			{/* Robot helpers */}
			<RobotHelper
				position="right"
				variant="small"
				className="top-32 animate-bounce"
				message="Welcome to Bengal Bits!"
			/>
			<RobotHelper position="left" variant="small" className="top-[40%]" />

			{/* Dark overlay */}
			<div className="absolute w-screen h-screen bg-gray-900 bg-opacity-55 z-10"></div>

			{/* Background video container — poster image always visible behind video */}
			<div
				className="absolute inset-0 z-0"
				style={{
					backgroundColor: "#111827",
					backgroundImage: `url(${posterSrc})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				{/* Single video — only the correct one for screen size is mounted */}
				<video
					key={videoSrc} // remount when source changes
					ref={videoRef}
					autoPlay
					loop
					muted
					playsInline
					preload="auto"
					poster={posterSrc}
					className="w-full h-full object-cover"
					style={{
						opacity: videoPlaying ? 1 : 0,
						transition: "opacity 0.6s ease-in",
					}}
				>
					<source src={videoSrc} type="video/mp4" />
				</video>
			</div>

			<div className="container mx-auto px-4 z-10 text-center">
				<div className="max-w-3xl mx-auto">
					<h1
						ref={textRef}
						className="text-5xl md:text-7xl font-bold mb-6 transition-transform duration-300 ease-out"
					>
						<span className="text-gradient">Robotorial!</span>
						<br />
						<span className="text-[rgb(var(--foreground))]">
							Future in Motion
						</span>
					</h1>

					<p className="text-xl mb-8 text-[rgb(var(--foreground))]/80 max-w-xl mx-auto">
						Pioneering the next generation of intelligent robotics systems that
						reshape industries and enhance human capabilities.
					</p>

					<div className="flex justify-center">
						<a
							href="https://forms.gle/6Ccgp2iqodxVhiXv8"
							target="_blank"
						>
							<Button size="lg">Ask a Query</Button>
						</a>
					</div>
				</div>
			</div>
			{/* Scroll down indicator */}
			<div className="absolute z-10 bottom-8 left-1/2 transform -translate-x-1/2 text-center">
				<button
					onClick={scrollToProjects}
					className="animate-bounce flex flex-col items-center text-[rgb(var(--foreground))]/60 hover:text-[rgb(var(--primary))] transition-colors"
				>
					<span className="text-sm mb-2">Discover Our Projects</span>
					<ChevronDown />
				</button>
			</div>
		</section>
	);
};


export default Hero;

