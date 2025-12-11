import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider as _ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
	title: "Gridly",
	description: "Spreadsheets Reimagined",
};

export default function RootLayout({ children }) {
	return (
		<_ClerkProvider>
			<html lang="en">
				<body className={inter.className}>{children}</body>
			</html>
		</_ClerkProvider>
	);
}
