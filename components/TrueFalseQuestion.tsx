"use client";

import { Question } from "@/types/types";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { LucideCheck, LucideX } from "lucide-react";
import confetti from "canvas-confetti";

export default function TrueFalseQuestion({
  question,
  setShowExplanation,
}: {
  question: Question;
  setShowExplanation: (show: boolean) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    // Réinitialiser la sélection et l'état de validation à chaque nouvelle question
    setSelectedOption(null);
    setIsValidated(false);
  }, [question]);

  const handleSelect = (option: string) => {
    if (isValidated) return; // Ne pas changer après validation
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return; // Ne pas valider si aucun choix n'est fait
    setIsValidated(true);
    setShowExplanation(true);

    // Vérification si la réponse est correcte
    if (question.correct_answer.includes(selectedOption)) {
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

  return (
    <div>
      {question.options &&
        question.options.map((option) => {
          let variant: "default" | "success" | "destructive" | "secondary" =
            "secondary";

          if (isValidated) {
            if (question.correct_answer.includes(option)) {
              variant = "success"; // ✅ Bonne réponse
            } else if (selectedOption === option) {
              variant = "destructive"; // ❌ Mauvaise réponse
            }
          } else if (selectedOption === option) {
            variant = "default"; // 🎯 Option sélectionnée avant validation
          }

          return (
            <Button
              key={option}
              onClick={() => handleSelect(option)}
              variant={variant}
              className={`mb-2 w-full flex items-center justify-between cursor-pointer ${
                isValidated && selectedOption === option && !question.correct_answer.includes(option)
                  ? "line-through"
                  : ""
              }`}
              disabled={isValidated} // Empêcher d'interagir après validation
            >
              {option}
              {selectedOption === option && (
                <span className="ml-2 text-white">
                  {isValidated && !question.correct_answer.includes(option) ? (
                    <LucideX className="size-5" /> // ❌ Mauvaise réponse sélectionnée
                  ) : (
                    <LucideCheck className="size-5" /> // ✅ Check blanc sur sélection utilisateur
                  )}
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
          disabled={!selectedOption} // Désactiver si aucune sélection
        >
          Valider
        </Button>
      )}
    </div>
  );
}
