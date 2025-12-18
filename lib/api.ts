import axios from "axios";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://web-production-ca44a.up.railway.app";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

interface ChatMessage {
    role: string;
    message: string;
}

export async function sendMessage(
    message: string,
    chatHistory: ChatMessage[] = []
) {
    try {
        const response = await api.post("/generate-reply", {
            clientSequence: message,
            chatHistory: chatHistory,
        });

        return response.data.aiReply;
    } catch (error) {
        console.error("API Error:", error);
        throw new Error("Failed to get response from AI");
    }
}

export async function checkHealth() {
    try {
        const response = await api.get("/health");
        return response.data;
    } catch (error) {
        console.error("Health check failed:", error);
        return null;
    }
}
