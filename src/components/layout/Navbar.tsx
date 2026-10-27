import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "../ui/Link";

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navItems = [
		{ label: "Home", link: "#home" },
		{ label: "Projects", link: "#projects" },
		{ label: "Our Gallery", link: "#our-gallery" },
		{ label: "Technology", link: "#technology" },
		{ label: "About Us", link: "#team-testimonials" }, // ✅ FIXED
		{ label: "Contact", link: "#contact" },
	];

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-[rgb(var(--background))]/90 backdrop-blur-lg shadow-lg shadow-black/10"
					: "bg-transparent"
			}`}
		>
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-20">
					<div className="flex items-center gap-2">
						<div className="relative">
							<img
								src="https://res.cloudinary.com/dncj7tesy/image/upload/v1745911137/image-removebg-preview_dffqnq.png"
								className="h-12 w-12"
							/>
							<div className="absolute -top-1 -right-1 h-3 w-3 bg-[rgb(var(--accent))] rounded-full animate-pulse"></div>
						</div>
						<span className="text-3xl font-bold text-[#67D8E7]">
							BengalBits
						</span>
					</div>

					<div className="hidden md:flex space-x-8">
						{navItems.map((item) => (
							<Link
								key={item.label}
								href={item.link}
								className={`py-2 px-4 text-sm font-medium relative overflow-hidden group ${
									scrolled
										? "text-[rgb(var(--foreground))]"
										: "text-[rgb(var(--foreground))]/90"
								}`}
							>
								<span className="relative z-10">{item.label}</span>
								<span className="absolute bottom-0 left-0 w-full h-[2px] bg-[rgb(var(--primary))] transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
							</Link>
						))}
					</div>

					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden bg-[rgb(var(--surface))] p-2 rounded-full"
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					>
						{isMenuOpen ? (
							<X className="h-6 w-6 text-[rgb(var(--foreground))]" />
						) : (
							<Menu className="h-6 w-6 text-[rgb(var(--foreground))]" />
						)}
					</button>
				</div>
			</div>

			<div
				className={`md:hidden transition-all duration-300 glass ${
					isMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
				} overflow-hidden`}
			>
				<div className="px-4 py-4 space-y-4">
					{navItems.map((item) => (
						<Link
							key={item.label}
							href={item.link}
							className="block py-2 px-4 text-[rgb(var(--foreground))]/80 hover:text-[rgb(var(--primary))] transition-colors rounded-lg glass hover:bg-white/10"
							onClick={() => setIsMenuOpen(false)}
						>
							{item.label}
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
