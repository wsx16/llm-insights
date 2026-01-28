
import React, { useState, useEffect } from 'react';
import { simulateTokenization } from '../services/geminiService';
import { TOKEN_COLORS } from '../constants';
import { TokenInfo } from '../types';

export const TokenVisualizer: React.FC = () => {
  const [inputText, setInputText] = useState('Hello! AI treats text as fragments called tokens.');
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTokenize = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    const rawTokens = await simulateTokenization(inputText);
    const formatted: TokenInfo[] = rawTokens.map((t: string, i: number) => ({
      text: t,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length],
      id: i
    }));
    setTokens(formatted);
    setIsLoading(false);
  };

  useEffect(() => {
    handleTokenize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
          Tokenizer Playground
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Type something below to see how an AI breaks down your language into "tokens". 
          Tokens aren't always whole words; they can be characters, sub-words, or punctuation.
        </p>
        
        <div className="flex flex-col gap-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[120px]"
            placeholder="Enter text to tokenize..."
          />
          <button
            onClick={handleTokenize}
            disabled={isLoading}
            className="self-end px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Tokenizing...' : 'Tokenize Now'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium uppercase tracking-wider text-slate-500">Output Visualization</h4>
          <span className="text-xs bg-slate-800 px-2 py-1 rounded text-indigo-400 font-mono">
            {tokens.length} Tokens
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 p-4 bg-slate-950 rounded-lg border border-slate-800 min-h-[100px] leading-relaxed">
          {tokens.map((token) => (
            <span
              key={token.id}
              className={`px-1 rounded border ${token.color} font-mono text-sm transition-all hover:scale-110 cursor-help`}
              title={`Token #${token.id}`}
            >
              {token.text.replace(' ', '·')}
            </span>
          ))}
          {tokens.length === 0 && !isLoading && (
            <span className="text-slate-600 italic">Visualization will appear here...</span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-500 mb-1 uppercase">Avg. Length</p>
            <p className="text-lg font-bold">~{(inputText.length / (tokens.length || 1)).toFixed(1)} chars</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-500 mb-1 uppercase">Approx. Cost</p>
            <p className="text-lg font-bold">${((tokens.length / 1000000) * 0.15).toFixed(6)}</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-500 mb-1 uppercase">Efficiency</p>
            <p className="text-lg font-bold">High</p>
          </div>
        </div>
      </div>
    </div>
  );
};
