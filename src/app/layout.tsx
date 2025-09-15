import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ACM FEUP",
	description: "Website for the ACM FEUP student chapter",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Analytics />
			<head>
				<meta name="apple-mobile-web-app-title" content="ACM FEUP" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/icon0.svg" type="image/svg+xml" />
				<link rel="apple-touch-icon" href="/apple-icon.png" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
