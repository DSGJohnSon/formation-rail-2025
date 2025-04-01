export type Question = {
    id: number;
    type: string;
    category: string;
    question: string;
    options?: string[];
    image_url?: string;
    correct_answer: string[];
    explanation: string;
}