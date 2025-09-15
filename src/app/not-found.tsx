import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-primary">
			<div className="text-center space-y-8 max-w-md mx-auto">
				<div className="space-y-4">
					<h1 className="text-8xl font-bold text-white/20 select-none">404</h1>
					<div className="space-y-2">
						<h2 className="text-3xl font-bold text-white">Page Not Found</h2>
						<p className="text-white/80 text-lg">
							Looks like this page got lost in the code!
						</p>
					</div>
				</div>

				<div className="space-y-4">
					<div className="h-16 sm:h-32 mx-auto flex items-center justify-center mb-2">
						<Image
							src="/acm_white_large_logo.png"
							alt="ACM Logo"
							width={200}
							height={64}
							className="block"
						/>
					</div>
					<p className="text-white/60">
						The page you're looking for doesn't exist, but our community does!
					</p>
				</div>

				<div className="space-y-4">
					<Link href="/">
						<Button
							size="lg"
							className="bg-white text-[#002F6C] hover:bg-white/90 font-semibold px-8"
						>
							Back to Home
						</Button>
					</Link>
					<div className="text-white/40 text-sm mt-2">
						or check out our{" "}
						<a
							href="https://instagram.com/acmfeup"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white/60 hover:text-white underline transition-colors"
						>
							Instagram
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
