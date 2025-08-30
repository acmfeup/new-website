import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Blocks,
	Bot,
	Brain,
	CalendarDays,
	Code,
	Megaphone,
	Palette,
	Shield,
	Wrench,
} from "lucide-react";
import Image from "next/image";

interface Department {
	name: string;
	description: string;
	icon: React.ComponentType<any>;
}

const departments: Department[] = [
	{
		name: "Events",
		description:
			"Organize talks, workshops, and networking opportunities for students.",
		icon: CalendarDays,
	},
	{
		name: "Marketing & Design",
		description:
			"Manages design, branding and promotion of our activities, as well as our social media presence.",
		icon: Palette,
	},
	{
		name: "Competitive Programming",
		description: "Train and prepare students for programming competitions.",
		icon: Code,
	},
	{
		name: "Cybersecurity",
		description:
			"Solve security challenges and promote cybersecurity awareness.",
		icon: Shield,
	},
	{
		name: "Blockchain & Web3",
		description:
			"Explores decentralized technologies, smart contracts and blockchain innovation.",
		icon: Blocks,
	},
	{
		name: "Artificial Intelligence",
		description: "Dedicaated to AI, machine learning and data-driven projects.",
		icon: Brain,
	},
	{
		name: "Development",
		description:
			"Builds and maintains our website and other software projects.",
		icon: Wrench,
	},
	{
		name: "Robotics",
		description:
			"Designs, builds and programs robots for various competitions and projects.",
		icon: Bot,
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			<section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
					style={{ backgroundImage: "url(porto.png)" }}
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60" />

				<div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
					<div className="max-w-4xl mx-auto space-y-8">
						<div className="w-24 h-24 mx-auto bg-primary-foreground/20 rounded-full flex items-center justify-center mb-8">
							<Code className="w-12 h-12 text-primary-foreground" />
						</div>

						<h1 className="text-4xl md:text-6xl font-bold text-balance">
							Welcome to ACM FEUP
						</h1>

						<p className="text-xl md:text-2xl text-primary-foreground/90 text-pretty max-w-2xl mx-auto">
							The student organization for computing and technology at FEUP.
							Connect with like-minded students, develop your skills, and shape
							the future of tech.
						</p>

						<div className="pt-8">
							<Button
								size={"lg"}
								className="bg-background hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								asChild
							>
								<a href="#" target="_blank" rel="noopener noreferrer">
									Join Us
								</a>
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section className="py-20 bg-background">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
							Our Departments
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl  mx-auto text-pretty">
							Explore our diverse departments and find your passion in
							technology. Each department offers unique opportunities to learn,
							collaborate, and innovate.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{departments.map((dept, index) => {
							const IconComponent = dept.icon;
							return (
								<Card
									key={index}
									className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border hover:border-primary/20"
								>
									<CardHeader className="text-center pb-4">
										<div className="w-16 h-16 mx-auto bg-primary/10  rounded-full flex items-center justify-center mb-4  group-hover:bg-primary/20 transition-colors duration-300">
											<IconComponent />
										</div>
										<CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
											{dept.name}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-center text-muted-foreground leading-relaxed">
											{dept.description}
										</CardDescription>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			{/* Footer */}

			<footer className="bg-primary text-primary-foreground py-12">
				<div className="container mx-auto px-4">
					<div className="text-center space-y-4">
						<div className="flex items-center justify-center space-x-2 mb-6">
							<Code className="w-8 h-8" />
							<span className="text-2xl font-bold">ACM FEUP</span>
						</div>
						<p className="text-primary-foreground/80 max-w-md mx-auto">
							Association for Computing Machinery at Faculdade de Engenharia da
							Universidade do Porto
						</p>
						<div className="pt-4 border-t border-primary-foreground/20">
							<p className="text-sm text-primary-foreground/60">
								&copy; {new Date().getFullYear()} ACM FEUP. All rights reserved.
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
