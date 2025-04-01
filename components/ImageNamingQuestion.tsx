"use client";

import { Question } from "@/types/types";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { LucideCheck, LucideX } from "lucide-react";
import confetti from "canvas-confetti";
import { Input } from "./ui/input";

export default function ImageNamingQuestion({
  question,
  setShowExplanation,
  onNextQuestion,
}: {
  question: Question;
  setShowExplanation: (show: boolean) => void;
  onNextQuestion: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswer("");
    setIsValidated(false);
    setIsCorrect(null);

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timeout);
  }, [question]);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setIsValidated(true);
    setShowExplanation(true);

    const normalizedAnswer = answer.trim().toLowerCase();
    const correctAnswers = question.correct_answer.map((ans) =>
      ans.trim().toLowerCase()
    );

    const isAnswerCorrect = correctAnswers.includes(normalizedAnswer);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      confetti({
        particleCount: 30,
        spread: 70,
        startVelocity: 60,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#ff0", "#0f0", "#00f"],
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!isValidated) {
        handleSubmit(); // Première pression sur "Enter" pour valider la réponse
      } else {
        onNextQuestion(); // Deuxième pression sur "Enter" pour passer à la question suivante
      }
    }
  };

  return (
    <div>
      <img
        src={question.image_url}
        alt="Question image"
        className="w-full mb-4 rounded-lg"
      />

      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown} // 🔥 Gère la validation et le passage à la question suivante
          placeholder="Votre réponse..."
          className={`border p-2 rounded w-full text-lg ${
            isValidated
              ? isCorrect
                ? "border-green-500 text-green-700"
                : "border-red-500 text-red-700 line-through"
              : "border-gray-300"
          }`}
          disabled={isValidated}
        />
        {isValidated && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {isCorrect ? (
              <LucideCheck className="size-6 text-green-500" />
            ) : (
              <LucideX className="size-6 text-red-500" />
            )}
          </span>
        )}
      </div>

      {isValidated && !isCorrect && (
        <div className="mt-4">
          <label className="text-sm text-gray-600">Bonne réponse :</label>
          <input
            type="text"
            value={question.correct_answer[0]}
            className="border p-2 rounded w-full text-lg border-green-500 text-green-700 bg-emerald-50"
            disabled
          />
        </div>
      )}

      {!isValidated ? (
        <Button
          variant="default"
          size="lg"
          onClick={handleSubmit}
          className="mt-4 w-full cursor-pointer"
          disabled={!answer.trim()}
        >
          Valider
        </Button>
      ) : (
        null
      )}
    </div>
  );
}
