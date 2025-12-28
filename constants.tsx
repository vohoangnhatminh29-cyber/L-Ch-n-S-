
import { ScamScenario, SafetyRule, HandlingStep, ScamVideo, Question } from './types';

export const GOLDEN_RULES: SafetyRule[] = [
  { id: 'g1', title: 'HÃY CHẬM LẠI', content: 'Kẻ lừa đảo tạo cảm giác cấp bách để bạn không kịp suy nghĩ. Hãy dành thời gian suy nghĩ kỹ và đặt câu hỏi để tránh bị dồn vào tình huống xấu.', icon: '⏱️' },
  { id: 'g2', title: 'KIỂM TRA TẠI CHỖ', content: 'Tra cứu số điện thoại, ngân hàng, cơ quan gọi đến qua các kênh chính thống để xác thực thông tin. Đừng bao giờ nhấn vào link lạ.', icon: '🔍' },
  { id: 'g3', title: 'DỪNG LẠI! KHÔNG GỬI', content: 'Không cá nhân hay cơ quan nào yêu cầu thanh toán ngay tại chỗ. Nếu thấy giao dịch không đáng tin, hãy dừng lại vì đó là dấu hiệu lừa đảo.', icon: '✋' }
];

export const RULES_6_NO: string[] = [
  'KHÔNG cung cấp thông tin cá nhân, địa chỉ, số điện thoại, số tài khoản cho người không quen biết.',
  'KHÔNG kết bạn và nói chuyện với người lạ có hình ảnh ngoại hình đẹp, bắt mắt trên mạng xã hội.',
  'KHÔNG truy cập, đăng nhập vào các đường dẫn, website, ứng dụng không rõ nguồn gốc.',
  'KHÔNG làm việc qua điện thoại với người tự xưng là cán bộ công an, viện kiểm sát, tòa án.',
  'KHÔNG thực hiện chuyển khoản trước, đặt cọc cho người lạ trong bất cứ trường hợp nào.',
  'KHÔNG tham lam những tài sản, món quà, lợi nhuận "phi thực tế" được mời chào qua mạng.'
];

export const EMERGENCY_HANDLING: HandlingStep[] = [
  {
    condition: 'Nếu bạn đã lỡ chuyển tiền cho kẻ lừa đảo',
    actions: [
      'Dừng ngay việc chuyển thêm tiền và chặn liên lạc từ kẻ lừa đảo.',
      'Liên hệ ngân hàng ngay lập tức để yêu cầu đóng băng giao dịch và khóa tài khoản.',
      'Sao lưu toàn bộ lịch sử trò chuyện, biên lai chuyển tiền làm bằng chứng.',
      'Làm đơn tố giác gửi cơ quan Công an nơi cư trú hoặc qua trang canhbao.khonggianmang.vn.'
    ]
  },
  {
    condition: 'Nếu bị lộ thông tin cá nhân hoặc tài khoản',
    actions: [
      'Thay đổi mật khẩu tất cả các tài khoản trực tuyến (Facebook, Zalo, Ngân hàng).',
      'Kích hoạt xác thực 2 lớp (2FA) ngay lập tức.',
      'Cảnh báo cho gia đình và bạn bè về trường hợp của mình để họ không bị lừa lây.',
      'Quét virus thiết bị bằng phần mềm bảo mật uy tín.'
    ]
  }
];

export const RESEARCH_DATA = [
  { name: 'Đầu tư tài chính ảo', value: 35, color: '#3b82f6' },
  { name: 'Mạo danh công quyền', value: 25, color: '#ef4444' },
  { name: 'Việc làm online/CTV', value: 20, color: '#10b981' },
  { name: 'Lừa đánh cắp MXH', value: 15, color: '#f59e0b' },
  { name: 'Lừa đảo tình cảm', value: 5, color: '#8b5cf6' }
];

export const SCAM_SCENARIOS: ScamScenario[] = [
  {
    id: 'scam_1',
    title: 'Lừa đảo "Việc nhẹ lương cao" (Tuyển cộng tác viên)',
    category: 'Việc làm',
    description: 'Nhắm vào học sinh, sinh viên. Tiếp cận qua Facebook/TikTok tuyển CTV chốt đơn Shopee, Lazada. Ban đầu cho làm nhiệm vụ nhỏ để lấy lòng tin, sau đó yêu cầu nạp số tiền lớn và lấy lý do hệ thống lỗi để yêu cầu nạp thêm tiền giải ngân rồi chiếm đoạt.',
    signs: [
      'Tuyển CTV chốt đơn Shopee/Lazada, xem TikTok kiếm tiền.',
      'Yêu cầu nạp tiền để làm "nhiệm vụ cao cấp".',
      'Lấy lý do "sai cú pháp", "lỗi hệ thống" để yêu cầu nạp thêm tiền giải ngân.'
    ],
    prevention: 'Tuyệt đối không tham gia các công việc yêu cầu nạp tiền trước. Cơ quan chức năng khuyến cáo: Tiền đặt cọc/nạp tiền làm nhiệm vụ 100% là lừa đảo.'
  },
  {
    id: 'scam_2',
    title: 'Giả danh cơ quan chức năng (Công an, Viện kiểm sát)',
    category: 'Mạo danh',
    description: 'Kẻ lừa đảo gọi điện dọa nạt bạn liên quan đến vụ án ma túy hoặc rửa tiền. Chúng gửi lệnh bắt giam giả mạo qua Zalo để gây áp lực và yêu cầu chuyển tiền vào "tài khoản tạm giữ" để kiểm tra tài sản.',
    signs: [
      'Gọi điện (VoIP) tự xưng là cán bộ Công an, Viện kiểm sát.',
      'Gửi lệnh bắt giam giả mạo qua Zalo/Facebook.',
      'Yêu cầu chuyển tiền vào tài khoản cá nhân để "xác minh nguồn tiền".'
    ],
    prevention: 'Cơ quan Công an không bao giờ làm việc qua điện thoại hay yêu cầu chuyển tiền. Hãy gác máy và báo ngay cho công an địa phương.'
  },
  {
    id: 'scam_3',
    title: 'Lừa đảo "Deepfake" (Giả mạo hình ảnh, giọng nói)',
    category: 'Công nghệ cao',
    description: 'Sử dụng AI để tạo video/cuộc gọi có hình ảnh và giọng nói giống hệt người thân để mượn tiền gấp vì đang gặp nạn. Kẻ gian thường giả vờ sóng yếu, hình ảnh mờ nhạt để che giấu sự bất thường của AI.',
    signs: [
      'Cuộc gọi video ngắn, hình ảnh mờ, giật lag, thiếu cảm xúc.',
      'Âm thanh không đồng nhất với hình ảnh, có tiếng ồn lạ.',
      'Nội dung mượn tiền gấp vào tài khoản không phải của chính chủ người thân.'
    ],
    prevention: 'Cúp máy và gọi lại vào số điện thoại thường dùng của người đó. Hỏi những câu hỏi riêng tư chỉ hai người biết để xác minh.'
  },
  {
    id: 'scam_4',
    title: 'Bẫy tình cảm và "Thùng quà từ nước ngoài"',
    category: 'Tình cảm',
    description: 'Kẻ lừa đảo dùng hình ảnh trai đẹp/thành đạt làm quen, yêu đương qua mạng. Sau đó thông báo gửi thùng quà giá trị cao bị kẹt tại hải quan vì chứa lượng tiền lớn trái phép, yêu cầu nộp "phí bôi trơn".',
    signs: [
      'Trai đẹp/thành đạt làm quen, yêu đương nồng nhiệt.',
      'Thông báo gửi quà/tiền trị giá lớn từ nước ngoài về.',
      'Giả danh nhân viên hải quan yêu cầu nộp phí phạt/phí thông quan vào tài khoản cá nhân.'
    ],
    prevention: 'Không chuyển tiền cho người mới quen qua mạng xã hội. Hải quan không bao giờ yêu cầu nộp tiền phạt vào tài khoản cá nhân.'
  },
  {
    id: 'scam_5',
    title: 'Lừa đảo "Combo du lịch giá rẻ"',
    category: 'Mua sắm',
    description: 'Đăng tải bài viết quảng cáo tour du lịch, phòng khách sạn giá rẻ (giảm 30-50%). Yêu cầu nạn nhân chuyển khoản đặt cọc sau đó chặn liên lạc.',
    signs: [
      'Giá rẻ bất ngờ (30-50% thị trường).',
      'Làm giả website/fanpage của công ty uy tín.',
      'Dùng đuôi tên miền lạ như .cc, .xyz, .tk.'
    ],
    prevention: 'Lựa chọn đặt tour qua các App du lịch uy tín. Đề nghị phía đối tác cho xem giấy phép kinh doanh.'
  },
  {
    id: 'scam_6',
    title: 'Lừa đảo "Khóa SIM" vì chưa chuẩn hóa thuê bao',
    category: 'Viễn thông',
    description: 'Mạo danh cán bộ nhà mạng gọi điện thông báo số điện thoại bị khóa do thông sai thông tin. Dẫn dụ nạn nhân thực hiện cú pháp chuyển hướng cuộc gọi để chiếm đoạt mã OTP ví điện tử.',
    signs: [
      'Thông báo khóa SIM trong 2 tiếng.',
      'Yêu cầu thực hiện cú pháp sang tên đổi chủ qua điện thoại.',
      'Yêu cầu cung cấp thông tin cá nhân/OTP.'
    ],
    prevention: 'Chủ động kiểm tra thông tin qua ứng dụng chính thức của nhà mạng (My Viettel, My VNPT). Không làm theo yêu cầu từ số lạ.'
  },
  {
    id: 'scam_7',
    title: 'Giả mạo biên lai chuyển tiền thành công',
    category: 'Tài chính',
    description: 'Mua hàng số lượng lớn rồi gửi ảnh chụp biên lai thanh toán đã được chỉnh sửa phần mềm. Nạn nhân chưa thấy tiền về nhưng đã giao hàng do tin vào ảnh chụp.',
    signs: [
      'Biên lai có phông chữ, màu sắc khác thường.',
      'Hối thúc lấy hàng ngay khi gửi ảnh biên lai.',
      'Lấy lý do ngân hàng lỗi nên tiền chưa về kịp.'
    ],
    prevention: 'Chỉ giao hàng khi tài khoản đã báo Có thực tế. Không tin vào ảnh chụp màn hình.'
  },
  {
    id: 'scam_8',
    title: 'Giả danh giáo viên/nhân viên y tế (Con đang cấp cứu)',
    category: 'Mạo danh',
    description: 'Gọi điện báo tin con em đang cấp cứu nguy kịch, cần tiền đóng viện phí gấp để phẫu thuật. Thao túng tâm lý bằng sự lo sợ của phụ huynh.',
    signs: [
      'Gọi vào giờ nghỉ trưa/giữa đêm.',
      'Sử dụng từ ngữ tiêu cực gây hoảng loạn.',
      'Biết rõ tên trường, lớp, giáo viên chủ nhiệm của con.'
    ],
    prevention: 'Bình tĩnh liên lạc trực tiếp với nhà trường hoặc giáo viên chủ nhiệm để xác minh thông tin.'
  },
  {
    id: 'scam_9',
    title: 'Chiêu trò tuyển người mẫu nhí',
    category: 'Việc làm',
    description: 'Mời phụ huynh cho con tham gia ứng tuyển người mẫu nhí. Thử thách là phải chuyển tiền mua sản phẩm hàng hiệu để con làm mẫu chụp ảnh.',
    signs: [
      'Mời qua các group Zalo/Telegram.',
      'Yêu cầu mua sản phẩm và cam kết hoàn lại tiền cộng hoa hồng.',
      'Số tiền yêu cầu tăng dần theo thời gian.'
    ],
    prevention: 'Không làm việc với bất kỳ nhà tuyển dụng nào yêu cầu nộp tiền trước.'
  },
  {
    id: 'scam_10',
    title: 'Giả danh công ty tài chính, ngân hàng cho vay lãi suất thấp',
    category: 'Tài chính',
    description: 'Chào mời vay tín chấp lãi suất 1%/tháng, thủ tục đơn giản. Yêu cầu nộp tiền để bảo đảm khoản vay hoặc phí sửa lỗi hồ sơ rồi chiếm đoạt.',
    signs: [
      'Quảng cáo vay nhanh, nợ xấu vẫn vay được.',
      'Yêu cầu nộp phí "xác minh hồ sơ".',
      'Chỉ cần ảnh CCCD và thẻ ATM.'
    ],
    prevention: 'Chỉ vay tiền tại các tổ chức tín dụng có trụ sở rõ ràng. Không nộp phí để được giải ngân.'
  },
  {
    id: 'scam_11',
    title: 'Cài cắm ứng dụng cờ bạc, tín dụng đen',
    category: 'Công nghệ cao',
    description: 'Dẫn dụ tải App vay tiền hoặc cá độ. Khi cài đặt, App sẽ sao lưu danh bạ và hình ảnh để dùng làm bằng chứng đe dọa, đòi nợ sau này.',
    signs: [
      'Quảng cáo vay siêu tốc nhận tiền sau 30 phút.',
      'Yêu cầu quyền truy cập danh bạ, ảnh.',
      'Lãi suất mập mờ, phí dịch vụ cực cao.'
    ],
    prevention: 'Không cài đặt ứng dụng từ các nguồn không rõ ràng. Không cấp quyền truy cập nhạy cảm cho các App vay tiền.'
  },
  {
    id: 'scam_12',
    title: 'Giả mạo trang thông tin điện tử (BHXH, Ngân hàng)',
    category: 'Mạo danh',
    description: 'Tạo website giao diện y hệt trang chính thống (đuôi .xyz, .top). Dẫn dụ người dùng nhập thông tin tài khoản ngân hàng để nhận trợ cấp BHXH.',
    signs: [
      'Tên miền lạ (vn-ms.top, vn-cbs.xyz).',
      'Yêu cầu đăng nhập tài khoản ngân hàng ngay trên web.',
      'Thiếu biểu tượng ổ khóa an toàn.'
    ],
    prevention: 'Kiểm tra kỹ URL. Trang chính thống luôn kết thúc bằng .gov.vn hoặc .vn. Không nhập OTP vào các trang lạ.'
  },
  {
    id: 'scam_13',
    title: 'Phát tán tin nhắn giả mạo thương hiệu (SMS Brandname)',
    category: 'Viễn thông',
    description: 'Sử dụng trạm BTS giả để gửi tin nhắn xuất hiện cùng luồng với tin nhắn của ngân hàng chính thống, yêu cầu click vào link để cập nhật thông tin.',
    signs: [
      'Tin nhắn chứa link đăng nhập tài khoản.',
      'Xuất hiện trong cùng hộp thư với tin nhắn thật của ngân hàng.',
      'Thường gửi vào đêm khuya hoặc ngày nghỉ.'
    ],
    prevention: 'Ngân hàng không bao giờ gửi link yêu cầu cung cấp mật khẩu/OTP qua tin nhắn.'
  },
  {
    id: 'scam_14',
    title: 'Lừa đảo đầu tư chứng khoán quốc tế, tiền ảo',
    category: 'Đầu tư',
    description: 'Lời hứa lợi nhuận cực cao, cam kết không rủi ro. Yêu cầu chuyển tiền vào các sàn giao dịch giả mạo để tham gia đội nhóm "chuyên gia".',
    signs: [
      'Lợi nhuận hứa hẹn 20-30%/tháng.',
      'Thiếu thông tin minh bạch về giấy phép.',
      'Chỉ cho nạp tiền, khi rút tiền thì báo lỗi.'
    ],
    prevention: 'Chỉ đầu tư chứng khoán tại các công ty được Ủy ban Chứng khoán Nhà nước cấp phép.'
  },
  {
    id: 'scam_15',
    title: 'Đánh cắp tài khoản MXH, nhắn tin mượn tiền',
    category: 'Mạng xã hội',
    description: 'Hack Facebook/Zalo rồi nhắn tin mượn tiền người thân. Sử dụng các kịch bản khẩn cấp như đang đóng phí viện phí, mua hàng thiếu tiền.',
    signs: [
      'Cách xưng hô bất thường.',
      'Yêu cầu chuyển tiền vào số tài khoản lạ.',
      'Lấy lý do đang bận không thể nghe điện thoại.'
    ],
    prevention: 'Luôn gọi điện trực tiếp hoặc gặp mặt xác minh trước khi chuyển tiền theo yêu cầu qua tin nhắn.'
  },
  {
    id: 'scam_16',
    title: 'Rao bán hàng giả hàng nhái qua sàn TMĐT',
    category: 'Mua sắm',
    description: 'Rao bán hàng hiệu với giá cực rẻ. Sau khi nhận thanh toán hoặc tiền cọc, giao hàng giả hoặc chặn liên lạc.',
    signs: [
      'Giá quá rẻ so với thị trường.',
      'Tài khoản người bán mới lập, thiếu đánh giá.',
      'Ảnh sản phẩm mờ nhạt, copy từ trang khác.'
    ],
    prevention: 'Chỉ mua hàng trên các shop có chứng nhận uy tín (Mall, Shop yêu thích).'
  },
  {
    id: 'scam_17',
    title: 'Đánh cắp thông tin CCCD đi vay tín dụng',
    category: 'Cá nhân',
    description: 'Lừa nạn nhân chụp ảnh CCCD hai mặt và ảnh chân dung. Sau đó dùng thông tin này để đăng ký mã số thuế ảo hoặc vay tiền app.',
    signs: [
      'Yêu cầu gửi ảnh CCCD để làm "hồ sơ nhận thưởng".',
      'Yêu cầu chụp ảnh chân dung xác thực.',
      'Tiết lộ thông tin nhạy cảm qua Zalo/Facebook cho người lạ.'
    ],
    prevention: 'Tuyệt đối không gửi ảnh CCCD/CCCD gắn chip cho người không quen biết.'
  },
  {
    id: 'scam_18',
    title: 'Lừa đảo "chuyển nhầm tiền" vào tài khoản',
    category: 'Tài chính',
    description: 'Cố ý chuyển một khoản tiền vào tài khoản nạn nhân, sau đó đóng vai người thu nợ đòi lại kèm lãi suất cao, coi đó là khoản vay.',
    signs: [
      'Nhận tiền lạ từ người không quen.',
      'Đối tượng xưng là nhân viên ngân hàng/công ty đòi nợ gọi đến yêu cầu trả lại.',
      'Yêu cầu chuyển trả vào tài khoản khác với tài khoản đã gửi đến.'
    ],
    prevention: 'Không tiêu số tiền lạ. Chủ động ra ngân hàng để làm thủ tục hoàn trả chính thống.'
  },
  {
    id: 'scam_19',
    title: 'Dịch vụ "lấy lại tiền" khi đã bị lừa',
    category: 'Mạo danh',
    description: 'Tiếp cận người vừa bị lừa, cam kết lấy lại được tiền (đóng vai luật sư/công an mạng). Yêu cầu đóng "phí hồ sơ" rồi biến mất.',
    signs: [
      'Cam kết lấy lại 100% số tiền đã mất.',
      'Yêu cầu nộp phí xử lý pháp lý trước.',
      'Dùng hồ sơ, trang web giả mạo cơ quan pháp luật.'
    ],
    prevention: 'Chỉ báo cáo sự việc cho Cơ quan Công an. Không tin vào dịch vụ lấy lại tiền trên mạng.'
  },
  {
    id: 'scam_20',
    title: 'Lừa đảo lấy cắp Telegram OTP',
    category: 'Bảo mật',
    description: 'Gửi thông báo giả từ hệ thống Telegram yêu cầu xác minh tài khoản. Nạn nhân chụp màn hình mã OTP gửi cho chúng và bị chiếm quyền điều khiển.',
    signs: [
      'Yêu cầu chụp màn hình danh sách chat (trong đó lộ mã OTP).',
      'Giả danh tài khoản hỗ trợ kỹ thuật của Telegram.',
      'Thông báo tài khoản sắp bị khóa.'
    ],
    prevention: 'Kích hoạt xác thực 2 lớp. Không gửi mã OTP cho bất kỳ ai dưới bất kỳ hình thức nào.'
  },
  {
    id: 'scam_21',
    title: 'Lừa đảo tung tin giả về cuộc gọi mất tiền',
    category: 'Tin giả',
    description: 'Tung tin đồn chỉ cần nhận cuộc gọi (như FlashAI) là bị mất hết tiền trong tài khoản để câu like/view và gây hoang mang.',
    signs: [
      'Thông tin giật gân, thiếu căn cứ khoa học.',
      'Yêu cầu chia sẻ gấp cho bạn bè người thân.',
      'Không dẫn nguồn từ các cơ quan chức năng.'
    ],
    prevention: 'Theo dõi tin tức từ Cục An toàn thông tin. Không lan truyền tin đồn thất thiệt.'
  },
  {
    id: 'scam_22',
    title: 'Dịch vụ lấy lại Facebook bị hack',
    category: 'Mạng xã hội',
    description: 'Quảng cáo có khả năng khôi phục Facebook bị khóa/hack. Yêu cầu mật khẩu hoặc tiền cọc rồi chiếm luôn tài khoản hoặc tiền.',
    signs: [
      'Cam kết lấy lại được mọi loại tài khoản.',
      'Yêu cầu chuyển khoản đặt cọc trước.',
      'Yêu cầu cung cấp thông tin đăng nhập/OTP.'
    ],
    prevention: 'Chỉ sử dụng tính năng khôi phục chính thức của Facebook. Không giao tài khoản cho người lạ.'
  },
  {
    id: 'scam_23',
    title: 'Rải link phishing, seeding quảng cáo bẩn',
    category: 'Kỹ thuật',
    description: 'Rải link tin giật gân ("bạn bị bóc phốt", "video lộ clip"). Khi click vào sẽ dẫn tới trang đăng nhập giả mạo để chiếm đoạt tài khoản.',
    signs: [
      'Tiêu đề gây tò mò, giật gân.',
      'Dẫn tới trang yêu cầu đăng nhập Facebook/Google.',
      'Link có cấu trúc lạ, sai chính tả.'
    ],
    prevention: 'Cẩn trọng với mọi đường link lạ trên bảng tin hoặc tin nhắn.'
  },
  {
    id: 'scam_24',
    title: 'Lừa đảo cho số đánh lô đề',
    category: 'Tệ nạn',
    description: 'Cam kết cho số trúng 100%. Yêu cầu đóng phí "tiền lộc" trước. Nếu không trúng thì chặn, nếu trúng thì yêu cầu chia hoa hồng lớn.',
    signs: [
      'Cam kết trúng thưởng tuyệt đối.',
      'Yêu cầu đóng phí trước khi nhận số.',
      'Quảng cáo rầm rộ về "thánh tiên tri".'
    ],
    prevention: 'Lô đề là hành vi vi phạm pháp luật. Tuyệt đối không tin vào lời hứa cho số.'
  }
];

export const SCAM_VIDEOS: ScamVideo[] = [
  {
    id: 'v1',
    title: '"Bắc Bling" phiên bản phòng, chống tội phạm an ninh mạng',
    url: 'https://www.facebook.com/reel/1374106564069128',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D1374106564069128&show_text=false&width=560',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    source: 'Facebook',
    description: 'Video hài hước mô phỏng các tình huống lừa đảo thực tế để người dùng dễ dàng nhận diện và phòng'
  },
  {
    id: 'v2',
    title: 'Phóng sự: "Bắt cóc online" - Những con số cảnh báo',
    url: 'https://nhandan.vn/video-bat-coc-online-nhung-con-so-canh-bao-post916970.html',
    embedUrl: 'https://nhandan.vn/video-bat-coc-online-nhung-con-so-canh-bao-post916970.html',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    source: 'Báo Nhân Dân',
    description: 'Phân tích thủ đoạn tống tiền tinh vi bằng cách tạo hiện trường giả bắt cóc người thân qua không gian mạng.'
  },
  {
    id: 'v3',
    title: 'Thủ đoạn lừa đảo việc làm nhẹ lương cao',
    url: 'https://youtu.be/3bu_LYOIov8?si=dUcYynmqRXAndCVO',
    embedUrl: 'https://www.youtube.com/embed/3bu_LYOIov8',
    thumbnail: 'https://img.youtube.com/vi/3bu_LYOIov8/hqdefault.jpg',
    source: 'YouTube',
    description: 'Cảnh báo về các kịch bản tuyển dụng cộng tác viên online với hứa hẹn lợi nhuận cực cao nhưng thực chất là bẫy nạp tiền.'
  },
  {
    id: 'v4',
    title: 'Cảnh giác bẫy lừa đảo nạp thẻ game',
    url: 'https://youtu.be/sNIF-3kdZlU?si=rWH_br4W6jwq435h',
    embedUrl: 'https://www.youtube.com/embed/sNIF-3kdZlU',
    thumbnail: 'https://img.youtube.com/vi/sNIF-3kdZlU/hqdefault.jpg',
    source: 'YouTube',
    description: 'Hướng dẫn học sinh nhận biết các trang web và fanpage giả mạo khuyến mãi nạp thẻ game nhằm chiếm đoạt tài khoản.'
  },
  {
    id: 'v5',
    title: 'Nhận diện các hình thức lừa đảo qua mạng',
    url: 'https://youtu.be/lsKDl_d5Mn4?si=sJ717kd6gEpe3Aoc',
    embedUrl: 'https://www.youtube.com/embed/lsKDl_d5Mn4',
    thumbnail: 'https://img.youtube.com/vi/lsKDl_d5Mn4/hqdefault.jpg',
    source: 'YouTube',
    description: 'Tổng hợp 24 hình thức lừa đảo trực tuyến phổ biến nhất tại Việt Nam hiện nay được cơ quan chức năng cảnh báo.'
  }
];

export const PRACTICE_QUESTIONS: Question[] = [
  // CẤP ĐỘ 1: KHIÊN GIẤY
  { id: 1, level: 1, question: "Bạn nhận được tin nhắn trúng xe SH từ đầu số lạ, yêu cầu truy cập trungthuong-sh2024.tk để làm thủ tục.", options: ["Truy cập ngay vào trang web để kiểm tra xem mã dự thưởng có trùng khớp với mình không.", "Bỏ qua và chặn số, vì tên miền đuôi lạ .tk và tin nhắn không dấu là dấu hiệu lừa đảo.", "Nhắn tin lại cho người gửi để hỏi tên công ty và địa chỉ trụ sở đến nhận trực tiếp."], correct: 1, explanation: "Tên miền lạ (.tk, .xyz, .club) và tin nhắn từ SIM rác là dấu hiệu lừa đảo cơ bản." },
  { id: 2, level: 1, question: "Mật khẩu nào sau đây được coi là an toàn nhất cho tài khoản ngân hàng/Facebook?", options: ["NguyenVanHung1990 (Kết hợp họ tên và năm sinh để dễ nhớ, khó quên).", "Matkhau@123456 (Sử dụng chuỗi ký tự dài và có dãy số phổ biến).", "H#7pK$9Lm!2zQ (Chuỗi ngẫu nhiên gồm chữ hoa, thường, số, ký tự đặc biệt)."], correct: 2, explanation: "Mật khẩu mạnh phải là chuỗi ngẫu nhiên, không liên quan thông tin cá nhân." },
  { id: 3, level: 1, question: "Một người tự xưng là nhân viên ngân hàng gọi điện yêu cầu bạn đọc mã OTP để 'khắc phục lỗi bảo mật'.", options: ["Đọc mã OTP ngay để nhân viên kịp thời xử lý lỗi, tránh bị mất tiền trong tài khoản.", "Tuyệt đối không cung cấp. Ngân hàng không bao giờ yêu cầu OTP qua điện thoại dưới mọi hình thức.", "Yêu cầu nhân viên đọc đúng số CMND/CCCD của mình rồi mới cung cấp mã OTP."], correct: 1, explanation: "Mã OTP là chìa khóa tối mật, nhân viên thật không bao giờ được phép hỏi mã này." },
  { id: 4, level: 1, question: "Khi đăng nhập website ngân hàng, dấu hiệu nào trên thanh địa chỉ giúp nhận biết trang an toàn?", options: ["Giao diện trang web có màu sắc, logo và phông chữ giống hệt ứng dụng trên điện thoại.", "Địa chỉ bắt đầu bằng https://, đúng tên miền ngân hàng và có biểu tượng ổ khóa.", "Trang web tải rất nhanh, không bị lỗi phông chữ và có hiện thông báo khuyến mãi."], correct: 1, explanation: "https:// và ổ khóa xác nhận kết nối được mã hóa an toàn." },
  { id: 5, level: 1, question: "Bạn thấy tin tuyển dụng 'Việc nhẹ lương cao', chốt đơn ảo trên Shopee nhận hoa hồng 20% trong ngày.", options: ["Thử tham gia với số vốn nhỏ (vài trăm nghìn) để kiếm tiền cafe lúc rảnh rỗi.", "Cảnh giác, đây là chiêu trò lừa đảo 'nạp tiền làm nhiệm vụ', nạp vào sẽ không rút ra được.", "Rủ bạn bè cùng tham gia để tạo thành nhóm hỗ trợ nhau chốt đơn cho an toàn."], correct: 1, explanation: "Mô hình 'việc nhẹ lương cao' yêu cầu ứng vốn trước luôn là lừa đảo." },
  { id: 6, level: 1, question: "Bạn nhận được email từ hotro-facebook@gmail.com cảnh báo tài khoản bị khóa, kèm link kháng nghị.", options: ["Bấm vào link và đăng nhập ngay để xác minh danh tính, tránh bị khóa vễn viễn.", "Kiểm tra địa chỉ người gửi, email chính thức phải có đuôi @facebook.com hoặc @meta.com.", "Chuyển tiếp email này cho bạn bè để hỏi xem họ có nhận được thông báo tương tự không."], correct: 1, explanation: "Email từ các dịch vụ lớn không bao giờ dùng đuôi miễn phí như @gmail.com." },
  { id: 7, level: 1, question: "Khi sử dụng Wifi công cộng (quán cafe, sân bay), hành động nào sau đây là nguy hiểm nhất?", options: ["Xem video giải trí trên YouTube, TikTok hoặc đọc báo mạng.", "Đăng nhập ứng dụng ngân hàng và thực hiện giao dịch chuyển tiền.", "Tra cứu bản đồ Google Maps hoặc tìm kiếm thông tin du lịch."], correct: 1, explanation: "Hacker có thể nghe lén Wifi công cộng để đánh cắp thông tin tài chính." },
  { id: 8, level: 1, question: "Bạn nhận được thông báo trúng thưởng nhưng yêu cầu chuyển trước 500k tiền 'phí hồ sơ'.", options: ["Chuyển tiền ngay vì 500k là quá nhỏ so với giá trị giải thưởng lớn sắp nhận được.", "Không chuyển. Nguyên tắc là nhận thưởng không bao giờ phải nộp tiền phí trước.", "Thương lượng với họ để trừ phí hồ sơ vào giá trị giải thưởng rồi nhận phần còn lại."], correct: 1, explanation: "Yêu cầu nộp phí trước để nhận quà là dấu hiệu lừa đảo 100%." },
  { id: 9, level: 1, question: "Ứng dụng chỉnh sửa ảnh miễn phí yêu cầu quyền truy cập 'Danh bạ' và 'Tin nhắn'.", options: ["Đồng ý cấp quyền để ứng dụng hoạt động ổn định và đầy đủ tính năng nhất.", "Từ chối hoặc gỡ bỏ. App chỉnh ảnh không cần danh bạ, đây là dấu hiệu thu thập dữ liệu trái phép.", "Cấp quyền nhưng sau khi chỉnh ảnh xong thì vào cài đặt tắt quyền đi ngay."], correct: 1, explanation: "Cảnh giác với các app đòi quyền truy cập vô lý không liên quan đến chức năng chính." },
  { id: 10, level: 1, question: "Số CVV/CVC (3 số cuối mặt sau thẻ tín dụng) dùng để làm gì?", options: ["Để nhân viên ngân hàng kiểm tra thẻ khi bạn gặp sự cố tại cây ATM.", "Dùng để thanh toán online. Nếu lộ số này, kẻ gian có thể tiêu tiền của bạn mà không cần thẻ cứng.", "Chỉ là mã số lô sản xuất của thẻ để bảo hành, không quan trọng lắm."], correct: 1, explanation: "CVV là mã bảo mật thanh toán, cần xóa hoặc che đi và tuyệt đối giữ bí mật." },
  { id: 11, level: 1, question: "Bạn thấy đường link tiêu đề giật gân 'Lộ clip nóng của...' kèm hình ảnh làm mờ trên Facebook.", options: ["Click vào xem ngay vì tò mò, muốn biết nhân vật trong clip là ai.", "Không click. Đây thường là link chứa mã độc hoặc trang giả mạo đánh cắp mật khẩu Facebook.", "Chia sẻ về tường (chế độ Chỉ mình tôi) để lưu lại xem sau khi rảnh."], correct: 1, explanation: "Tin giật gân (Clickbait) là mồi nhử phổ biến để dẫn dụ người dùng vào web độc hại." },
  { id: 12, level: 1, question: "Khi muốn tải ứng dụng ngân hàng về điện thoại Android, bạn nên tải ở đâu?", options: ["Tìm kiếm file .apk trên Google để tải bản nhẹ nhất cho máy.", "Chỉ tải từ cửa hàng ứng dụng chính thức Google Play Store (CH Play).", "Nhờ nhân viên cửa hàng điện thoại cài hộ qua thẻ nhớ hoặc Bluetooth."], correct: 1, explanation: "Tải ứng dụng từ nguồn ngoài (file apk trôi nổi) có nguy cơ cao bị cài mã độc." },
  { id: 13, level: 1, question: "Đang lướt web, màn hình hiện thông báo 'Máy bạn đã nhiễm 13 virus! Bấm vào đây để diệt ngay'.", options: ["Bấm vào nút 'Diệt ngay' và làm theo hướng dẫn để bảo vệ dữ liệu trong máy.", "Tắt tab trình duyệt đó đi. Đây là quảng cáo lừa đảo hù dọa (Scareware) để dụ cài phần mềm độc hại.", "Gọi vào số hotline hiện trên màn hình cảnh báo để nhờ kỹ thuật viên hỗ trợ."], correct: 1, explanation: "Trình duyệt web không thể quét virus hệ thống, các thông báo này đều là giả." },
  { id: 14, level: 1, question: "Bạn nhận được cuộc gọi nháy máy (1 chuông rồi tắt) từ đầu số nước ngoài (+224, +231...).", options: ["Gọi lại ngay xem ai gọi, nhỡ là người thân ở nước ngoài có việc gấp.", "Không gọi lại. Đây là bẫy cước phí viễn thông cao (vài chục nghìn/phút).", "Nhắn tin hỏi 'Ai đấy, có việc gì không?' vào số đó."], correct: 1, explanation: "Gọi lại vào các đầu số vệ tinh lạ sẽ bị trừ cước phí rất nặng." },
  { id: 15, level: 1, question: "Tính năng xác thực 2 bước (2FA) có tác dụng gì quan trọng nhất?", options: ["Làm chậm quá trình đăng nhập, gây phiền phức cho người sử dụng.", "Tăng cường bảo mật. Kẻ gian dù biết mật khẩu cũng không vào được nếu không có mã OTP.", "Giúp bạn lấy lại mật khẩu nhanh hơn khi lỡ quên mật khẩu đăng nhập."], correct: 1, explanation: "2FA là lớp lá chắn quan trọng thứ hai bảo vệ tài khoản khi mật khẩu bị lộ." },
  { id: 16, level: 1, question: "Bạn bè gửi link nhờ 'Bình chọn thí sinh nhí' yêu cầu đăng nhập Facebook để vote.", options: ["Đăng nhập ngay để ủng hộ người quen, bình chọn xong thoát ra là được.", "Không đăng nhập. Đây là hình thức Phishing (giả mạo trang đăng nhập) để lấy cắp tài khoản.", "Nhập mật khẩu sai xem trang web có phát hiện ra không, nếu phát hiện thì là web thật."], correct: 1, explanation: "Tuyệt đối không nhập mật khẩu mạng xã hội vào bất kỳ trang web lạ nào." },
  { id: 17, level: 1, question: "Tại sao không nên dùng chung một mật khẩu cho Facebook, Email và Ngân hàng?", options: ["Vì sẽ khó nhớ nếu mật khẩu quá dài và phức tạp.", "Vì nếu một tài khoản bị lộ, hacker sẽ thử mật khẩu đó và chiếm đoạt tất cả các tài khoản còn lại.", "Vì các ứng dụng yêu cầu định dạng mật khẩu khác nhau (chữ hoa, số, ký tự đặc biệt)."], correct: 1, explanation: "Nguyên tắc 'không bỏ trứng cùng một giỏ' để hạn chế rủi ro domino." },
  { id: 18, level: 1, question: "Khi không dùng máy tính ở công ty hoặc nơi công cộng, bạn nên làm gì?", options: ["Chỉ cần tắt màn hình là đủ tiết kiệm điện và an toàn.", "Khóa màn hình (Lock screen - Windows + L) hoặc Đăng xuất để tránh người khác truy cập.", "Để nguyên màn hình sáng để lát nữa quay lại làm việc cho nhanh."], correct: 1, explanation: "Khóa màn hình là thói quen bảo mật cơ bản để bảo vệ dữ liệu cá nhân nơi công cộng." },
  { id: 19, level: 1, question: "Bạn nhận được tin nhắn vay tiền từ Facebook người thân với giọng điệu rất gấp gáp.", options: ["Chuyển tiền ngay vì sợ người thân lỡ việc quan trọng.", "Gọi điện thoại (tốt nhất là Video call) để xác nhận chính chủ trước khi chuyển.", "Hỏi số tài khoản, nếu trùng tên người thân thì chuyển luôn không cần gọi."], correct: 1, explanation: "Tài khoản người thân có thể bị hack. Luôn xác minh bằng kênh liên lạc khác." },
  { id: 20, level: 1, question: "Mã QR thanh toán tại cửa hàng có thể bị làm giả không?", options: ["Không, mã QR là duy nhất do ngân hàng cấp, không thể làm giả.", "Có. Kẻ gian có thể dán đè mã QR cá nhân của chúng lên mã QR của cửa hàng.", "Có, nhưng chỉ những hacker trình độ cao mới làm được việc này."], correct: 1, explanation: "Thủ đoạn dán đè QR code rất phổ biến. Cần kiểm tra tên chủ tài khoản sau khi quét." },

  // CẤP ĐỘ 2: KHIÊN BẠC
  { id: 21, level: 2, question: "Bạn nhận được SMS từ tên thương hiệu ngân hàng (Brandname) báo trừ tiền kèm link lạ.", options: ["Bấm link ngay. Tin nhắn nằm chung luồng với tin nhắn biến động số dư thật nên chắc chắn an toàn.", "Không bấm. Hacker dùng trạm phát sóng giả (Fake BTS) để chèn tin nhắn lừa đảo vào luồng tin thật.", "Soạn tin nhắn trả lời lại đầu số đó để hỏi nguyên nhân bị trừ tiền."], correct: 1, explanation: "Trạm BTS giả có thể mạo danh Brandname ngân hàng. Phải gọi hotline kiểm tra." },
  { id: 22, level: 2, question: "Video call từ người thân hỏi mượn tiền: Hình ảnh mờ, cuộc gọi rất ngắn (<10s), giọng hơi lạ.", options: ["Chuyển tiền ngay vì đã nhìn thấy mặt đúng là người thân, chắc do mạng yếu nên mờ.", "Tắt máy và gọi lại bằng cuộc gọi thoại thông thường (GSM - số điện thoại) để kiểm chứng.", "Chụp màn hình cuộc gọi và gửi cho người khác xem có phải Deepfake không."], correct: 1, explanation: "Đây là dấu hiệu Deepfake. Gọi lại bằng mạng viễn thông là cách xác minh tốt nhất." },
  { id: 23, level: 2, question: "Đối tác gửi email yêu cầu thay đổi số tài khoản nhận thanh toán vào phút chót.", options: ["Chuyển tiền vào số mới ngay để kịp tiến độ hợp đồng, giữ uy tín với đối tác.", "Gọi điện thoại trực tiếp cho đối tác (theo số cũ đã lưu) để xác nhận việc thay đổi này.", "Trả lời email (Reply) để hỏi lại lý do thay đổi và yêu cầu gửi văn bản đóng dấu."], correct: 1, explanation: "Email có thể bị hack hoặc giả mạo (Spoofing). Cần xác minh qua kênh thoại." },
  { id: 24, level: 2, question: "Cuộc gọi từ 'Cục Viễn thông' đe dọa khóa SIM sau 2 giờ nếu không cung cấp thông tin chuẩn hóa.", options: ["Đọc thông tin cá nhân (Số CMND) cho họ để họ hỗ trợ cập nhật trên hệ thống tránh bị khóa.", "Tự kiểm tra qua cú pháp tin nhắn của nhà mạng (VD: TTTB gửi 1414) hoặc ra điểm giao dịch.", "Tranh cãi với nhân viên đó và yêu cầu họ đọc số văn bản quy định khóa SIM."], correct: 1, explanation: "Nhà mạng không gọi điện đe dọa khóa SIM. Hãy chủ động kiểm tra qua kênh chính thức." },
  { id: 25, level: 2, question: "App vay tiền online quảng cáo 'không thế chấp' nhưng đòi quyền truy cập Danh bạ & Ảnh.", options: ["Đồng ý cấp quyền để hồ sơ được duyệt nhanh, nhận tiền giải ngân trong ngày.", "Không vay. Họ sẽ dùng danh bạ và ảnh nhạy cảm để khủng bố, bôi nhọ khi bạn chậm trả nợ.", "Cấp quyền nhưng sử dụng danh bạ giả để đánh lừa ứng dụng vay tiền."], correct: 1, explanation: "Tín dụng đen biến tướng dùng dữ liệu cá nhân làm công cụ uy hiếp con nợ." },
  { id: 26, level: 2, question: "Dịch vụ 'lấy lại tài khoản Facebook/tiền bị lừa' yêu cầu cọc trước 500k.", options: ["Chuyển khoản cọc ngay vì đang cần gấp, số tiền 500k cũng không quá lớn.", "Không chuyển. Đa số dịch vụ yêu cầu cọc trước là lừa đảo, nhận tiền xong sẽ chặn liên lạc.", "Yêu cầu họ cho xem thẻ căn cước công dân của họ rồi mới chuyển tiền cọc."], correct: 1, explanation: "'Dịch vụ lấy lại...' thường là hình thức lừa đảo chồng lừa đảo (Scam recovery scam)." },
  { id: 27, level: 2, question: "Bạn nhận được tiền chuyển nhầm, sau đó người lạ gọi xin lại và gửi kèm link 'hoàn tiền'.", options: ["Bấm link và làm theo hướng dẫn để trả lại tiền cho họ, tránh rắc rối pháp lý.", "Ra ngân hàng yêu cầu hỗ trợ chuyển trả (Revert) về đúng số tài khoản gốc đã gửi đến.", "Rút tiền mặt ra giữ để đảm bảo an toàn, chờ công an hoặc ngân hàng liên hệ."], correct: 1, explanation: "Link hoàn tiền là bẫy chiếm đoạt tài khoản. Hãy để ngân hàng xử lý quy trình hoàn tiền." },
  { id: 28, level: 2, question: "Kẻ lừa đảo lập Facebook giả mạo bạn (Clone) rồi nhắn tin lừa tiền bạn bè. Bạn làm gì đầu tiên?", options: ["Nhắn tin chửi bới kẻ lừa đảo và dọa báo công an nếu không xóa nick.", "Đăng bài đính chính công khai (Public) trên trang thật và Báo cáo (Report) tài khoản giả.", "Xóa tài khoản Facebook của mình tạm thời để chứng minh sự trong sạch."], correct: 1, explanation: "Cần cảnh báo cộng đồng và báo cáo vi phạm để Facebook xử lý tài khoản giả." },
  { id: 29, level: 2, question: "Tuyển dụng 'Xem video TikTok kiếm tiền'. Nhiệm vụ 1 trả tiền thật. Nhiệm vụ 2 bắt nạp tiền 'lên VIP'.", options: ["Nạp tiền lên VIP để hưởng hoa hồng cao hơn như lời cam kết của hệ thống.", "Dừng lại ngay. Đây là bẫy 'thả con tép bắt con tôm', nạp số lớn sẽ mất trắng.", "Nạp một số tiền nhỏ (thử nghiệm) xem có rút được vốn về không rồi tính tiếp."], correct: 1, explanation: "Lừa đảo thường trả thưởng nhỏ ban đầu để tạo lòng tin (mồi nhử)." },
  { id: 30, level: 2, question: "Người lạ gọi điện xin mã OTP của Ví điện tử (Momo/ZaloPay) để 'xác nhận tiền thưởng'.", options: ["Đọc mã OTP cho họ vì họ bảo đó là mã nhận tiền thưởng từ hệ thống.", "Tuyệt đối không đọc. Mã OTP dùng để chuyển tiền đi hoặc đăng nhập, không phải để nhận tiền.", "Đọc sai một vài số cuối của mã OTP để thử lòng xem họ có phát hiện ra không."], correct: 1, explanation: "OTP không bao giờ dùng để nhận tiền. Đó là chìa khóa mở két sắt của bạn." },
  { id: 31, level: 2, question: "Bạn nhận cuộc gọi báo 'Con đang cấp cứu, cần chuyển tiền phẫu thuật gấp'.", options: ["Chuyển tiền ngay lập tức vì cứu người là trên hết, chậm trễ sẽ nguy hiểm.", "Bình tĩnh gọi điện cho giáo viên chủ nhiệm hoặc hotline bệnh viện để xác minh thông tin.", "Khóc lóc và xin số tài khoản cá nhân của bác sĩ để chuyển cho nhanh."], correct: 1, explanation: "Kẻ lừa đảo đánh vào tâm lý hoảng loạn. Cần xác minh thông tin từ nguồn chính thống." },
  { id: 32, level: 2, question: "Tham gia nhóm đầu tư Zalo có 'Thầy đọc lệnh' cam kết bao lời 100%, bảo hiểm vốn.", options: ["Đầu tư theo thầy vì thấy nhiều người trong nhóm khoe lãi và cảm ơn thầy rối rít.", "Rời nhóm ngay. Đây là chiêu trò lùa gà, các thành viên khoe lãi là 'chim mồi' (nick ảo).", "Đầu tư thử số vốn nhỏ để kiểm chứng lời hứa của thầy."], correct: 1, explanation: "Không kênh đầu tư tài chính nào cam kết lãi 100%. 'Bao lỗ' là dấu hiệu lừa đảo." },
  { id: 33, level: 2, question: "Bạn quen bạn trai ngoại quốc qua mạng, họ gửi quà giá trị lớn về nhưng bị kẹt hải quan, cần đóng phí.", options: ["Chuyển tiền đóng phí vào tài khoản cá nhân họ cung cấp để nhận quà giá trị.", "Cảnh giác 'Love Scam'. Không chuyển tiền vào tài khoản cá nhân lạ với lý do đóng thuế/phí.", "Hỏi họ xem trong kiện hàng có tiền mặt không để xin hải quan trừ phí vào đó."], correct: 1, explanation: "Thủ đoạn lừa đảo tình cảm thường dùng kịch bản 'quà tặng bị kẹt' để moi tiền." },
  { id: 34, level: 2, question: "Nhận được cuộc gọi báo 'Phạt nguội giao thông', yêu cầu kê khai tài sản để chứng minh trong sạch.", options: ["Làm theo hướng dẫn kê khai vì sợ bị bắt giam hoặc phong tỏa tài khoản.", "Cảnh giác. Cảnh sát giao thông không yêu cầu kê khai tài sản hay chuyển tiền qua điện thoại.", "Xin số tài khoản để nộp phạt luôn cho xong chuyện."], correct: 1, explanation: "Cơ quan công an làm việc trực tiếp hoặc gửi giấy mời, không làm việc qua điện thoại." },
  { id: 35, level: 2, question: "Có người hỏi thuê/mua lại tài khoản ngân hàng của bạn với giá cao (2-3 triệu đồng).", options: ["Bán ngay, đằng nào mình cũng không dùng tài khoản đó, kiếm thêm thu nhập.", "Không bán. Tài khoản đó sẽ bị dùng để nhận tiền lừa đảo, bạn sẽ trở thành đồng phạm.", "Cho thuê nhưng giữ lại quyền kiểm soát mật khẩu và OTP."], correct: 1, explanation: "Người đứng tên tài khoản phải chịu trách nhiệm pháp lý nếu tài khoản dùng vào việc phi pháp." },
  { id: 36, level: 2, question: "Thấy quảng cáo 'Combo du lịch giá rẻ 5 sao' giảm 70% trên Facebook.", options: ["Chuyển cọc ngay kẻo hết vé, cơ hội hiếm có để đi du lịch giá rẻ.", "Kiểm tra kỹ thông tin công ty, mã số thuế, nên yêu cầu giao dịch trực tiếp hoặc qua sàn uy tín.", "Rủ cả gia đình cùng đặt vé số lượng lớn để được giảm giá thêm."], correct: 1, explanation: "Combo du lịch giá rẻ bất thường thường là lừa đảo chiếm đoạt tiền cọc." },
  { id: 37, level: 2, question: "Nhận được tin nhắn 'Tra cứu tiền điện' từ số lạ, kèm link nhập mật khẩu ngân hàng để thanh toán.", options: ["Nhập thông tin để thanh toán cho tiện, đỡ bị cắt điện.", "Không nhập. Chỉ thanh toán qua App điện lực chính thức (EVN) hoặc App ngân hàng.", "Kiểm tra xem số tiền điện trong tin nhắn có khớp với hóa đơn giấy không."], correct: 1, explanation: "Giả mạo tin nhắn điện lực là hình thức Phishing phổ biến để lấy cắp tài khoản ngân hàng." },
  { id: 38, level: 2, question: "Công ty lớn tuyển dụng nhưng yêu cầu phỏng vấn và nộp hồ sơ (CCCD, ảnh) qua Telegram.", options: ["Gửi hồ sơ ngay để được sắp xếp lịch phỏng vấn sớm.", "Cảnh giác. Công ty lớn dùng email doanh nghiệp, không thu thập dữ liệu nhạy cảm qua Telegram.", "Xin họ phỏng vấn qua Zalo cho thuận tiện hơn Telegram."], correct: 1, explanation: "Lừa đảo tuyển dụng nhằm thu thập dữ liệu danh tính (KYC) để vay tiền hoặc tạo nick ảo." },
  { id: 39, level: 2, question: "Người lạ gọi điện bảo máy tính bạn bị lỗi, yêu cầu cài UltraViewer/TeamViewer để sửa từ xa.", options: ["Cài và đọc ID/Pass cho họ để được sửa máy miễn phí.", "Không cài. Họ sẽ chiếm quyền điều khiển máy tính để đánh cắp dữ liệu hoặc chuyển tiền.", "Cài nhưng ngồi canh màn hình, thấy họ làm gì lạ thì tắt máy."], correct: 1, explanation: "Chiếm quyền điều khiển từ xa (Remote Access) là cách nhanh nhất để hacker thâm nhập máy tính." },
  { id: 40, level: 2, question: "Nhận được tin nhắn từ người thân qua Zalo/Facebook nhờ nạp thẻ điện thoại gấp.", options: ["Mua thẻ nạp ngay và gửi mã số thẻ qua tin nhắn.", "Gọi điện xác nhận giọng nói. Tài khoản mạng xã hội của họ có thể đã bị hack.", "Nhắn tin hỏi xem họ dùng nhà mạng nào để mua cho đúng."], correct: 1, explanation: "Thủ đoạn hack nick nhờ nạp thẻ rất phổ biến. Luôn xác minh bằng giọng nói." },

  // CẤP ĐỘ 3: KHIÊN VÀNG
  { id: 41, level: 3, question: "Video call Deepfake (giả mạo khuôn mặt) hiện nay thường có nhược điểm kỹ thuật gì dễ nhận biết?", options: ["Hình ảnh cực kỳ sắc nét, giọng nói tự nhiên và có cảm xúc phức tạp.", "Cử động môi không khớp tiếng, khuôn mặt bị lỗi (glitch) khi có vật che khuất hoặc quay nghiêng.", "Người gọi luôn đeo khẩu trang kín mít hoặc đeo kính đen che mắt."], correct: 1, explanation: "AI vẫn gặp khó khăn khi xử lý vật thể che khuất hoặc góc nghiêng, tạo ra các lỗi hình ảnh." },
  { id: 42, level: 3, question: "App giả mạo 'Dịch vụ công' yêu cầu quyền 'Trợ năng' (Accessibility) nhằm mục đích gì nguy hiểm nhất?", options: ["Để hỗ trợ người khiếm thị sử dụng điện thoại dễ dàng hơn.", "Để chiếm quyền điều khiển: tự động thao tác trên màn hình, đọc trộm OTP và tự chuyển tiền đi.", "Để quét khuôn mặt và vân tay của người dùng nhanh hơn."], correct: 1, explanation: "Quyền 'Trợ năng' cho phép malware thao tác trên màn hình thay cho con người, cực kỳ nguy hiểm." },
  { id: 43, level: 3, question: "Kẻ gian dụ bạn bật 'Chia sẻ màn hình' (Screen Sharing) qua Zalo để hướng dẫn nhận tiền.", options: ["Bật chia sẻ để họ nhìn thấy màn hình và chỉ dẫn thao tác cho chính xác.", "Tuyệt đối không bật. Họ sẽ nhìn thấy mật khẩu và mã OTP khi bạn nhập trên máy của mình.", "Bật chia sẻ nhưng lấy tay che camera trước lại để họ không nhìn thấy mặt mình."], correct: 1, explanation: "Chia sẻ màn hình đồng nghĩa với việc lộ toàn bộ dữ liệu hiển thị (bàn phím, OTP, số dư)." },
  { id: 44, level: 3, question: "Kỹ thuật Email Spoofing là gì?", options: ["Kẻ gian hack vào hộp thư email của bạn và đổi mật khẩu.", "Kẻ gian giả mạo địa chỉ người gửi (VD: hiển thị là security@google.com) để lừa nạn nhân tin tưởng.", "Kẻ gian gửi hàng loạt email rác (Spam) quảng cáo sản phẩm."], correct: 1, explanation: "Spoofing làm giả phần Header khiến email trông như đến từ nguồn chính thống uy tín." },
  { id: 45, level: 3, question: "Thủ đoạn 'Pig Butchering' (Mổ lợn) trong lừa đảo đầu tư vận hành theo quy trình nào?", options: ["Lừa lấy tiền của nạn nhân ngay từ lần giao dịch đầu tiên.", " 'Nuôi' nạn nhân bằng tình cảm, cho rút lãi thật ban đầu, dụ nạp số tiền lớn rồi mới chiếm đoạt.", "Dụ nạn nhân mua các sản phẩm nông nghiệp giá rẻ trên mạng."], correct: 1, explanation: "Kẻ lừa đảo kiên nhẫn xây dựng lòng tin (vỗ béo) trước khi thực hiện cú lừa quyết định (mổ)." },
  { id: 46, level: 3, question: "Điện thoại mất sóng (báo SOS/No Service) bất thường dù đang ở vùng phủ sóng tốt. Nguy cơ là gì?", options: ["Điện thoại bị hỏng phần cứng hoặc lỗi khe cắm SIM.", "Tấn công SIM Swap (Chiếm đoạt SIM). Hacker đã chuyển số của bạn sang SIM chúng để nhận OTP.", "Nhà mạng đang bảo trì trạm phát sóng trong khu vực."], correct: 1, explanation: "Mất sóng bất thường là dấu hiệu điển hình của tấn công SIM Swap. Cần liên hệ nhà mạng ngay." },
  { id: 47, level: 3, question: "Tấn công 'Juice Jacking' xảy ra trong tình huống nào?", options: ["Khi bạn sử dụng Wifi công cộng không có mật khẩu.", "Khi cắm sạc điện thoại vào cổng USB công cộng (sân bay, cafe) đã bị cài chip đánh cắp dữ liệu.", "Khi bạn uống nước ép trái cây tại cửa hàng lạ."], correct: 1, explanation: "Cổng USB có thể truyền cả điện và dữ liệu. Hacker lợi dụng để cài mã độc qua cáp sạc." },
  { id: 48, level: 3, question: "Máy tính bị nhiễm Ransomware (Mã độc tống tiền), dữ liệu bị mã hóa. Hành động đúng đắn nhất là gì?", options: ["Trả tiền chuộc bằng tiền ảo (Bitcoin) ngay để lấy lại dữ liệu quan trọng.", "Ngắt kết nối mạng, không trả tiền, tìm công cụ giải mã hoặc khôi phục từ bản sao lưu (Backup).", "Cài lại hệ điều hành Windows là sẽ lấy lại được dữ liệu đã mất."], correct: 1, explanation: "Trả tiền không đảm bảo lấy lại được dữ liệu. Backup định kỳ là biện pháp phòng vệ duy nhất." },
  { id: 49, level: 3, question: "Mã độc nhúng trong file văn bản (Word/Excel) thường lợi dụng tính năng nào để kích hoạt?", options: ["Tính năng kiểm tra chính tả tự động (Spell check).", "Tính năng Macro (Enable Content/Enable Macro).", "Tính năng xem trước văn bản (Print Preview)."], correct: 1, explanation: "Hacker viết mã độc dưới dạng Macro script. Khi bấm 'Enable Macro', mã độc sẽ chạy và xâm nhập máy." },
  { id: 50, level: 3, question: "Mã độc 'Clipboard Hijacking' nguy hiểm như thế nào khi giao dịch tiền ảo (Crypto)?", options: ["It tự động bán hết các đồng coin trong ví của bạn.", "Nó thay thế địa chỉ ví người nhận trong bộ nhớ tạm (Clipboard) thành ví của hacker khi bạn Copy-Paste.", "Nó làm máy tính bị treo và nóng lên bất thường."], correct: 1, explanation: "Luôn kiểm tra kỹ địa chỉ ví trước khi gửi vì lệnh Paste có thể đã bị can thiệp." },
  { id: 51, level: 3, question: "'Quishing' là thuật ngữ chỉ hình thức lừa đảo nào?", options: ["Lừa đảo qua tin nhắn văn bản (SMS Phishing).", "Lừa đảo bằng mã QR (QR Phishing), dẫn dụ người dùng quét mã chứa link độc hại.", "Lừa đảo qua cuộc gọi thoại (Voice Phishing)."], correct: 1, explanation: "Mã QR có thể chứa đường link độc hại hoặc lệnh chuyển tiền ẩn danh, mắt thường không đọc được." },
  { id: 52, level: 3, question: "Tấn công Man-in-the-Middle (MitM) thường xảy ra ở môi trường mạng nào?", options: ["Khi sử dụng mạng dây nội bộ tại nhà riêng.", "Khi sử dụng Wifi công cộng không bảo mật hoặc truy cập website không có HTTPS.", "Khi sử dụng mạng 4G/5G của nhà mạng viễn thông."], correct: 1, explanation: "Hacker 'đứng giữa' chặn bắt và đọc trộm dữ liệu truyền đi giữa thiết bị và router Wifi công cộng." },
  { id: 53, level: 3, question: "CEO Fraud (Lừa đảo giả danh sếp/BEC) thường nhắm vào đối tượng nhân viên nào?", options: ["Nhân viên bảo vệ hoặc lễ tân của công ty.", "Kế toán hoặc nhân viên tài chính, những người có quyền thực hiện lệnh chuyển tiền.", "Sinh viên thực tập mới vào công ty."], correct: 1, explanation: "Kẻ gian nghiên cứu kỹ cấu trúc công ty để giả mạo email sếp chỉ đạo chuyển tiền khẩn cấp." },
  { id: 54, level: 3, question: "Keylogger là loại phần mềm gián điệp có chức năng nguy hiểm gì?", options: ["Quay phim màn hình làm việc của người dùng.", "Ghi lại mọi phím bấm trên bàn phím (bao gồm mật khẩu, nội dung chat) và gửi cho hacker.", "Làm máy tính chạy chậm và hiện nhiều quảng cáo."], correct: 1, explanation: "Keylogger âm thầm ghi lại thông tin đầu vào, cực kỳ nguy hiểm với tài khoản ngân hàng." },
  { id: 55, level: 3, question: "Tại sao Ví lạnh (Cold Wallet) an toàn hơn Ví nóng (Hot Wallet) trong lưu trữ tiền số?", options: ["Vì ví lạnh có thiết kế đẹp và đắt tiền hơn.", "Vì ví lạnh không kết nối Internet (Offline), tránh được sự tấn công của mã độc từ xa.", "Vì ví lạnh giúp giao dịch mua bán coin nhanh hơn."], correct: 1, explanation: "Cách ly khỏi Internet (Air-gapped) giúp ví lạnh miễn nhiễm với các cuộc tấn công mạng." },
  { id: 56, level: 3, question: "Kẻ gian lợi dụng tính năng 'Quên mật khẩu' của Telegram để chiếm đoạt tài khoản như thế nào?", options: ["Chúng dùng phần mềm để đoán mò mật khẩu của bạn.", "Yêu cầu gửi OTP về máy nạn nhân, sau đó lừa nạn nhân chụp ảnh màn hình đoạn chat (chứa OTP) gửi cho chúng.", "Chúng tấn công trực tiếp vào máy chủ của Telegram."], correct: 1, explanation: "Thủ đoạn 'Chụp màn hình báo lỗi' thực chất là để nhìn trộm mã OTP vừa gửi về máy nạn nhân." },
  { id: 57, level: 3, question: "'Browser-in-the-Browser' là kỹ thuật tấn công tinh vi nào?", options: ["Tạo ra cửa sổ đăng nhập giả mạo (Fake popup) nhìn y hệt cửa sổ thật của Google/Facebook để lừa lấy mật khẩu.", "Làm trình duyệt web bị treo và không thể tắt được.", "Tự động cài đặt các tiện ích mở rộng (Extension) độc hại vào trình duyệt."], correct: 0, explanation: "Cửa sổ giả mạo này thực chất là một hình ảnh HTML vẽ đè lên trang web độc hại, rất khó phân biệt." },
  { id: 58, level: 3, question: "Cookie Stealing (Đánh cắp Cookie) cho phép hacker làm gì?", options: ["Xem được lịch sử duyệt web của bạn.", "Chiếm phiên đăng nhập (Session) và vào tài khoản của bạn mà không cần biết mật khẩu hay có OTP.", "Làm máy tính của bạn bị nhiễm virus xóa dữ liệu."], correct: 1, explanation: "Mất Cookie phiên (Session Cookie) đồng nghĩa với việc hacker 'trở thành' bạn trên trình duyệt của hắn." },
  { id: 59, level: 3, question: "Thiết bị Stingray (Trạm thu phát sóng giả) thường được tội phạm dùng để làm gì?", options: ["Tăng cường sóng điện thoại cho khu dân cư đông đúc.", "Chặn bắt tin nhắn, cuộc gọi và phát tán tin nhắn Brandname lừa đảo hàng loạt trong khu vực.", "Nghe lén các cuộc nói chuyện trong nhà qua sóng Wifi."], correct: 1, explanation: "Các tin nhắn giả mạo ngân hàng (nằm chung luồng tin thật) xuất phát từ các trạm phát sóng giả này." },
  { id: 60, level: 3, question: "Quyền 'Set Approval for All' (Cấp quyền chi tiêu tất cả) trong giao dịch NFT/Crypto nguy hiểm ra sao?", options: ["Giúp thực hiện giao dịch mua bán nhanh chóng hơn.", "Cho phép trang web/hacker toàn quyền rút sạch mọi tài sản trong ví của bạn bất cứ lúc nào mà không cần hỏi lại.", "Giúp tiết kiệm phí giao dịch (Gas fee) mạng lưới."], correct: 1, explanation: "Đây là 'hợp đồng bán thân' trong thế giới Web3. Kẻ gian thường dụ người dùng ký quyền này để vét sạch ví." }
];
