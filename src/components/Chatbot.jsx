import { useState } from 'react';
import { MessageCircle, SendHorizontal, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { buildChatReply } from '../lib/chatbot';

const starterMessages = (role) => [
  {
    role: 'bot',
    text: `Hi! I can help you manage the ${role === 'STUDENT' ? 'internship workflow' : role === 'COMPANY' ? 'hiring and review flow' : 'admin operations'} in this app.`,
  },
];

export default function Chatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(() => starterMessages(user?.role || 'STUDENT'));

  const sendQuestion = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextUser = { role: 'user', text: trimmed };
    const nextBot = {
      role: 'bot',
      text: buildChatReply(trimmed, user?.role || 'STUDENT'),
    };

    setMessages((prev) => [...prev, nextUser, nextBot]);
    setDraft('');
  };

  const quickPrompts = [
    'How do I apply?',
    'Where do I view logs?',
    'How do I review reports?',
    'What can I do here?',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-ink-soft"
        >
          <MessageCircle size={18} />
          Chatbot
        </button>
      ) : (
        <div className="w-[92vw] max-w-md overflow-hidden rounded-2xl border border-rule bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-rule bg-paper px-4 py-3">
            <div className="flex items-center gap-2 font-semibold text-ink">
              <Sparkles size={18} className="text-pine" />
              Internlog assistant
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white" aria-label="Close chatbot">
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[55vh] space-y-3 overflow-y-auto bg-white px-4 py-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user' ? 'bg-ink text-white' : 'bg-paper text-ink'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-rule bg-paper px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendQuestion(prompt)}
                  className="rounded-full border border-rule bg-white px-2.5 py-1 text-xs text-ink/80 hover:bg-white"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendQuestion(draft);
              }}
              className="flex gap-2"
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about your workflow..."
                className="w-full rounded-md border border-rule bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/50"
              />
              <button type="submit" className="inline-flex items-center justify-center rounded-md bg-pine px-3 text-white transition hover:bg-pine/90" aria-label="Send message">
                <SendHorizontal size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
