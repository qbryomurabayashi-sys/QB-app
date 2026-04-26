import { CreateMLCEngine, MLCEngine, hasModelInCache } from "@mlc-ai/web-llm";
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
let webLLMEngine: MLCEngine | null = null;
let initEnginePromise: Promise<MLCEngine> | null = null;

export type AIPersona = 'normal' | 'strict' | 'mild' | 'logical';

let isLocalAiReadyFlag = false;

export const isLocalAiReady = () => isLocalAiReadyFlag;

export const setLocalAiReady = (ready: boolean) => {
  isLocalAiReadyFlag = ready;
};

export const AVAILABLE_MODELS = [
  { id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC', name: 'Llama 3.2 1B (スマホ推奨 / 軽量)', size: '約800MB' },
  { id: 'gemma-2-2b-it-q4f16_1-MLC-1k', name: 'Gemma 2 2B (PC推奨 / 高性能)', size: '約1.6GB' }
];

// 現在選択されているモデル（設定がない場合はデフォルトとして一番小さめのものを対象にしつつ、ダウンロードUIで選べるようにする）
export let selectedModelId = AVAILABLE_MODELS[0].id;

// 現在の初期化進捗を保持する
let currentProgressReport: { progress: number, text: string } | null = null;
const progressCallbacks: ((report: { progress: number, text: string }) => void)[] = [];

// バックグラウンドでキャッシュをチェックし、存在すれば静かに初期化する
const initAiBackground = async () => {
  try {
    for (const model of AVAILABLE_MODELS) {
      const isCached = await hasModelInCache(model.id);
      if (isCached && !webLLMEngine && !initEnginePromise) {
        selectedModelId = model.id;
        console.log(`Model ${model.id} is cached. Initializing in background...`);
        initEnginePromise = CreateMLCEngine(selectedModelId, {
          initProgressCallback: (report) => {
            currentProgressReport = report;
            console.log("Background init progress:", report.text);
            progressCallbacks.forEach(cb => cb(report));
          }
        });
        webLLMEngine = await initEnginePromise;
        isLocalAiReadyFlag = true;
        currentProgressReport = { progress: 1, text: "準備完了" };
        console.log("Background init complete!");
        break; // 最初に見つかったキャッシュ済みモデルをロード
      }
    }
  } catch (error) {
    console.warn("Background init failed", error);
    initEnginePromise = null;
    currentProgressReport = null;
  }
};

// モジュール読み込み時に実行
initAiBackground();

export const downloadModel = async (modelId: string, onProgress: (progress: number, text?: string) => void): Promise<void> => {
  if (webLLMEngine && selectedModelId === modelId) {
    onProgress(100, "準備完了");
    return;
  }
  
  // 違うモデルがロードされている場合はリセット
  if (webLLMEngine && selectedModelId !== modelId) {
    webLLMEngine = null;
    initEnginePromise = null;
    isLocalAiReadyFlag = false;
  }

  selectedModelId = modelId;

  // 既に初期化中ならそれに乗っかる
  if (initEnginePromise) {
    if (currentProgressReport) {
      onProgress(Math.round(currentProgressReport.progress * 100), currentProgressReport.text);
    }
    const cb = (report: { progress: number, text: string }) => {
      onProgress(Math.round(report.progress * 100), report.text);
    };
    progressCallbacks.push(cb);
    try {
      await initEnginePromise;
      currentProgressReport = { progress: 1, text: "準備完了" };
      onProgress(100, "準備完了");
      isLocalAiReadyFlag = true;
      return;
    } catch (error) {
       // エラー時はフォールスルーして再度試行
       initEnginePromise = null;
    } finally {
      const idx = progressCallbacks.indexOf(cb);
      if (idx > -1) {
        progressCallbacks.splice(idx, 1);
      }
    }
  }
  
  try {
    initEnginePromise = CreateMLCEngine(selectedModelId, {
      initProgressCallback: (report) => {
        onProgress(Math.round(report.progress * 100), report.text);
        progressCallbacks.forEach(cb => cb(report));
      }
    });
    
    webLLMEngine = await initEnginePromise;
    isLocalAiReadyFlag = true;
    onProgress(100, "準備完了");
  } catch (error) {
    webLLMEngine = null;
    initEnginePromise = null;
    isLocalAiReadyFlag = false;
    console.error("WebLLM Error:", error);
    onProgress(0, `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

// ... inside generateEvaluationComment ...
const generateMockComment = (
  itemName: string,
  score: number,
  maxScore: number,
  persona: AIPersona
): string => {
  const isPerfect = score >= maxScore;
  const isGood = score >= maxScore * 0.7;

  if (persona === 'strict') {
    if (isPerfect) return `「${itemName}」の基準は満たしています。現状に満足せず、さらに精度を高めるよう努めてください。`;
    if (isGood) return `「${itemName}」は一定の基準を満たしていますが、プロフェッショナルとしてはまだ不足があります。早急に改善が必要です。`;
    return `「${itemName}」についての意識が決定的に不足しています。カット専門店としての基本に立ち返り、行動を根本から見直してください。`;
  }
  
  if (persona === 'mild') {
    if (isPerfect) return `「${itemName}」について、完璧な対応ができていますね！この調子で、あなたの強みとしてこれからも生かしていきましょう。`;
    if (isGood) return `「${itemName}」はとてもよく頑張っているのが伝わります。あと少し意識するだけでさらに良くなりますよ、応援しています！`;
    return `今は「${itemName}」に少し苦戦しているかもしれませんが、一つずつできることを増やしていけば大丈夫です。一緒に改善していきましょう。`;
  }
  
  if (persona === 'logical') {
    if (isPerfect) return `「${itemName}」の項目において満点です。提供スピードと品質のバランスが最適化されています。`;
    if (isGood) return `「${itemName}」の達成率は概ね良好ですが、一部のフローにおいて効率化の余地が見られます。手順の再確認が有効です。`;
    return `「${itemName}」のスコアが基準を下回っています。ボトルネックを特定し、業務フローの抜本的な改善策を実施する必要があります。`;
  }

  // normal
  if (isPerfect) return `「${itemName}」について、素晴らしい対応ができています。引き続きこの品質を維持してください。`;
  if (isGood) return `「${itemName}」は基本的にはできていますが、もう一歩工夫するとさらに良くなります。`;
  return `「${itemName}」に課題が見られます。専門店としてのスムーズなサービス提供に向けて、手順を見直してみましょう。`;
};

export const generateEvaluationComment = async (
  itemName: string,
  desc: string,
  score: number,
  maxScore: number,
  criteria?: string,
  persona: AIPersona = 'normal'
): Promise<string> => {
  let personaInstruction = "短く、丁寧なトーン（〜です、〜ましょう。〜できているので素晴らしいです。等）で作成してください。";
  if (persona === 'strict') {
    personaInstruction = "基準に対して厳格に評価し、不足している部分や改善すべき点をストレートに指摘する、妥協なき「辛口」のトーンで作成してください。";
  } else if (persona === 'mild') {
    personaInstruction = "肯定的な言葉を多く使い、小さな長所や努力を大いに褒めて、優しく励ますような温かい「甘口」のトーンで作成してください。";
  } else if (persona === 'logical') {
    personaInstruction = "感情的な表現は排除し、現在のスコアに基づく事実と因果関係の分析から、客観的で構造的な「論理的」なトーンで作成してください。";
  }

  const prompt = `以下の条件と評価内容に基づき、スタッフへの「一言フィードバックコメント」を1〜2文で生成してください。

【前提条件 (あなたの思考として留め、直接言葉には出さないでください)】
・「企業理念」と「Less is more」の精神を体現する。
・当店はヘアカット専門店であり、シャンプー、ブロー、髭剃り、カラー、パーマなどのメニューは一切ありません。
・券売機による前払い制で、原則として受付はありません（一部プレミアム店舗のみ受付・後払い）。
・店舗内に電話はありません。

【評価項目】: ${itemName}
【評価のポイント】: ${desc}

【今回のスコア】: ${score} / ${maxScore}
${criteria ? `【スコアの判定コメント】: ${criteria}` : ""}

【出力指示】
・上記の評価のポイントと判定コメントを参考に、点数が高い場合は具体的な称賛と強みの確認、点数が低い場合は「さらに良くするための具体的なアドバイス（シャンプー等のメニューがない環境での改善案）」を生成してください。
・${personaInstruction}
・「企業理念」や「Less is more」という単語は絶対に使用しないでください。`;

  try {
    // 1. WebLLM (自動ダウンロードされたローカルモデル) が準備完了している場合
    if (webLLMEngine) {
      try {
        const reply = await webLLMEngine.chat.completions.create({
          messages: [
            { role: "system", content: "あなたは優秀な評価者です。" },
            { role: "user", content: prompt }
          ],
        });
        if (reply.choices[0]?.message?.content) {
          return reply.choices[0].message.content.trim();
        }
      } catch (e) {
        console.warn("WebLLM generation failed, falling back...", e);
      }
    }

    // 2. クラウド提供のGemini APIを利用する場合 (クライアントサイド)
    const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (apiKey) {
      if (!ai) ai = new GoogleGenAI({ apiKey });
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash", 
          contents: prompt,
          config: { systemInstruction: "あなたは優秀な評価者です。" }
        });
        if (response.text) return response.text.trim();
      } catch (e) {
        console.warn("Cloud Gemini API failed", e);
      }
    }
    
    // 3. どちらも利用できない場合 (APIキーなし、ネイティブ非対応など)
    // ローカルAIのフォールバック動作としてルールベースの返答をシミュレート
    console.info("Using simulated local AI response.");
    await new Promise(resolve => setTimeout(resolve, 800)); // 少しの遅延
    return generateMockComment(itemName, score, maxScore, persona);
  } catch (error) {
    console.error("AI Generation Error:", error);
    // エラー時もフォールバックを利用して完了させる
    return generateMockComment(itemName, score, maxScore, persona);
  }
};
