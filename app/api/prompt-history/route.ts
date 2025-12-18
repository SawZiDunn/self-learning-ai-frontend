import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://web-production-ca44a.up.railway.app";

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/prompt-history`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Backend responded with status: ${response.status}`
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json(
            { error: "Failed to fetch prompt history from backend" },
            { status: 500 }
        );
    }
}
