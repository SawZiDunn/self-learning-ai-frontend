import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Issa Compass AI Assistant",
    description: "Self-learning AI chatbot for visa consultation",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
