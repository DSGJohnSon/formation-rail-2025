"use client";

import { Question } from "@/types/types";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Reorder, motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function SortableQuestion({
  question,
  setShowExplanation,
}: {
  question: Question;
  setShowExplanation: (show: boolean) => void;
}) {
  const [items, setItems] = useState<string[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);

  useEffect(() => {
    // Mélanger les options au chargement de la question
    setItems([...(question.options ?? [])].sort(() => Math.random() - 0.5));
    setIsValidated(false);
    setIsCorrect(null);
    setShowCorrection(false);
  }, [question]);

  const handleSubmit = () => {
    setIsValidated(true);
    setShowExplanation(true);

    // Vérifier si l'ordre est correct
    const isAnswerCorrect =
      JSON.stringify(items) === JSON.stringify(question.correct_answer);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      confetti({
        particleCount: 40,
        spread: 70,
        startVelocity: 60,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#ff0", "#0f0", "#00f"],
      });
    } else {
      setShowCorrection(true);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📌 Partie où l'utilisateur classe les éléments */}
        <Reorder.Group
          as="ul"
          axis="y"
          values={items}
          onReorder={setItems}
          className="space-y-2"
        >
          {items.map((item, index) => (
            <Reorder.Item
              key={item}
              value={item}
              whileDrag={{ scale: 1.05 }}
              className={`p-3 border rounded-lg bg-white shadow-sm cursor-grab ${
                !isValidated ? "border-gray-300" : ""
              } ${isValidated && !isCorrect ? "border-red-500" : ""} ${
                isValidated && isCorrect ? "border-green-500" : ""
              }`}
            >
              {index + 1}. {item}
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* 📌 Affichage de la correction à droite après validation */}
        {showCorrection && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 border rounded-lg bg-gray-100 shadow-sm"
          >
            <h3 className="text-gray-700 font-semibold mb-2">Correction :</h3>
            <ul className="space-y-2">
              {question.correct_answer.map((correctItem, index) => (
                <li
                  key={correctItem}
                  className="p-2 border border-green-500 rounded-lg bg-white"
                >
                  ✅ {index + 1}. {correctItem}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* 📌 Bouton de validation */}
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

      {/* 📌 Message en cas d'erreur */}
      {isValidated && !isCorrect && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 border border-red-500 text-red-700 bg-red-100 rounded-lg"
        >
          Mauvais ordre ! Voici la correction.
        </motion.div>
      )}
    </div>
  );
}
