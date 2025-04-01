"use client";
import { Question } from "@/types/types";
import MultipleChoiceQuestion from "./MultipleChoixeQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import ImageNamingQuestion from "./ImageNamingQuestion";
import SortableQuestion from "./SortableQuestion";

export default function QuestionDisplay({
    question,
    showExplanation,
    setShowExplanation,
    onNextQuestion, // Add this prop
}: {
    question: Question | null;
    showExplanation: boolean;
    setShowExplanation: (show: boolean) => void;
    onNextQuestion: () => void; // Add this type
}) {
    if (!question) return null; // Ne pas afficher si aucune question n'est fournie

    return (
        <div className="w-full max-w-xl bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-slate-900">{question.question}</h2>
            
            {question.type === "multiple-choice" && (
                <MultipleChoiceQuestion question={question} setShowExplanation={setShowExplanation} />
            )}
            {question.type === "true-false" && (
                <TrueFalseQuestion question={question} setShowExplanation={setShowExplanation} />
            )}
            {question.type === "image-naming" && (
                <ImageNamingQuestion
                    question={question}
                    setShowExplanation={setShowExplanation}
                    onNextQuestion={onNextQuestion} // Pass the prop here
                />
            )}
            {question.type === "sortable" && (
                <SortableQuestion question={question} setShowExplanation={setShowExplanation} />
            )}

            {showExplanation && (
                <p className="mt-4 text-gray-600">{question.explanation}</p>
            )}
        </div>
    );
}