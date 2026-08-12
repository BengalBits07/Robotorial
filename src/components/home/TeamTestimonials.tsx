import React, { useState, useEffect } from "react";
import {
	Github,
	Linkedin,
	Twitter,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import AnimateOnScroll from "../AnimateOnScroll";

interface TeamMember {
	id: number;
	name: string;
	position: string;
	image: string;
	testimonial: string;
	social: {
		github?: string;
		linkedin?: string;
		twitter?: string;
	};
}

const teamMembers: TeamMember[] = [
	{
		id: 1,
		name: "Gouranga Mondal",
		position: "CEO",
		image:
			"https://res.cloudinary.com/dituo1ww5/image/upload/v1745923587/IMG_20250422_111404_td3zba.jpg",
		testimonial:
			"As the CEO, I take pride in leading a visionary team dedicated to shaping the future of robotics and AI with integrity.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
	{
		id: 2,
		name: "Arup Banerjee",
		position: "Chief Technical Officer & Student Mentor",
		image:
			"https://res.cloudinary.com/dituo1ww5/image/upload/v1745923586/arup_dclzth.jpg",
		testimonial:
			"At Bengal Bits, our focus on technical excellence drives innovative solutions that redefine what's possible in automation.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
	{
		id: 3,
		name: "Pritam Panja",
		position: "Chief Technical Officer & Web Developer",
		image:
			"https://res.cloudinary.com/dcxadfbih/image/upload/v1773239052/pp2_k5yc9q.jpg",
		testimonial:
			"Leading the technical vision and empowering our team to build innovative and meaningful solutions is what drives me every day.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
	{
		id: 4,
		name: "Tanisha Seal",
		position: "Student Mentor",
		image:
			"https://res.cloudinary.com/dcxadfbih/image/upload/v1780766846/Tanisha_qixo9z.jpg",
		testimonial:
			"Supporting our customers is at the heart of what we do. Ensuring their satisfaction fuels our growth and success.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
	{
		id: 5,
		name: "Samapti Gun",
		position: "Student Mentor",
		image:
			"https://res.cloudinary.com/dcxadfbih/image/upload/v1773663521/SG_pj0srs.jpg",
		testimonial:
			"Helping students learn, explore, and grow through practical knowledge is what makes teaching truly rewarding.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
	{
		id: 6,
		name: "Sachi Riya",
		position: "Student Mentor",
		image:
			"https://res.cloudinary.com/dcxadfbih/image/upload/v1773238217/SR_alqv1k.jpg",
		testimonial:
			"Our goal is to support students, encourage curiosity, and help them build skills that shape their future.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
	{
		id: 7,
		name: "Kriti Gupta",
		position: "Student Mentor",
		image:
			"https://res.cloudinary.com/dcxadfbih/image/upload/v1773238433/KG_xqi732.jpg",
		testimonial:
			"Supporting students in their learning journey and watching them achieve their goals is incredibly inspiring.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
	{
		id: 8,
		name: "Prithwi Biswas",
		position: "Management Head",
		image:
			"https://res.cloudinary.com/dcxadfbih/image/upload/v1780766124/PB_vsadrw.jpg",
		testimonial:
			"Ensures every Robotorial initiative is planned, coordinated, and executed smoothly from concept to completion.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
	{
		id: 9,
		name: "Tanya Singh",
		position: "Social Media Lead",
		image:
			"https://res.cloudinary.com/dcxadfbih/image/upload/v1780766851/TS_gq77g1.jpg",
		testimonial:
			"Builds Robotorial's digital presence by engaging the community and showcasing our innovations to a wider audience.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
	{
		id: 10,
		name: "Shreyoshi Bodhak",
		position: "Course Designer",
		image:
			"https://res.cloudinary.com/dcxadfbih/image/upload/v1773731486/SB_wmajlz.jpg",
		testimonial:
			"Helping students learn, explore, and grow through practical knowledge is what makes teaching truly rewarding.",
		social: {
			github: "https://github.com",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
		},
	},
];

const TeamTestimonials: React.FC = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const nextSlide = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
	};

	const prevSlide = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentIndex(
			(prev) => (prev - 1 + teamMembers.length) % teamMembers.length
		);
	};

	useEffect(() => {
		const timer = setInterval(nextSlide, 8000);
		return () => clearInterval(timer);
	}, []);

	const handleTransitionEnd = () => {
		setIsAnimating(false);
	};

	return (
		<section id="team-testimonials" className="py-20 relative overflow-hidden">
			<div className="absolute inset-0 circuit-bg opacity-30"></div>
			<div className="container mx-auto px-4 relative">
				<AnimateOnScroll>
					<h2 className="text-4xl font-bold text-center mb-4 text-gradient">
						Our Team
					</h2>
					<p className="text-[rgb(var(--foreground))]/70 text-center mb-16 max-w-2xl mx-auto">
						Meet the brilliant minds behind Bengal Bits, driving innovation and
						shaping the future of technology.
					</p>
				</AnimateOnScroll>

				<div className="max-w-6xl mx-auto relative">
					<div className="relative h-[600px] overflow-hidden">
						{teamMembers.map((member, index) => (
							<div
								key={member.id}
								className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-out flex items-center
                  ${
										index === currentIndex
											? "opacity-100 translate-x-0"
											: index < currentIndex
											? "opacity-0 -translate-x-full"
											: "opacity-0 translate-x-full"
									}`}
								onTransitionEnd={handleTransitionEnd}
							>
								<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
									<div className="relative group">
										<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
										<img
											src={member.image}
											alt={member.name}
											className="w-full h-[400px] object-cover rounded-3xl shadow-xl"
										/>
									</div>

									<div className="space-y-6">
										<div className="space-y-2">
											<h3 className="text-3xl font-bold text-gradient">
												{member.name}
											</h3>
											<p className="text-xl text-[rgb(var(--foreground))]/70">
												{member.position}
											</p>
										</div>

										<blockquote className="text-lg italic text-[rgb(var(--foreground))]/80 border-l-4 border-[rgb(var(--primary))] pl-6">
											"{member.testimonial}"
										</blockquote>

										{/* <div className="flex gap-4">
											{member.social.github && (
												<a
													href={member.social.github}
													target="_blank"
													rel="noopener noreferrer"
													className="p-3 rounded-full bg-[rgb(var(--surface))] hover:bg-[rgb(var(--primary))]/10 transition-colors"
												>
													<Github className="w-6 h-6" />
												</a>
											)}
											{member.social.linkedin && (
												<a
													href={member.social.linkedin}
													target="_blank"
													rel="noopener noreferrer"
													className="p-3 rounded-full bg-[rgb(var(--surface))] hover:bg-[rgb(var(--primary))]/10 transition-colors"
												>
													<Linkedin className="w-6 h-6" />
												</a>
											)}
											{member.social.twitter && (
												<a
													href={member.social.twitter}
													target="_blank"
													rel="noopener noreferrer"
													className="p-3 rounded-full bg-[rgb(var(--surface))] hover:bg-[rgb(var(--primary))]/10 transition-colors"
												>
													<Twitter className="w-6 h-6" />
												</a>
											)}
										</div> */}
									</div>
								</div>
							</div>
						))}
					</div>

					<button
						onClick={prevSlide}
						className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[rgb(var(--surface))] hover:bg-[rgb(var(--primary))]/10 transition-colors z-10"
						aria-label="Previous team member"
					>
						<ChevronLeft className="w-6 h-6" />
					</button>

					<button
						onClick={nextSlide}
						className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[rgb(var(--surface))] hover:bg-[rgb(var(--primary))]/10 transition-colors z-10"
						aria-label="Next team member"
					>
						<ChevronRight className="w-6 h-6" />
					</button>

					<div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
						{teamMembers.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${
									index === currentIndex
										? "bg-[rgb(var(--primary))] w-8"
										: "bg-[rgb(var(--foreground))]/30 hover:bg-[rgb(var(--foreground))]/50"
								}`}
								aria-label={`Go to team member ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default TeamTestimonials;
