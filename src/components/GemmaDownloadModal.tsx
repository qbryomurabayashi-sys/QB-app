import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Download, Cpu, CheckCircle } from 'lucide-react';
import { downloadGemmaModel } from '../services/aiService';

interface GemmaDownloadModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const GemmaDownloadModal: React.FC<GemmaDownloadModalProps> = ({ isOpen, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'downloading' | 'complete'>('idle');

  useEffect(() => {
    if (isOpen && status === 'idle') {
      setStatus('downloading');
      setProgress(0);
      downloadGemmaModel((p) => {
        setProgress(p);
      }).then(() => {
        setStatus('complete');
        setTimeout(() => {
          onComplete();
        }, 1500);
      });
    }
  }, [isOpen, status, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
            {status === 'complete' ? <CheckCircle size={32} /> : <Cpu size={32} className={status === 'downloading' ? 'animate-pulse' : ''} />}
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Gemma-4 (E2B)
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            ローカルAIモデルをデバイスにダウンロードしています。<br/>
            完了後はオフラインでも高速に生成可能です。
          </p>

          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
            <motion.div 
              className="bg-purple-600 h-2.5 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          
          <div className="flex justify-between w-full text-xs font-semibold text-gray-500">
            <span>{status === 'complete' ? '準備完了' : 'ダウンロード中...'}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
