import React, { useState } from 'react';

const ECOBOT_KNOWLEDGE = [
  {
    keywords: ['battery', 'batteries', 'cell', 'accumulator', 'powerbank'],
    answer: '🔋 **Batteries / E-Waste Protocol:**\nNever place batteries in household trash! They contain heavy metals (lead, cadmium, lithium). Take spent batteries to a 🔴 Red Hazardous Bin or your nearest Bengaluru DWCC / E-Waste Hub (e.g. Rajajinagar or Electronic City E-Waste Hub).',
    bin: '🔴 Red Bin (Hazardous / E-Waste)',
  },
  {
    keywords: ['plastic', 'bottle', 'pet', 'wrapper', 'container', 'soda bottle', 'water bottle', 'polythene'],
    answer: '🥤 **Dry Plastics Protocol:**\nRinse container clean of food or drink liquids. Remove cap, flatten bottle to save space, and place in the 🔵 Blue Recyclable Bin or drop off at your local DWCC.',
    bin: '🔵 Blue Bin (Dry Recyclables)',
  },
  {
    keywords: ['glass', 'jar', 'wine bottle', 'beer bottle', 'mirror', 'glassware'],
    answer: '🍾 **Glass Recycling Protocol:**\nGlass is 100% recyclable indefinitely! Rinse clean with water. If intact, place in 🔵 Blue Bin. Wrap broken glass safely in newspaper to protect waste collectors.',
    bin: '🔵 Blue Bin (Dry Recyclables)',
  },
  {
    keywords: ['paper', 'cardboard', 'box', 'newspaper', 'carton', 'envelope', 'magazine', 'book'],
    answer: '📦 **Paper & Cardboard Protocol:**\nClean and dry paper products go into 🔵 Blue Bin. Flatten boxes completely. Note: Food-soiled paper (like greasy pizza box bottoms) goes into 🟢 Green Organic Bin!',
    bin: '🔵 Blue Bin (Dry Recyclables)',
  },
  {
    keywords: ['food', 'banana', 'apple', 'peel', 'vegetable', 'fruit', 'leftover', 'curry', 'rice', 'wet', 'organic', 'compost', 'kitchen'],
    answer: '🥗 **Wet / Organic Waste Protocol:**\nAll kitchen scraps, food leftovers, fruit/veg peels, and tea leaves belong in the 🟢 Green Organic Bin. In Bengaluru, wet waste is collected daily for city composting yards.',
    bin: '🟢 Green Bin (Wet Waste)',
  },
  {
    keywords: ['phone', 'mobile', 'laptop', 'computer', 'keyboard', 'charger', 'cable', 'wire', 'electronics', 'ewaste'],
    answer: '💻 **E-Waste Collection Protocol:**\nElectronics must never end up in landfills. Use SEGREGO\'s Nearby Centers tab to locate BBMP authorized e-waste collection kiosks in Koramangala or Rajajinagar.',
    bin: '🔴 Red Bin (E-Waste Hub)',
  },
  {
    keywords: ['medicine', 'tablet', 'capsule', 'syringes', 'needle', 'bandage', 'pharma'],
    answer: '💊 **Biomedical / Expired Medicine:**\nReturn unused or expired medicines to authorized pharmacies or drop off at ⚪ White Biomedical Waste kiosks. Never flush medicines down toilets.',
    bin: '⚪ White Bin (Biomedical Waste)',
  },
  {
    keywords: ['clothes', 'shirt', 'pant', 'textile', 'fabric', 'dress', 'shoes', 'footwear'],
    answer: '👕 **Textile Recycling Protocol:**\nGently used clothing should be donated. Worn/torn fabrics can be dropped into 🟡 Yellow Textile Bins or dedicated fabric recycling kiosks.',
    bin: '🟡 Yellow Bin (Textile Recycling)',
  },
];

export default function EcoBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaskara! I am SEGREGO Bot 🌿 Ask me where to dispose any item or how Bengaluru waste segregation works!' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (queryText) => {
    const textToSearch = (queryText || input).toLowerCase();
    if (!textToSearch.trim()) return;

    const userMsg = { sender: 'user', text: queryText || input };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');

    let botAnswer = "I couldn't find a direct match for that specific item. As a general rule in Bengaluru: Wet food waste goes to 🟢 Green Bin, dry clean recyclables (plastic/paper/glass/metal) go to 🔵 Blue Bin, and toxic/e-waste goes to 🔴 Red Bin!";

    for (const item of ECOBOT_KNOWLEDGE) {
      if (item.keywords.some((kw) => textToSearch.includes(kw))) {
        botAnswer = item.answer;
        break;
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: botAnswer }]);
    }, 300);
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
          width: '340px', height: '450px', display: 'flex', flexDirection: 'column',
          padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-green), var(--primary-teal))',
            color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', fontWeight: 700
          }}>
            <span>🤖 SEGREGO EcoBot Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Messages List */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? 'var(--primary-teal)' : '#f1f5f9',
                  color: m.sender === 'user' ? 'white' : 'var(--text-main)',
                  padding: '10px 14px', borderRadius: '12px', maxWidth: '88%',
                  fontSize: '0.85rem', lineHeight: '1.45', whiteSpace: 'pre-line'
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick Action Chips */}
          <div style={{ padding: '6px 8px', display: 'flex', gap: '4px', overflowX: 'auto', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            {['battery', 'plastic bottle', 'food waste', 'electronics', 'paper box'].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                style={{
                  padding: '4px 8px', fontSize: '0.72rem', borderRadius: '12px',
                  border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ padding: '8px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ask EcoBot where to throw..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
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
