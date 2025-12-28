
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel, ScamScenario, ChatMessage, ScamNews } from "../types";

const TEEN_CODE_MAP: Record<string, string> = {
  "ko": "không", "k": "không", "khong": "không", "hông": "không", "kg": "không",
  "j": "gì", "jz": "gì vậy", "gì z": "gì vậy", "gì zậy": "gì vậy",
  "ib": "nhắn tin", "inbox": "nhắn tin",
  "acc": "tài khoản", "account": "tài khoản",
  "ck": "chuyển khoản", "stk": "số tài khoản",
  "rep": "trả lời", "feedback": "phản hồi",
  "b": "bạn", "m": "mình", "e": "em", "a": "anh",
  "tks": "cảm ơn", "thx": "cảm ơn", "cmon": "cảm ơn",
  "đc": "được", "dc": "được",
  "v": "vậy", "vậy hả": "vậy à",
  "s": "sao", "shao": "sao",
  "bt": "biết", "bik": "biết",
  "tl": "trả lời", "tlai": "tương lai",
  "otp": "mã xác thực", "pass": "mật khẩu"
};

const SCAM_PHONE_DATABASE = `
1. ĐẦU SỐ QUỐC TẾ LỪA ĐẢO:
- Mã quốc gia: +226 (Burkina Faso), +373 (Moldova), +240 (Equatorial Guinea), +216 (Tunisia), +370, +563, +255, +371, +224, +252, +232, +231, +381, +375, +247.
- Số cụ thể: +22375260052, +22382271520, +8919008198, +22379262886, +4422222202.

2. ĐẦU SỐ TRONG NƯỚC NGHI VẤN:
- Đầu số: +024, +1900, +028.
- Danh sách 024: 02439446395, 02499950060, 02499954266, 0249997041, 02444508888, 02499950412, 0249997037, 02499997044, 02499950212, 02499950036, 0249997038, 0249992623, 0249997035, 0249994266, 02499985212, 0245678520, 02499985220, 0249997044.
- Danh sách 1900: 19003439, 19004510, 19002191, 19003441, 19002170, 19002446, 19001095, 19002190, 19002196, 19004562, 19003440, 19001199.
- Danh sách 028: 02899964439, 02856786501, 02899964438, 02899964437, 02873034653, 02899950012, 02873065555, 02899964448, 02822000266, 0287108690, 02899950015, 02899958588, 02871099082, 02899996142.
`;

export function normalizeTeenCode(text: string): string {
  let normalized = text.toLowerCase();
  Object.entries(TEEN_CODE_MAP).forEach(([key, value]) => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    normalized = normalized.replace(regex, value);
  });
  return normalized;
}

export const SAFE_BUDDY_INSTRUCTION = `
BẢN SẮC: Bạn là "Trợ lý AI Lá Chắn Số" (LCS).
KIẾN THỨC CỐT LÕI:
- Tuân thủ "3 Nguyên tắc vàng": HÃY CHẬM LẠI - KIỂM TRA TẠI CHỖ - DỪNG LẠI! KHÔNG GỬI.
- Tuân thủ "Quy tắc 6 KHÔNG" của Cục An toàn thông tin.
- Nắm vững danh sách đầu số lừa đảo: ${SCAM_PHONE_DATABASE}

QUY TẮC PHẢN HỒI (RẤT QUAN TRỌNG):
1. CÂU TRẢ LỜI CHÍNH PHẢI DƯỚI 100 CHỮ: Luôn súc tích, đi thẳng vào vấn đề.
2. THẨM MỸ & THÂN THIỆN: Sử dụng các icon phù hợp để câu trả lời sinh động.
3. PHẦN CHI TIẾT: Nếu nội dung cần giải thích sâu, hãy đặt toàn bộ trong thẻ [CHI TIẾT: ...].
4. Luôn ưu tiên cảnh báo an toàn ngay lập tức.
`;

export async function analyzeContent(
  content: string, 
  imageBase64?: string, 
  audioBase64?: string,
  audioMimeType: string = 'audio/mpeg'
): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const parts: any[] = [];
    const normalizedContent = normalizeTeenCode(content);
    
    parts.push({ text: `Phân tích tình huống này dựa trên Database đầu số lừa đảo: ${SCAM_PHONE_DATABASE}.
    
    Dữ liệu người dùng: "${normalizedContent}"
    
    PHÂN LOẠI RỦI RO (BẮT BUỘC):
    - CAO: Nếu số điện thoại nằm trong blacklist, mạo danh công an/ngân hàng, yêu cầu OTP, hối thúc chuyển khoản, Deepfake, link lạ.
    - TRUNG BÌNH: Người lạ làm quen, link lạ, tuyển CTV online.
    - THẤP: Giao tiếp bình thường.

    Trả về JSON theo schema.` });
    
    if (imageBase64 && imageBase64.includes(',')) {
      const [header, data] = imageBase64.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({ inlineData: { mimeType, data } });
    }
    if (audioBase64) parts.push({ inlineData: { mimeType: audioMimeType, data: audioBase64 } });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: "Bạn là chuyên gia phân tích rủi ro an ninh mạng. Hãy suy nghĩ thật kỹ trước khi trả lời.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 8192 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["THẤP", "TRUNG BÌNH", "CAO"] },
            explanation: { type: Type.STRING },
            isScam: { type: Type.BOOLEAN },
            patternsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["riskLevel", "explanation", "isScam", "patternsFound", "recommendations"]
        }
      }
    });
    
    const resultText = response.text || "{}";
    return JSON.parse(resultText) as AnalysisResult;
  } catch (error: any) {
    console.error("Lỗi phân tích Gemini:", error);
    return { 
      riskLevel: RiskLevel.MEDIUM, 
      explanation: "Không thể kết nối với trung tâm phân tích AI. Vui lòng thử lại sau.", 
      isScam: false, 
      patternsFound: ["Lỗi kết nối API"], 
      recommendations: ["Kiểm tra kết nối internet", "Liên hệ admin nếu lỗi kéo dài"] 
    };
  }
}

export async function fetchLatestScamNews(): Promise<ScamNews[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const timestamp = new Date().toLocaleString('vi-VN');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `[Thời gian: ${timestamp}] Tìm kiếm 8-10 tin tức mới nhất về "lừa đảo qua mạng" tại Việt Nam. Nguồn: nhandan.vn, vnexpress.net, tuoitre.vn. Trả về mảng JSON.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4096 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              url: { type: Type.STRING },
              source: { type: Type.STRING },
              snippet: { type: Type.STRING },
              date: { type: Type.STRING }
            },
            required: ["title", "url", "source", "snippet"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]") as ScamNews[];
  } catch (error) {
    console.error("Lỗi fetch tin tức động:", error);
    return [
      { title: "Cảnh báo thủ đoạn lừa đảo giả danh shipper", url: "https://vnexpress.net/tag/lua-dao-qua-mang-27298", source: "VnExpress", date: "Mới", snippet: "Kẻ gian gọi điện báo có đơn hàng, yêu cầu chuyển khoản trước." }
    ];
  }
}

export async function fetchLatestScamScenario(): Promise<ScamScenario> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: "Tạo một kịch bản lừa đảo công nghệ cao mới nhất nhắm vào học sinh THPT. Trả về JSON.",
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4096 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            signs: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.STRING }
          },
          required: ["title", "category", "description", "signs", "prevention"]
        }
      }
    });
    const data = JSON.parse(response.text || "{}");
    return { ...data, id: `lcs-${Date.now()}` };
  } catch (e) {
    return {
      id: `lcs-err-${Date.now()}`,
      title: "Cảnh báo hệ thống",
      category: "Kỹ thuật",
      description: "Hệ thống Radar đang gặp sự cố kết nối.",
      signs: ["Lỗi API"],
      prevention: "Hãy cập nhật lại ứng dụng."
    };
  }
}
