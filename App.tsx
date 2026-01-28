
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TokenVisualizer } from './components/TokenVisualizer';
import { ContextSimulator } from './components/ContextSimulator';
import { explainConcept } from './services/geminiService';
import { TabType, ExplanationResponse } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.OVERVIEW);
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const data = await explainConcept('both');
      setExplanation(data);
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Intro Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
            Understand AI Fundamentals
          </h2>
          <p className="text-slate-400 text-lg">
            What is a token? What is context? Master the two most critical parameters that define how Large Language Models think and remember.
          </p>
        </section>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-lg">
            {[
              { id: TabType.OVERVIEW, label: 'Overview', icon: '📖' },
              { id: TabType.TOKENIZER, label: 'Tokenizer Lab', icon: '🧩' },
              { id: TabType.CONTEXT, label: 'Context Simulator', icon: '🧠' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-indigo-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px] transition-all duration-300">
          {activeTab === TabType.OVERVIEW && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">Generating AI Explanation...</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                      🧩
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">The Token</h3>
                    <div className="space-y-4 text-slate-300">
                      <p><strong className="text-indigo-400">Definition:</strong> {explanation?.definition.split('. ')[0]}.</p>
                      <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 italic text-slate-400 text-sm">
                        "Think of tokens as the DNA fragments of human language."
                      </div>
                      <p><strong className="text-indigo-400">Why it matters:</strong> {explanation?.importance}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                      🧠
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">The Context</h3>
                    <div className="space-y-4 text-slate-300">
                      <p><strong className="text-emerald-400">The Analogy:</strong> {explanation?.analogy}</p>
                      <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-sm">
                        <ul className="space-y-2 list-disc pl-4 text-slate-400">
                          <li>Defines "short-term memory"</li>
                          <li>Limits document length</li>
                          <li>Affects reasoning quality</li>
                        </ul>
                      </div>
                      <p className="text-sm">Context isn't just words—it's everything the model sees at once, including system prompts and user history.</p>
                    </div>
                  </div>

                  <div className="col-span-full bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4">
                      <h4 className="text-xl font-bold text-white">How they connect?</h4>
                      <p className="text-slate-300 leading-relaxed">
                        Tokens are the <strong>units</strong> that fill up the <strong>Context Window</strong>. 
                        Every LLM has a "token limit" (its window size). Once that window is full, the model can no longer "see" the earliest tokens in your conversation.
                      </p>
                      {/* FIXED: Changed tabType to TabType to resolve "Cannot find name 'tabType'" error */}
                      <button 
                        onClick={() => setActiveTab(TabType.TOKENIZER)} 
                        className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                      >
                        Try the Tokenizer →
                      </button>
                    </div>
                    <div className="w-full md:w-64 aspect-video bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative group">
                      <img src="https://picsum.photos/seed/llm/400/225" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" alt="LLM Visual" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === TabType.TOKENIZER && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <TokenVisualizer />
            </div>
          )}

          {activeTab === TabType.CONTEXT && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <ContextSimulator />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
