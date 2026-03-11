import React from 'react';
import { ArrowLeft, HelpCircle, BookOpen, Printer, Save, Database, Lock, Users, Zap } from 'lucide-react';

interface GuideSection {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const SECTIONS: GuideSection[] = [
  {
    title: 'CORE_OPERATIONS',
    icon: <BookOpen className="text-terminal-orange" size={24} />,
    content: [
      'INITIALIZE_NEW_EVALUATION_VIA_TOP_PAGE_COMMAND.',
      'SELECT_EXISTING_SUBJECT_TO_RESUME_OR_OVERWRITE_LOGS.',
      'SWITCH_BETWEEN_CATEGORIES (REL, CS, TECH, ETC.)_VIA_TAB_INTERFACE.'
    ]
  },
  {
    title: 'DATA_SYNC_&_RECOVERY',
    icon: <Save className="text-terminal-green" size={24} />,
    content: [
      'AUTO_SYNC_IS_ACTIVE. MANUAL_SAVE_PROTOCOL_AVAILABLE.',
      'USE_BACKUP_PROTOCOL_TO_EXPORT_ALL_DATA_AS_JSON_FILE.',
      'RESTORE_PROTOCOL_ALLOWS_DATA_RECOVERY_FROM_EXTERNAL_JSON.'
    ]
  },
  {
    title: 'COMMANDER_DATA_LOCK (AM_ONLY)',
    icon: <Lock className="text-terminal-red" size={24} />,
    content: [
      'COMMANDER_CATEGORY_IS_ENCRYPTED_VIA_ACCESS_KEY.',
      'PREVENTS_UNAUTHORIZED_ACCESS_OR_DATA_CORRUPTION.',
      'AM_MUST_INPUT_ACCESS_KEY_TO_DECRYPT_COMMANDER_METRICS.'
    ]
  },
  {
    title: 'OUTPUT_PROTOCOLS',
    icon: <Printer className="text-terminal-orange" size={24} />,
    content: [
      'GENERATE_A4_FEEDBACK_SHEET_VIA_PRINT_COMMAND.',
      'BATCH_PRINT_PROTOCOL_SENDS_ALL_UNIT_DATA_TO_OUTPUT_BUFFER.',
      'EXPORT_CSV_FOR_EXTERNAL_DATA_ANALYSIS_&_ARCHIVING.'
    ]
  },
  {
    title: 'ACTION_PLAN_MODULE',
    icon: <Zap className="text-terminal-orange" size={24} />,
    content: [
      'INTEGRATED_STRATEGIC_PLANNING_TOOL_FOR_COMMANDERS.',
      'ESTABLISH_GOALS_AT_CYCLE_START_&_TRACK_QUARTERLY.',
      'COPY_FINAL_REPORT_TO_CLIPBOARD_FOR_HQ_TRANSMISSION.'
    ]
  }
];

interface OperationGuideProps {
  onBack: () => void;
}

export const OperationGuide: React.FC<OperationGuideProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col font-mono relative overflow-hidden">
      <div className="grain pointer-events-none"></div>
      
      <header className="bg-terminal-rust text-terminal-orange p-4 sticky top-0 z-40 border-b-2 border-terminal-orange/30">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-terminal-orange hover:text-black transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold uppercase tracking-widest">OPERATION_MANUAL_V2.300</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 flex-grow w-full">
        <div className="bg-terminal-panel/10 border border-terminal-rust/30 p-4 mb-8 flex items-start gap-3">
          <HelpCircle className="text-terminal-orange shrink-0 mt-1" size={20} />
          <div>
            <h2 className="font-bold text-terminal-orange mb-1 uppercase tracking-widest text-sm">SYSTEM_SUPPORT</h2>
            <p className="text-[10px] text-terminal-green/80 leading-relaxed uppercase">
              THIS_OS_INTEGRATES_STAFF_EVALUATION_&_COMMANDER_STRATEGY_PROTOCOLS.
              PLEASE_REVIEW_THE_FOLLOWING_MODULES_FOR_OPTIMAL_SYNC.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((section, idx) => (
            <section key={idx} className="terminal-window p-6">
              <div className="flex items-center gap-3 mb-4 border-b border-terminal-rust/30 pb-2">
                {section.icon}
                <h3 className="text-sm font-bold text-terminal-orange uppercase tracking-widest">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.content.map((text, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-3 text-[10px] text-terminal-green/80 leading-relaxed uppercase">
                    <span className="w-5 h-5 bg-terminal-panel/20 text-terminal-rust border border-terminal-rust/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {tIdx + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-terminal-panel/10 border border-terminal-rust/30 text-terminal-rust text-center">
          <h3 className="font-bold mb-2 uppercase tracking-widest text-xs">DATA_INTEGRITY_WARNING</h3>
          <p className="text-[10px] text-terminal-rust/70 leading-relaxed uppercase">
            DATA_IS_STORED_IN_LOCAL_STORAGE_BUFFER.<br />
            CLEARING_BROWSER_CACHE_WILL_PURGE_ALL_LOGS.<br />
            REGULAR_BACKUP_PROTOCOLS_ARE_MANDATORY.
          </p>
        </div>
      </main>
    </div>
  );
};
