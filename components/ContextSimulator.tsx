
import React, { useState } from 'react';
import { APP_CONFIG } from '../constants';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  tokens: number;
}

export const ContextSimulator: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'user', content: 'What is the capital of France?', tokens: 8 },
    { role: 'assistant', content: 'The capital of France is Paris.', tokens: 10 },
    { role: 'user', content: 'Tell me about its history.', tokens: 7 },
    { role: 'assistant', content: 'Paris has a rich history dating back to the 3rd century BC...', tokens: 450 },
  ]);
  const [maxTokens, setMaxTokens] = useState(1024);

  const totalTokens = messages.reduce((sum, m) => sum + m.tokens, 0);
  const usagePercentage = Math.min((totalTokens / maxTokens) * 100, 100);

  const addMessage = () => {
    const newMsg: ChatMessage = {
      role: 'user',
      content: 'I have more questions about this topic...',
      tokens: Math.floor(Math.random() * 200) + 50
    };
    setMessages([...messages, newMsg]);
  };

  const clearMessages = () => setMessages([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
              The Context Window
            </h3>
            <div className="flex gap-2">
              <button onClick={clearMessages} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-slate-400">Clear</button>
              <button onClick={addMessage} className="text-xs bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded text-white font-medium">Add Message</button>
            </div>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {messages.map((m, i) => {
              const currentSum = messages.slice(0, i + 1).reduce((s, msg) => s + msg.tokens, 0);
              const isOmitted = currentSum > maxTokens;
              
              return (
                <div key={i} className={`relative p-4 rounded-lg border ${isOmitted ? 'opacity-30 grayscale border-red-900/50 bg-red-900/10' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${m.role === 'user' ? 'bg-blue-900 text-blue-200' : 'bg-emerald-900 text-emerald-200'}`}>
                      {m.role}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {m.tokens} tokens
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{m.content}</p>
                  {isOmitted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg">DROPPED FROM CONTEXT</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-slate-400 uppercase mb-4 tracking-wider">Monitor</h4>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Memory Usage</span>
                <span className={`${usagePercentage >= 90 ? 'text-red-400' : 'text-emerald-400'} font-bold`}>
                  {totalTokens} / {maxTokens}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${usagePercentage >= 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <label className="text-xs text-slate-500 uppercase block mb-3">Adjust Model Context Limit</label>
              <input 
                type="range" 
                min="512" 
                max="4096" 
                step="512" 
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-[10px] font-mono text-slate-600">
                <span>512</span>
                <span>2048</span>
                <span>4096</span>
              </div>
            </div>

            <div className="p-4 bg-amber-900/20 border border-amber-900/30 rounded-lg">
              <h5 className="text-xs font-bold text-amber-500 uppercase mb-2">Lesson</h5>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                When the total tokens exceed the context window (red bar), the model "forgets" the earliest parts of the conversation. This is why AI might lose track of instructions in very long chats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
