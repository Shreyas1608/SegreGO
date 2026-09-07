import React, { useState } from 'react';

const KNOWLEDGE_BASE = {
  battery: '🔋 Batteries contain heavy metals (lead, cadmium). Do NOT put in regular trash! Take them to a Red Hazardous Waste bin or nearby e-waste collection center.',
  plastic: '🥤 Clean plastic bottles & containers go into the Blue Recyclable Bin. Make sure to rinse food residue and crush bottles to save space.',
  glass: '🍾 Glass bottles and jars are 100% recyclable! Rinse clean and place in the Blue Recyclable Bin. Wrap broken glass in newspaper safely.',
  paper: '📦 Cardboard boxes and clean dry paper go into the Blue Recyclable Bin. Flatten boxes. Food-soiled paper (like pizza boxes) goes to Organic waste!',
  food: '🍌 Food scraps, vegetable peels, and organic waste go into the Green Organic Bin. They are converted into valuable compost!',
  electronics: '💻 E-Waste (phones, chargers, laptops) must never enter landfill bins. Use our Nearby Centers page to find an authorized e-waste drop-off point.',
  medicine: '💊 Expired medicines are medical hazardous waste. Do not flush them down toilets. Return them to pharmacies or municipal hazardous collection points.',
};

export default function EcoBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am SEGREGO Bot 🌿 Ask me where to throw any item or how waste segregation works!' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (queryText) => {
    const textToSearch = (queryText || input).toLowerCase();
    if (!textToSearch.trim()) return;

    const userMsg = { sender: 'user', text: queryText || input };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');

    let botResponse = "I'm not sure about that specific item. Generally: Organic food goes to Green Bin, clean Dry recyclables (Plastic/Paper/Metal/Glass) go to Blue Bin, and Hazardous/E-Waste goes to Red Bin!";

    for (const [key, answer] of Object.entries(KNOWLEDGE_BASE)) {
      if (textToSearch.includes(key)) {
        botResponse = answer;
        break;
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 400);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary"
          style={{
            borderRadius: '50%', width: '56px', height: '56px', padding: 0,
            fontSize: '1.5rem', boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)'
          }}
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div className="glass-card" style={{
          width: '320px', height: '420px', display: 'flex', flexDirection: 'column',
          padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-green), var(--primary-teal))',
            color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', fontWeight: 700
          }}>
            <span>🤖 SEGREGO Bot</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? 'var(--primary-teal)' : '#f1f5f9',
                  color: m.sender === 'user' ? 'white' : 'var(--text-main)',
                  padding: '8px 12px', borderRadius: '12px', maxWidth: '85%',
                  fontSize: '0.85rem', lineHeight: '1.4'
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick chips */}
          <div style={{ padding: '4px 8px', display: 'flex', gap: '4px', overflowX: 'auto', background: '#f8fafc' }}>
            {['battery', 'plastic', 'food', 'electronics'].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                style={{
                  padding: '4px 8px', fontSize: '0.7rem', borderRadius: '10px',
                  border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '8px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ask EcoBot..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            />
            <button onClick={() => handleSend()} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
