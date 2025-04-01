"use client";
import { Question } from "@/types/types";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { LucideCheck, LucideX } from "lucide-react";
import confetti from "canvas-confetti";

export default function MultipleChoiceQuestion({
    question,
    setShowExplanation,
}: {
    question: Question;
    setShowExplanation: (show: boolean) => void;
}) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [isValidated, setIsValidated] = useState(false);

    useEffect(() => {
        if (question.options) {
            setShuffledOptions([...question.options].sort(() => Math.random() - 0.5));
            setSelectedOptions([]); // Reset selection when question changes
            setIsValidated(false);
        }
    }, [question]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && !isValidated) {
                handleSubmit();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isValidated]);

    const handleSelect = (option: string) => {
        if (isValidated) return; // Empêcher de changer après validation
        setSelectedOptions((prev) =>
            prev.includes(option)
                ? prev.filter((o) => o !== option)
                : [...prev, option]
        );
    };

    const handleSubmit = () => {
        setIsValidated(true);
        setShowExplanation(true);

        // Vérification si la réponse est parfaite
        const correctAnswers = question.correct_answer;
        const hasAllCorrect = correctAnswers.every((answer) =>
            selectedOptions.includes(answer)
        );
        const hasNoWrongSelection = selectedOptions.every((option) =>
            correctAnswers.includes(option)
        );

        if (hasAllCorrect && hasNoWrongSelection) {
            confetti({
                particleCount: 20,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: ["#ff0", "#0f0", "#00f"],
            });
            confetti({
                particleCount: 20,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: ["#ff0", "#0f0", "#00f"],
            });
        }
    };

    const isCorrectAnswer = (option: string) =>
        question.correct_answer.includes(option);
    const isWronglySelected = (option: string) =>
        isValidated && selectedOptions.includes(option) && !isCorrectAnswer(option);
    const isMissedAnswer = (option: string) =>
        isValidated && !selectedOptions.includes(option) && isCorrectAnswer(option);

    return (
        <div>
            {shuffledOptions.map((option) => {
                let variant:
                    | "default"
                    | "success"
                    | "overline"
                    | "destructive"
                    | "secondary" = "secondary";

                if (isValidated) {
                    if (isCorrectAnswer(option) && selectedOptions.includes(option)) {
                        variant = "success"; // ✅ Bonne réponse sélectionnée
                    } else if (isWronglySelected(option)) {
                        variant = "overline"; // ❌ Mauvaise réponse sélectionnée
                    } else if (isMissedAnswer(option)) {
                        variant = "destructive"; // ❗ Réponse oubliée
                    }
                } else if (selectedOptions.includes(option)) {
                    variant = "default"; // 🎯 Option sélectionnée avant validation
                }

                return (
                    <Button
                        key={option}
                        onClick={() => handleSelect(option)}
                        variant={variant}
                        className={`mb-2 w-full flex items-center justify-between cursor-pointer ${
                            isWronglySelected(option) ? "line-through" : ""
                        }`}
                        disabled={isValidated} // Empêcher d'interagir après validation
                    >
                        {option}
                        {selectedOptions.includes(option) && (
                            <span className="ml-2 text-white">
                                {isValidated && isWronglySelected(option) ? (
                                    <LucideX className="size-5" /> // ❌ Mauvaise réponse sélectionnée
                                ) : (
                                    <LucideCheck className="size-5" /> // ✅ Check blanc sur sélection utilisateur
                                )}
                            </span>
                        )}
                        {isValidated && isMissedAnswer(option) && (
                            <span className="ml-2 text-white">
                                <LucideCheck className="size-5" />{" "}
                                {/* ✅ Check blanc pour réponse oubliée */}
                            </span>
                        )}
                    </Button>
                );
            })}
            {!isValidated && (
                <Button
                    variant="default"
                    size="lg"
                    onClick={handleSubmit}
                    className="mt-4 w-full cursor-pointer"
                >
                    Valider
                </Button>
            )}
        </div>
    );
}
