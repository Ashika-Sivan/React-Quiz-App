const QUIZ_API_BASE_URL = "https://quizapi.io/api/v1";

function shuffleArray(arr) {
  // Fisher–Yates shuffle (in-place copy)
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toInternalQuestion(apiQuestion) {
  // QuizAPI (browse mode) returns:
  // {
  //   id, text, type, answers: [{id,text,isCorrect}, ...]
  // }
  const answers = Array.isArray(apiQuestion.answers) ? apiQuestion.answers : [];

  // Remove empty/null answers; keep only real answer texts
  const validAnswers = answers.filter((a) => {
    const txt = a?.text;
    return typeof txt === "string" && txt.trim().length > 0;
  });

  const correctAnswers = validAnswers.filter((a) => a?.isCorrect === true);
  if (correctAnswers.length !== 1) return null;
  if (validAnswers.length < 4) return null;

  const correctAnswer = correctAnswers[0];
  const otherAnswers = validAnswers.filter((a) => a.id !== correctAnswer.id);

  // Pick 3 other options randomly
  const pickedOthers = shuffleArray(otherAnswers).slice(0, 3);

  const fourOptions = shuffleArray([
    correctAnswer.text,
    ...pickedOthers.map((a) => a.text),
  ]);

  const correctIndex = fourOptions.findIndex((t) => t === correctAnswer.text);
  if (correctIndex < 0) return null;

  return {
    id: apiQuestion.id ?? crypto.randomUUID(),
    question: apiQuestion.text,
    options: fourOptions,
    correctIndex,
  };
}

export async function fetchQuizQuestions(apiKey, count = 15) {
  if (!apiKey) throw new Error("Missing QuizAPI key");

  const endpoint = `${QUIZ_API_BASE_URL}/questions`;

  // We may need multiple requests to get enough “exactly one correct answer” questions.
  const maxAttempts = 6;
  const target = Math.max(1, count);
  const result = [];
  const seenIds = new Set();

  for (let attempt = 0; attempt < maxAttempts && result.length < target; attempt++) {
    const limit = Math.min(50, target * 4);

    const url = new URL(endpoint);
    // Browse random questions across all published quizzes
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("random", "true");
    // Ensure we get MULTIPLE_CHOICE questions (API still may include varying answer counts)
    url.searchParams.set("type", "MULTIPLE_CHOICE");

    // Not all datasets are guaranteed to be single-answer.
    // This parameter helps, but we still validate client-side to enforce “exactly one correct”.
    url.searchParams.set("single_answer_only", "true");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`QuizAPI request failed (${res.status}). ${body}`.trim());
    }

    const json = await res.json();
    const apiQuestions = Array.isArray(json?.data) ? json.data : [];

    for (const q of apiQuestions) {
      if (result.length >= target) break;
      if (!q?.id) continue;
      if (seenIds.has(q.id)) continue;

      const internal = toInternalQuestion(q);
      if (!internal) continue;

      seenIds.add(q.id);
      result.push(internal);
    }
  }

  if (result.length < target) {
    throw new Error(
      `Couldn't fetch enough valid questions from QuizAPI. Needed ${target}, got ${result.length}.`
    );
  }

  return result.slice(0, target);
}

