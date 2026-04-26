import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

export type AIPersona = 'normal' | 'strict' | 'mild' | 'logical';

export const generateEvaluationComment = async (
  itemName: string,
  desc: string,
  score: number,
  maxScore: number,
  criteria?: string,
  persona: AIPersona = 'normal'
): Promise<string> => {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API Key not found. Please set GEMINI_API_KEY.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Placeholder for Gemma-4 architecture
      contents: prompt,
      config: {
        systemInstruction: "あなたは優秀な評価者です。",
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("AIによる生成に失敗しました。");
  }
};
