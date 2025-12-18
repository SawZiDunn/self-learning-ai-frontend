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

export async function getPrompt() {
    try {
        const response = await api.get("/prompt");
        return response.data;
    } catch (error: any) {
        console.error("Get prompt error:", error);
        throw new Error("Failed to get prompt");
    }
}

export async function getPromptHistory() {
    try {
        const response = await api.get("/prompt-history");
        return response.data;
    } catch (error: any) {
        console.error("Get prompt history error:", error);
        throw new Error("Failed to get prompt history");
    }
}

export async function improveAI(
    clientSequence: string,
    chatHistory: ChatMessage[],
    consultantReply: string
) {
    try {
        const response = await api.post("/improve-ai", {
            clientSequence,
            chatHistory,
            consultantReply,
        });
        return response.data;
    } catch (error: any) {
        console.error("Improve AI error:", error);
        throw new Error("Failed to improve AI");
    }
}

export async function improveAIManually(instructions: string) {
    try {
        const response = await api.post("/improve-ai-manually", {
            instructions,
        });
        return response.data;
    } catch (error: any) {
        console.error("Manual improve error:", error);
        throw new Error("Failed to manually improve AI");
    }
}

export async function trainAI(conversationData: any) {
    try {
        const response = await api.post("/train", conversationData);
        return response.data;
    } catch (error: any) {
        console.error("Train AI error:", error);
        throw new Error("Failed to train AI");
    }
}
