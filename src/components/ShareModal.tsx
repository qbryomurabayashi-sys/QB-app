import React, { useState, useRef } from 'react';
import { X, Copy, Check, Info, Download, Upload, FileJson, FileUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'export' | 'import';
  data?: string;
  onImport?: (code: string) => void;
  staffName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, mode, data, onImport, staffName }) => {
  const [copied, setCopied] = useState(false);
  const [importCode, setImportCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QB_Eval_${staffName || 'Staff'}_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          // Validate if it's base64 or JSON
          // Our system uses a base64 string for the "code"
          setImportCode(content);
        } catch (err) {
          alert('ファイルの読み込みに失敗しました。');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    if (onImport && importCode.trim()) {
      onImport(importCode.trim());
      setImportCode('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white p-6 w-full max-w-lg relative z-10 rounded-2xl shadow-2xl border"
          >
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${mode === 'export' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  {mode === 'export' ? <Download size={20} /> : <Upload size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {mode === 'export' ? 'スタッフデータの共有' : '共有ファイルから読込'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Staff Data Sharing System</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {mode === 'export' ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                  <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    このスタッフの全ての評価履歴を含む共有データを生成しました。
                    ファイルとして送るか、コードをコピーして伝えてください。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleDownloadFile}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-blue-50 text-blue-700 rounded-2xl border border-blue-200 hover:bg-blue-100 transition-all active:scale-95 group"
                  >
                    <div className="p-3 bg-blue-600 text-white rounded-full group-hover:scale-110 transition-transform shadow-lg">
                      <FileJson size={24} />
                    </div>
                    <span className="text-sm font-bold">ファイルで保存</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all active:scale-95 group"
                  >
                    <div className={`p-3 rounded-full group-hover:scale-110 transition-transform shadow-lg ${copied ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'}`}>
                      {copied ? <Check size={24} /> : <Copy size={24} />}
                    </div>
                    <span className="text-sm font-bold">{copied ? 'コピー完了' : 'コードをコピー'}</span>
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase text-center tracking-widest">Advanced: Raw Code</p>
                  <textarea
                    readOnly
                    value={data}
                    className="w-full h-24 bg-gray-50 border border-gray-200 p-3 text-[10px] font-mono rounded-xl focus:outline-none resize-none text-gray-400"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
                  <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
                  <div className="text-xs text-amber-800 leading-relaxed">
                    <p className="font-bold mb-1">取込方法:</p>
                    <p>
                      共有された .json ファイルを選択するか、受け取った共有コードを直接ペーストしてください。
                      読み込まれたスタッフは新規スタッフとして追加されます。
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 py-6 bg-green-50 text-green-700 rounded-2xl border-2 border-dashed border-green-200 hover:bg-green-100 transition-all active:scale-98"
                  >
                    <FileUp size={24} />
                    <span className="font-bold">ファイルを選択して読み込む</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".json"
                      className="hidden"
                    />
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase">or Paste Code</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <div>
                    <textarea
                      value={importCode}
                      onChange={(e) => setImportCode(e.target.value)}
                      placeholder="コードをここに貼り付けてください..."
                      className="w-full h-32 bg-gray-50 border border-gray-200 p-4 text-[10px] font-mono rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleImport}
                  disabled={!importCode.trim()}
                  className="w-full bg-green-600 text-white py-4 font-bold rounded-xl shadow-md hover:bg-green-700 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-95"
                >
                  スタッフデータを読み込む
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
