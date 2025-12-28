
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
2. THẨM MỸ & THÂN THIỆN: Sử dụng các icon (🛡️, ⚠️, 🔍, ✅, 💡, 🚀) phù hợp để câu trả lời sinh động, dễ đọc cho học sinh.
3. PHẦN CHI TIẾT: Nếu nội dung cần giải thích sâu, hướng dẫn kỹ thuật hoặc quy trình dài (không giới hạn độ dài), hãy đặt toàn bộ trong thẻ [CHI TIẾT: ...]. Tuyệt đối không để nội dung dài ở phần trả lời chính.
4. Ưu tiên cảnh báo an toàn ngay lập tức nếu phát hiện dấu hiệu lừa đảo.
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
    - CAO: Nếu số điện thoại nằm trong blacklist, mạo danh công an/viện kiểm sát/ngân hàng qua điện thoại, yêu cầu OTP, hối thúc chuyển khoản tiền, Deepfake, hoặc link có đuôi lạ rủi ro cao.
    - TRUNG BÌNH: Người lạ làm quen, link lạ, mời đầu tư, tuyển CTV online, kịch bản có dấu hiệu hối thúc.
    - THẤP: Giao tiếp bình thường, không yêu cầu thông tin nhạy cảm.

    LỜI KHUYÊN:
    - Nếu đã chuyển tiền: Dừng ngay, liên hệ ngân hàng khóa tài khoản, báo cáo tại canhbao.khonggianmang.vn.
    - Nếu nghi ngờ: Áp dụng 3 Nguyên tắc vàng.` });
    
    if (imageBase64 && imageBase64.includes(',')) {
      const [header, data] = imageBase64.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({ inlineData: { mimeType, data } });
    }
    if (audioBase64) parts.push({ inlineData: { mimeType: audioMimeType, data: audioBase64 } });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: "Bạn là chuyên gia phân tích rủi ro của Trợ lý AI Lá Chắn Số. Trả về JSON theo đúng Schema.",
        responseMimeType: "application/json",
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
    return JSON.parse(response.text || "{}") as AnalysisResult;
  } catch (error: any) {
    let errorMessage = "Lá Chắn Số đang gặp sự cố kết nối với trí tuệ nhân tạo.";
    if (error.message?.includes("403") || error.message?.includes("forbidden") || error.message?.includes("API_KEY_INVALID")) {
      errorMessage = "LỖI HỆ THỐNG: Gemini API chưa được kích hoạt hoặc API Key không hợp lệ. Vui lòng nhấn nút 'ENABLE' trong Google Cloud Console như ảnh bạn đã tìm thấy!";
    }
    return { 
      riskLevel: RiskLevel.MEDIUM, 
      explanation: errorMessage, 
      isScam: false, 
      patternsFound: ["Lỗi cấu hình Google Cloud"], 
      recommendations: ["Vui lòng kiểm tra lại mục API & Services", "Đảm bảo Gemini API đã ở trạng thái ENABLED"] 
    };
  }
}

export async function fetchLatestScamNews(): Promise<ScamNews[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const timestamp = new Date().toLocaleString('vi-VN');

  try {
    // Model flash nhanh hơn đáng kể so với model pro cho các tác vụ tìm kiếm và tổng hợp
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `[Thời gian: ${timestamp}] Sử dụng Google Search để tìm kiếm 8-12 tin tức mới nhất về "lừa đảo qua mạng" tại Việt Nam từ các nguồn chính thống: nhandan.vn, vnexpress.net, tuoitre.vn, và baochinhphu.vn. 
      Yêu cầu: Trả về một mảng JSON các đối tượng {title, url, source, snippet, date}. 
      Snippet là bản tóm tắt cực kỳ ngắn gọn (không quá 2 câu). URL phải là link trực tiếp đến bài báo.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
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

    const parsed = JSON.parse(response.text || "[]") as ScamNews[];
    return parsed.map(item => ({
      ...item,
      date: item.date || "Cập nhật mới",
      snippet: item.snippet || "Vui lòng xem chi tiết tại link nguồn."
    }));
  } catch (error) {
    console.error("Lỗi fetch tin tức động:", error);
    // Chế độ dự phòng nếu AI search thất bại
    return [
      { title: "Cảnh báo thủ đoạn lừa đảo giả danh shipper", url: "https://vnexpress.net/tag/lua-dao-qua-mang-27298", source: "VnExpress", date: "Mới", snippet: "Kẻ gian gọi điện báo có đơn hàng, yêu cầu chuyển khoản trước hoặc click vào link lạ để nhận mã giảm giá." },
      { title: "Nâng cao cảnh giác với bẫy 'việc nhẹ lương cao'", url: "https://nhandan.vn/tu-khoa/luadaoquamang-tag20806.html", source: "Báo Nhân Dân", date: "Mới", snippet: "Học sinh sinh viên cần cẩn trọng với các lời mời chốt đơn Shopee, Lazada nhận hoa hồng cực cao." }
    ];
  }
}

export async function fetchLatestScamScenario(): Promise<ScamScenario> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Tạo một kịch bản lừa đảo công nghệ cao mới nhất nhắm vào học sinh THPT. Trả về JSON.",
      config: { 
        responseMimeType: "application/json",
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
      description: "Hệ thống AI đang tạm nghỉ để bảo trì cấu hình Google Cloud.",
      signs: ["Lỗi kết nối API"],
      prevention: "Hãy đảm bảo Gemini API đã được ENABLE trong bảng điều khiển Google Cloud."
    };
  }
}
