import axios from "axios";

// Use Next.js API route to avoid CORS issues
const api = axios.create({
    baseURL: "/api",
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
        const response = await api.post("/chat", {
            clientSequence: message,
            chatHistory: chatHistory,
        });

        return response.data.aiReply;
    } catch (error: any) {
        console.error("API Error:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
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
