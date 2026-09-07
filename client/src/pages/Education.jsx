import React, { useState } from 'react';

const QUIZ_QUESTIONS = [
  {
    question: 'Which bin should clean plastic water bottles go into?',
    options: ['Green (Organic)', 'Blue (Recyclable)', 'Red (Hazardous)', 'Yellow (Textile)'],
    correct: 1,
    explanation: 'Clean dry plastic is recyclable and goes into the Blue Bin.'
  },
  {
    question: 'Where should food waste and vegetable peels be placed?',
    options: ['Blue (Recyclable)', 'Green (Organic/Wet)', 'Red (E-Waste)', 'General Trash'],
    correct: 1,
    explanation: 'Food waste is biodegradable organic waste and belongs in the Green Bin.'
  },
  {
    question: 'How should expired batteries be disposed of?',
    options: ['Household trash', 'Compost bin', 'Red Hazardous/E-Waste facility', 'Drain'],
    correct: 2,
    explanation: 'Batteries contain toxic heavy metals and must go to Hazardous/E-Waste collection.'
  }
];

export default function Education() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx) => {
    setSelectedOpt(idx);
    if (idx === QUIZ_QUESTIONS[currentQ].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOpt(null);
    if (currentQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1>Waste Segregation Guide & Quiz 📚</h1>
        <p style={{ color: 'var(--text-muted)' }}>Master proper segregation rules and test your eco knowledge</p>
      </div>

      {/* SEGREGATION COLOR GUIDE */}
      <div className="grid-cols-3" style={{ marginBottom: '40px' }}>
        <div className="glass-card" style={{ borderTop: '6px solid var(--success)' }}>
          <h3>🟢 Green Bin (Organic)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Food scraps, fruit peels, tea bags, garden leaves, eggshells, coffee grounds.
          </p>
        </div>
        <div className="glass-card" style={{ borderTop: '6px solid #0284c7' }}>
          <h3>🔵 Blue Bin (Recyclable)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Plastic bottles, cardboard boxes, paper, aluminum cans, glass jars.
          </p>
        </div>
        <div className="glass-card" style={{ borderTop: '6px solid var(--danger)' }}>
          <h3>🔴 Red Bin (Hazardous)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Batteries, e-waste, chemicals, paints, syringes, expired medicines.
          </p>
        </div>
      </div>

      {/* QUIZ SECTION */}
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>💡 Eco Knowledge Quiz</h2>

        {!showResult ? (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
            </div>
            <h3 style={{ marginBottom: '20px' }}>{QUIZ_QUESTIONS[currentQ].question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ_QUESTIONS[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`btn ${selectedOpt === idx ? (idx === QUIZ_QUESTIONS[currentQ].correct ? 'btn-primary' : 'btn-danger') : 'btn-secondary'}`}
                  style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.95rem' }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {selectedOpt !== null && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {QUIZ_QUESTIONS[currentQ].explanation}
                </p>
                <button onClick={nextQuestion} className="btn btn-primary" style={{ width: '100%' }}>
                  {currentQ + 1 === QUIZ_QUESTIONS.length ? 'See Final Score' : 'Next Question'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h3>Quiz Completed! 🎉</h3>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-teal)', margin: '16px 0' }}>
              You scored {score} / {QUIZ_QUESTIONS.length}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Great job! Keep practicing proper waste segregation every day.
            </p>
            <button onClick={() => { setCurrentQ(0); setScore(0); setShowResult(false); }} className="btn btn-primary">
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
