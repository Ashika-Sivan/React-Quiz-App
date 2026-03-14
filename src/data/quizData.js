export const QUIZ_DATA = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctIndex: 2,
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "What is 7 × 8?",
    options: ["54", "56", "58", "64"],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
  },
  {
    id: 6,
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctIndex: 2,
  },
  {
    id: 7,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctIndex: 2,
  },
  {
    id: 8,
    question: "Which programming language is known for web browsers?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctIndex: 2,
  },
  {
    id: 9,
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
  },
  {
    id: 10,
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctIndex: 2,
  },
  {
    id: 11,
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "South Africa", "Australia", "Brazil"],
    correctIndex: 2,
  },
  {
    id: 12,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language",
    ],
    correctIndex: 0,
  },
  {
    id: 13,
    question: "Which gas do plants absorb from the air?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    correctIndex: 2,
  },
  {
    id: 14,
    question: "What is the speed of light in vacuum (approximately)?",
    options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
    correctIndex: 0,
  },
  {
    id: 15,
    question: "Who developed the theory of relativity?",
    options: ["Newton", "Galileo", "Einstein", "Tesla"],
    correctIndex: 2,
  },
];

export const TOTAL_QUESTIONS = QUIZ_DATA.length;
export const TIME_PER_QUESTION = 60; // seconds
export const MAX_SCORE = 15;
