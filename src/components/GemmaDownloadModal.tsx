import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, CheckCircle, AlertTriangle } from 'lucide-react';
import { downloadGemmaModel } from '../services/aiService';

interface GemmaDownloadModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export const GemmaDownloadModal: React.FC<GemmaDownloadModalProps> = ({ isOpen, onComplete, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('初期化中...');
  const [status, setStatus] = useState<'idle' | 'downloading' | 'complete' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    if (isOpen && status === 'idle') {
      setStatus('downloading');
      setProgress(0);
      downloadGemmaModel((p, text) => {
        if (active) {
          setProgress(p);
          if (text) setProgressText(text);
        }
      }).then(() => {
        if (active) {
          setStatus('complete');
          setProgressText('完了しました');
          setTimeout(() => {
             onComplete();
          }, 1500);
        }
      }).catch(err => {
        console.error("Download error:", err);
        if (active) {
          setStatus('error');
          setErrorMsg(err.message || 'お使いのブラウザはWebGPUに対応していないか、メモリが不足しています。');
        }
      });
    }
    return () => { active = false; };
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
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${status === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {status === 'complete' ? <CheckCircle size={32} /> : status === 'error' ? <AlertTriangle size={32} /> : <Cpu size={32} className={status === 'downloading' ? 'animate-pulse' : ''} />}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Local AI Setup (Gemma 2)
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            高性能な「Gemma 2」モデルをブラウザに連携します。(約1.6GB)<br/>
            <span className="font-semibold text-blue-600">初回のみダウンロードが発生し、2回目以降はキャッシュから即座に起動します。</span>
          </p>

          {status !== 'error' ? (
            <>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                <motion.div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              
              <div className="flex justify-between w-full text-xs font-semibold text-gray-500 mb-2">
                <span>{status === 'complete' ? '準備完了' : 'ダウンロード・読み込み中...'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full text-xs text-gray-400 break-words mb-6 h-8 overflow-hidden text-left">
                {progressText}
              </div>
            </>
          ) : (
             <div className="text-sm text-red-600 mb-6 w-full text-left bg-red-50 p-3 rounded-lg border border-red-100">
               エラーが発生しました。<br/>
               <span className="text-xs break-words">{errorMsg}</span><br/><br/>
               <span className="text-xs text-gray-500">クラウドAI(Gemini)にフォールバックします。</span>
             </div>
          )}
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={onCancel}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              閉じる
            </button>
            {(status === 'complete' || status === 'error') && (
              <button 
                onClick={onComplete}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                続ける
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
