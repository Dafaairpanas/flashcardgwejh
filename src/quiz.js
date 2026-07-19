/**
 * Quiz Page Module
 * Chapter-based quiz with multiple choice questions loaded from JSON
 */

const $ = (id) => document.getElementById(id);

let quizState = {
  currentBab: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: false,
};

export function initQuiz() {
  // Build bab grid (1-50)
  const grid = $('quiz-bab-grid');
  grid.innerHTML = '';
  for (let i = 1; i <= 50; i++) {
    const babNum = String(i).padStart(2, '0');
    const btn = document.createElement('button');
    btn.className = 'quiz-bab-btn';
    btn.textContent = `Bab ${babNum}`;
    btn.dataset.bab = babNum;
    btn.addEventListener('click', () => loadQuiz(babNum));
    grid.appendChild(btn);
  }

  // Back button
  $('quiz-back-btn').addEventListener('click', showQuizSelect);
  $('quiz-retry-btn').addEventListener('click', () => {
    if (quizState.currentBab) loadQuiz(quizState.currentBab);
  });
  $('quiz-home-btn').addEventListener('click', showQuizSelect);
  
  initQuizButtons();
}

async function loadQuiz(babNum) {
  quizState.currentBab = babNum;
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.answered = false;

  try {
    const response = await fetch(`/soal/bab${babNum}.json`);
    if (!response.ok) throw new Error('Not found');
    quizState.questions = await response.json();

    if (quizState.questions.length === 0) throw new Error('Empty');

    $('quiz-select').style.display = 'none';
    $('quiz-result').style.display = 'none';
    $('quiz-question-area').style.display = 'block';
    showQuestion();
  } catch {
    // No quiz data for this bab
    $('quiz-select').style.display = 'none';
    $('quiz-result').style.display = 'none';
    $('quiz-question-area').style.display = 'block';
    $('quiz-progress').textContent = `Bab ${babNum}`;
    $('quiz-card').innerHTML = `
      <div style="text-align:center; padding:40px 20px;">
        <p style="font-size:2rem; margin-bottom:16px;">📝</p>
        <p style="color:var(--text-secondary); font-size:0.95rem;">Belum ada data soal untuk Bab ${babNum}.</p>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-top:8px;">Tambahkan file <code>public/soal/bab${babNum}.json</code></p>
      </div>
    `;
  }
}

function showQuestion() {
  const q = quizState.questions[quizState.currentIndex];
  quizState.answered = false;

  $('quiz-progress').textContent = `${quizState.currentIndex + 1}/${quizState.questions.length}`;
  $('quiz-question').textContent = q.question;
  
  $('quiz-reveal-btn').style.display = 'block';
  $('quiz-answer-area').style.display = 'none';
  $('quiz-answer').textContent = q.answer;
}

function initQuizButtons() {
  $('quiz-reveal-btn').addEventListener('click', () => {
    $('quiz-reveal-btn').style.display = 'none';
    $('quiz-answer-area').style.display = 'block';
  });

  $('quiz-grade-correct').addEventListener('click', () => {
    quizState.score++;
    nextQuestion();
  });

  $('quiz-grade-wrong').addEventListener('click', () => {
    nextQuestion();
  });
}

function nextQuestion() {
  quizState.currentIndex++;
  if (quizState.currentIndex < quizState.questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  $('quiz-question-area').style.display = 'none';
  $('quiz-result').style.display = 'flex';

  const total = quizState.questions.length;
  const pct = Math.round((quizState.score / total) * 100);
  $('quiz-score').textContent = `${quizState.score}/${total}`;
  $('quiz-score-pct').textContent = `${pct}%`;
}

function showQuizSelect() {
  $('quiz-select').style.display = 'block';
  $('quiz-question-area').style.display = 'none';
  $('quiz-result').style.display = 'none';
}
