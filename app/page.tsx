import ChatInterface from "@/components/ChatInterface";
import Link from "next/link";
import { Settings } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-8 relative">
                        <Link
                            href="/admin"
                            className="absolute right-0 top-0 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Admin Panel
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            🧭 Issa Compass AI Assistant
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Self-learning AI chatbot for Thai DTV visa
                            consultation
                        </p>
                    </header>

                    <ChatInterface />
                </div>
            </div>
        </main>
    );
}
