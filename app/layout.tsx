import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-poppins',
});

export const metadata: Metadata = {
	title: 'DocBox',
	description:
		'A cloud storage hub designed for seamless file organization, sharing, and collaboration in one central space',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${poppins.variable} font-poppins antialiased`}>
				{children}
			</body>
		</html>
	);
}
