export type ChatRole = "user" | "assistant";

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    createdAt: number;
}

export interface ChatUsageInfo {
    modelName: string;
    dailyLimit: number;
    dailyUsed: number;
    usagePercentage: number;
}
