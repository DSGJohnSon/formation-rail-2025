"use client";
import { useState, useEffect } from "react";
import { data } from "@/data/data";
import QuestionDisplay from "@/components/QuestionDisplay";
import NextButton from "@/components/NextButton";

export default function Home() {
    const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        // Initialize the currentIndex with a random value on the client side
        const initialIndex = Math.floor(Math.random() * data.length);
        setCurrentIndex(initialIndex);
    }, []);

    const question = currentIndex !== null ? data[currentIndex] : null;

    const handleNext = () => {
        setShowExplanation(false);
        setCurrentIndex((prevIndex) => {
            let newIndex;
            let updatedUsedIndexes = [...usedIndexes];

            // If all indexes have been used, reset the list
            if (usedIndexes.length === data.length - 1) {
                updatedUsedIndexes = [];
            }

            // Find a new index that hasn't been used yet
            do {
                newIndex = Math.floor(Math.random() * data.length);
            } while (updatedUsedIndexes.includes(newIndex));

            // Update the used indexes
            updatedUsedIndexes.push(newIndex);
            setUsedIndexes(updatedUsedIndexes);

            return newIndex;
        });
    };

    if (currentIndex === null) {
        // Optionally render a loading state while the initial index is being set
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <p>Question n°{usedIndexes.length}/{data.length}</p>
            <QuestionDisplay 
                question={question} 
                showExplanation={showExplanation} 
                setShowExplanation={setShowExplanation}
                onNextQuestion={handleNext}
            />
            {showExplanation && <NextButton onClick={handleNext} />}
        </div>
    );
}