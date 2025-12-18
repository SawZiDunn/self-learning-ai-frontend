"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { sendMessage, improveAI } from "@/lib/api";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    feedback?: "good" | "bad" | null;
    userMessage?: string;
    chatHistoryAtTime?: any[];
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi there! I'm your DTV visa assistant. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Prepare chat history for API
            const chatHistory = messages.map((msg) => ({
                role: msg.role === "user" ? "client" : "consultant",
                message: msg.content,
            }));

            const response = await sendMessage(input.trim(), chatHistory);

            const assistantMessage: Message = {
                role: "assistant",
                content: response,
                timestamp: new Date(),
                feedback: null,
                userMessage: input.trim(),
                chatHistoryAtTime: chatHistory,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFeedback = async (
        index: number,
        feedback: "good" | "bad",
        betterReply?: string
    ) => {
        const message = messages[index];
        if (message.role !== "assistant") return;

        // Update UI immediately
        setMessages((prev) =>
            prev.map((msg, i) =>
                i === index ? { ...msg, feedback } : msg
            )
        );

        // If bad feedback, trigger AI improvement
        if (feedback === "bad" && betterReply && message.userMessage) {
            try {
                await improveAI(
                    message.userMessage,
                    message.chatHistoryAtTime || [],
                    betterReply
                );
                console.log("AI improved based on feedback");
            } catch (error) {
                console.error("Failed to improve AI:", error);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-3 ${
                            message.role === "user" ? "flex-row-reverse" : ""
                        }`}
                    >
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                message.role === "user"
                                    ? "bg-blue-500"
                                    : "bg-indigo-500"
                            }`}
                        >
                            {message.role === "user" ? (
                                <User className="w-5 h-5 text-white" />
                            ) : (
                                <Bot className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div
                            className={`flex-1 max-w-[75%] ${
                                message.role === "user" ? "text-right" : ""
                            }`}
                        >
                            <div
                                className={`inline-block p-4 rounded-2xl ${
                                    message.role === "user"
                                        ? "bg-blue-500 text-white rounded-tr-none"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none"
                                }`}
                            >
                                <p className="whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1 px-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                {message.role === "assistant" && (
                                    <div className="flex gap-1 ml-2">
                                        <button
                                            onClick={() =>
                                                handleFeedback(index, "good")
                                            }
                                            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                                                message.feedback === "good"
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            }`}
                                            title="Good response"
                                        >
                                            <ThumbsUp className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const betterReply = prompt(
                                                    "What would be a better response?"
                                                );
                                                if (betterReply) {
                                                    handleFeedback(
                                                        index,
                                                        "bad",
                                                        betterReply
                                                    );
                                                }
                                            }}
                                            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                                                message.feedback === "bad"
                                                    ? "text-red-600"
                                                    : "text-gray-400"
                                            }`}
                                            title="Bad response - provide better one"
                                        >
                                            <ThumbsDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl rounded-tl-none">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about DTV visa requirements..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Powered by Self-Learning AI
                </p>
            </div>
        </div>
    );
}
