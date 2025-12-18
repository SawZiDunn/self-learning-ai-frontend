"use client";

import { useState, useEffect } from "react";
import {
    Settings,
    History,
    Upload,
    Loader2,
    Save,
    Eye,
    ArrowLeft,
} from "lucide-react";
import {
    getPrompt,
    getPromptHistory,
    improveAIManually,
    trainAI,
} from "@/lib/api";
import Link from "next/link";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<
        "prompt" | "history" | "train"
    >("prompt");
    const [currentPrompt, setCurrentPrompt] = useState("");
    const [instructions, setInstructions] = useState("");
    const [promptHistory, setPromptHistory] = useState<any[]>([]);
    const [trainingData, setTrainingData] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        loadPrompt();
        loadPromptHistory();
    }, []);

    const loadPrompt = async () => {
        try {
            const data = await getPrompt();
            setCurrentPrompt(data.prompt || "");
        } catch (error) {
            console.error("Failed to load prompt:", error);
        }
    };

    const loadPromptHistory = async () => {
        try {
            const data = await getPromptHistory();
            setPromptHistory(data.history || []);
        } catch (error) {
            console.error("Failed to load prompt history:", error);
        }
    };

    const handleManualImprove = async () => {
        if (!instructions.trim()) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await improveAIManually(instructions);
            setCurrentPrompt(result.updatedPrompt);
            setInstructions("");
            setMessage({
                type: "success",
                text: "AI prompt updated successfully!",
            });
            await loadPromptHistory();
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update prompt" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTrain = async () => {
        if (!trainingData.trim()) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const conversationData = JSON.parse(trainingData);
            await trainAI(conversationData);
            setTrainingData("");
            setMessage({
                type: "success",
                text: "AI trained successfully!",
            });
            await loadPrompt();
            await loadPromptHistory();
        } catch (error) {
            setMessage({
                type: "error",
                text: "Failed to train AI. Check JSON format.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Chat
                    </Link>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        AI Admin Panel
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage and improve your self-learning AI assistant
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab("prompt")}
                        className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
                            activeTab === "prompt"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <Settings className="w-4 h-4" />
                        Prompt Manager
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
                            activeTab === "history"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <History className="w-4 h-4" />
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab("train")}
                        className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
                            activeTab === "train"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <Upload className="w-4 h-4" />
                        Train AI
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-xl ${
                            message.type === "success"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Prompt Manager Tab */}
                {activeTab === "prompt" && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Current AI Prompt
                        </h2>
                        <div className="mb-6">
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Active Prompt
                                    </span>
                                </div>
                                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                                    {currentPrompt || "Loading..."}
                                </pre>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Manual Improvement
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Provide instructions to improve the AI's behavior
                        </p>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="e.g., Be more concise. Always mention appointment booking proactively."
                            className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white mb-4"
                        />
                        <button
                            onClick={handleManualImprove}
                            disabled={!instructions.trim() || isLoading}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            Update Prompt
                        </button>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                            Prompt Evolution History
                        </h2>
                        {promptHistory.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">
                                No history available yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {promptHistory.map((entry, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Version {entry.version || index + 1}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {entry.timestamp
                                                    ? new Date(
                                                          entry.timestamp
                                                      ).toLocaleString()
                                                    : "Unknown date"}
                                            </span>
                                        </div>
                                        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                            {entry.prompt}
                                        </pre>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Train Tab */}
                {activeTab === "train" && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Train AI on Sample Data
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Paste conversation data in JSON format from
                            conversations.json
                        </p>
                        <textarea
                            value={trainingData}
                            onChange={(e) => setTrainingData(e.target.value)}
                            placeholder='{"conversations": [...]}'
                            className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white mb-4 font-mono text-sm"
                        />
                        <button
                            onClick={handleTrain}
                            disabled={!trainingData.trim() || isLoading}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                            Train AI
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
