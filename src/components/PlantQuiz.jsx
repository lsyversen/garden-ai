import React, { useState } from 'react';

const questions = [
    {
      question: "What is the process by which plants make their own food?",
      options: ["Photosynthesis", "Respiration", "Germination", "Pollination"],
      answer: 0
    },
    {
      question: "Which plant is known as the 'King of Trees'?",
      options: ["Oak", "Banyan", "Pine", "Cedar"],
      answer: 1
    },
    {
      question: "What is the primary nutrient required for plant growth?",
      options: ["Nitrogen", "Sulfur", "Phosphorus", "Iron"],
      answer: 0
    },
    {
      question: "Which of the following plants is considered a succulent?",
      options: ["Rose", "Aloe Vera", "Tulip", "Fern"],
      answer: 1
    },
    {
      question: "What is the purpose of mulch in gardening?",
      options: [
        "Decorating the garden",
        "Improving soil fertility and retaining moisture",
        "Removing pests",
        "Helping plants grow faster"
      ],
      answer: 1
    },
    {
      question: "Which plant is a natural mosquito repellent?",
      options: ["Mint", "Citronella", "Lavender", "Rosemary"],
      answer: 1
    },
    {
      question: "What is the best pH range for most plants to thrive?",
      options: ["3.5-4.5", "6.0-7.0", "7.5-8.5", "4.0-5.0"],
      answer: 1
    },
    {
      question: "Which type of fertilizer releases nutrients over time?",
      options: ["Organic", "Synthetic", "Slow-release", "Liquid"],
      answer: 2
    },
    {
      question: "What is the process of transferring pollen from one flower to another called?",
      options: ["Fertilization", "Pollination", "Propagation", "Transpiration"],
      answer: 1
    },
    {
      question: "What is a deciduous plant?",
      options: [
        "A plant that retains leaves year-round",
        "A plant that sheds leaves annually",
        "A plant that grows only in winter",
        "A plant with needle-like leaves"
      ],
      answer: 1
    },
    {
      question: "Which tool is commonly used for pruning plants?",
      options: ["Hoe", "Pruners", "Rake", "Spade"],
      answer: 1
    },
    {
      question: "What is the function of a plant's roots?",
      options: ["Photosynthesis", "Water absorption", "Reproduction", "Seed production"],
      answer: 1
    },
    {
      question: "Which plant is often used for topiary sculptures?",
      options: ["Buxus (Boxwood)", "Palm", "Cactus", "Grass"],
      answer: 0
    },
    {
      question: "Which gardening method involves planting crops without tilling the soil?",
      options: ["Hydroponics", "No-till gardening", "Terrace farming", "Crop rotation"],
      answer: 1
    },
    {
      question: "What is the scientific name for the sunflower?",
      options: ["Helianthus annuus", "Rosa rubiginosa", "Lilium candidum", "Triticum aestivum"],
      answer: 0
    }
  ];

const PlantQuiz = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleOptionChange = (questionIndex, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: optionIndex });
  };

  const calculateScore = () => {
    let newScore = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) newScore++;
    });
    setScore(newScore);
  };

  return (
    <div className="quiz-container">
      <h1 className="text-2xl font-bold text-center mb-6">Plant Quiz</h1>
      {questions.map((q, index) => (
        <div key={index} className="question mb-6">
          <h3 className="text-lg font-semibold">{index + 1}. {q.question}</h3>
          <ul className="options list-none pl-0">
            {q.options.map((option, i) => (
              <li key={i} className="mt-2">
                <label>
                  <input
                    type="radio"
                    name={`question${index}`}
                    value={i}
                    checked={selectedAnswers[index] === i}
                    onChange={() => handleOptionChange(index, i)}
                    className="mr-2"
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={calculateScore} className="btn w-full bg-green-600 text-white py-2 mt-4 rounded">
        Submit Quiz
      </button>
      {score !== null && (
        <div className="result mt-6 text-center">
          <p>You scored {score} out of {questions.length}.</p>
          <p className={score / questions.length >= 0.8 ? "congratulations text-green-600" : "try-again text-red-600"}>
            {score / questions.length >= 0.8 ? "Congratulations! You passed! You're off to great gardening!" : "Review the recommended articles to improve your score and overall gardening knowledge."}
          </p>
        </div>
      )}
    </div>
  );
};

export default PlantQuiz;
