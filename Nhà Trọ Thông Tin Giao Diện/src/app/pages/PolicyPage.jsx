import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Card } from "@/app/components/ui/card";
import { CheckCircle2, AlertCircle, Home, MessageCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const faqs = [
  {
    category: "Tìm trọ",
    questions: [
      {
        q: "Làm sao để tìm trọ gần nơi làm việc/trường học?",
        a: 'Bạn sử dụng tính năng "Tìm gần chỗ làm/trường" trên trang bản đồ, chọn địa điểm quan trọng (ví dụ), hệ thống sẽ hiển thị các phòng trọ xung quanh và tính khoảng cách chính xác.',
      },
      {
        q: "Ý nghĩa của bán kính tìm kiếm là gì?",
        a: "Bán kính tìm kiếm giúp bạn lọc các phòng trọ trong khoảng cách mong muốn từ vị trí của bạn hoặc địa điểm đã chọn. Bạn có thể điều chỉnh từ 1km đến 20km.",
      },
      {
        q: "Tôi có thể lưu các phòng trọ yêu thích không?",
        a: 'Có! Nhấn vào icon trái tim trên mỗi phòng trọ để lưu vào danh sách yêu thích. Bạn có thể xem lại bất cứ lúc nào bằng cách nhấn nút "Yêu thích" trên trang bản đồ.',
      },
      {
        q: "Làm sao để tìm trọ phù hợp với nhiều địa điểm cùng lúc?",
        a: "Sử dụng tính năng tìm kiếm đa điểm! Thêm nhiều địa điểm (ví dụ), hệ thống sẽ tính điểm trung tâm tối ưu và hiển thị các phòng trọ gần nhất với tất cả địa điểm.",
      },
    ],
  },
  {
    category: "Xác thực & An toàn",
    questions: [
      {
        q: 'Hệ thống xác thực "Trust is King" là gì?',
        a: "Đây là hệ thống 3 cấp độ xác thực:\n• Cấp 1: Chưa xác thực (⚠️)\n• Cấp 2: Xác thực SĐT qua OTP (🔹)\n• Cấp 3: Xác thực GPS - chủ nhà phải đứng tại địa điểm đăng trọ (✅)\nChúng tôi khuyến khích chọn phòng trọ Cấp 2 và 3 để đảm bảo an toàn.",
      },
      {
        q: "Tại sao có phòng trọ chưa xác thực?",
        a: "Chủ nhà mới đăng ký có thể chưa hoàn tất quy trình xác thực. Bạn nên liên hệ cẩn thận, yêu cầu xem phòng trực tiếp và kiểm tra giấy tờ nhà trước khi đặt cọc.",
      },
      {
        q: "Làm sao biết tin đăng là thật?",
        a: 'Ưu tiên các tin có badge ✅ "Xác thực GPS" vì chủ nhà đã xác nhận đứng tại địa điểm. Kiểm tra thông tin chi tiết, ảnh thực tế, và luôn đặt lịch xem phòng trực tiếp trước khi quyết định.',
      },
      {
        q: "Tôi phát hiện tin giả, phải làm sao?",
        a: 'Nhấn nút "Báo cáo tin giả" trên trang chi tiết phòng trọ. Chúng tôi sẽ xem xét và xử lý trong vòng 24h. Cảm ơn bạn đã giúp cộng đồng an toàn hơn!',
      },
    ],
  },
  {
    category: "Đặt lịch & Liên hệ",
    questions: [
      {
        q: "Làm sao để đặt lịch xem phòng?",
        a: 'Nhấn nút "Đặt lịch" trên thẻ phòng trọ, chọn ngày giờ phù hợp, điền thông tin của bạn. Chủ nhà sẽ nhận thông báo và xác nhận với bạn qua điện thoại.',
      },
      {
        q: "Tôi có thể chat trực tiếp với chủ trọ không?",
        a: 'Hiện tại bạn có thể gọi điện trực tiếp qua nút "Gọi" hoặc đặt lịch xem phòng. Tính năng chat đang được phát triển và sẽ ra mắt sớm!',
      },
      {
        q: "Chủ nhà không trả lời tin nhắn/cuộc gọi?",
        a: "Hãy thử liên hệ vào khung giờ 8h-20h. Nếu chủ nhà không phản hồi sau 24h, bạn có thể báo cáo để chúng tôi kiểm tra tình trạng tin đăng.",
      },
    ],
  },
  {
    category: "Cho chủ trọ",
    questions: [
      {
        q: "Làm sao để đăng tin cho thuê phòng trọ?",
        a: 'Nhấn "Đăng trọ" trên trang chủ, điền thông tin phòng trọ, upload ảnh, chọn vị trí trên bản đồ. Để tăng độ tin cậy, hãy xác thực GPS bằng cách đến địa điểm phòng trọ.',
      },
      {
        q: "Xác thực GPS có bắt buộc không?",
        a: "Không bắt buộc nhưng KHUYẾN KHÍCH CAO! Tin đăng có xác thực GPS được ưu tiên hiển thị và thu hút nhiều người thuê hơn 5 lần.",
      },
      {
        q: "Tôi có thể chỉnh sửa/xóa tin đăng không?",
        a: "Có! Vào trang quản lý tin đăng, bạn có thể cập nhật giá, ảnh, trạng thái phòng hoặc xóa tin khi đã cho thuê.",
      },
      {
        q: "Làm sao quản lý lịch hẹn xem phòng?",
        a: "Bạn sẽ nhận thông báo Zalo khi có người đặt lịch. Vào Dashboard để xem danh sách, xác nhận hoặc từ chối lịch hẹn.",
      },
    ],
  },
  {
    category: "Thanh toán & Chính sách",
    questions: [
      {
        q: "MapHome có thu phí không?",
        a: "Hoàn toàn MIỄN PHÍ cho cả người tìm trọ và chủ nhà! Chúng tôi không thu bất kỳ khoản phí nào.",
      },
      {
        q: "Chính sách bảo mật dữ liệu?",
        a: "Chúng tôi không thu thập PII (thông tin cá nhân nhạy cảm). Dữ liệu của bạn được mã hóa và chỉ dùng để cải thiện trải nghiệm sử dụng.",
      },
      {
        q: "MapHome có hỗ trợ ký hợp đồng không?",
        a: "Hiện tại chúng tôi chỉ hỗ trợ kết nối người thuê - chủ nhà. Việc ký hợp đồng và thanh toán tiền trọ do hai bên tự thỏa thuận.",
      },
    ],
  },
];

const checklist = [
  {
    title: "🏠 Kiểm tra phòng trọ",
    items: [
      "Diện tích thực tế có đúng như tin đăng?",
      "Có cửa sổ, ánh sáng tự nhiên?",
      "Phòng có mùi ẩm mốc, nấm mọc tường?",
      "Kiểm tra điện nước hoạt động bình thường",
      "Thử khóa cửa, cửa sổ xem chắc chắn không",
      "Kiểm tra tường, trần có vết nứt/thấm nước?",
    ],
  },
  {
    title: "🔌 Tiện ích & Cơ sở vật chất",
    items: [
      "WiFi tốc độ bao nhiêu? Thử kết nối ngay",
      "Máy lạnh/quạt hoạt động tốt không?",
      "Nóng lạnh, bình nước nóng có dùng được?",
      "Tủ lạnh, tủ quần áo đủ không gian?",
      "Toilet sạch sẽ, nước xả mạnh không?",
      "Bếp có bếp ga/điện? Được nấu ăn không?",
    ],
  },
  {
    title: "💰 Chi phí & Hợp đồng",
    items: [
      "Giá thuê bao gồm những gì? (điện, nước, wifi, rác)",
      "Giá điện/nước bao nhiêu tiền/kwh, m³?",
      "Đặt cọc bao nhiêu tháng? Hoàn lại khi nào?",
      "Thời hạn hợp đồng tối thiểu?",
      "Quy định về khách, giờ giấc?",
      "Được nuôi thú cưng không?",
    ],
  },
  {
    title: "🔐 An ninh & Chủ nhà",
    items: [
      "Có camera an ninh? Bảo vệ?",
      "Khu vực có đèn đường, an toàn về đêm?",
      "Chủ nhà có giấy tờ nhà đất hợp lệ?",
      "Kiểm tra CMND/CCCD chủ nhà",
      "Có hợp đồng thuê chính thức không?",
      "Hỏi người thuê cũ về chủ nhà (nếu có)",
    ],
  },
  {
    title: "📍 Vị trí & Xung quanh",
    items: [
      "Khoảng cách đến trường/công ty?",
      "Có xe bus/grab gần không?",
      "Gần chợ, siêu thị, quán ăn?",
      "Môi trường xung quanh có ồn ào?",
      "Có chỗ để xe an toàn?",
      "Khu vực có nhiều dịch vụ tiện ích?",
    ],
  },
];

export function PolicyPage() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Trợ Giúp & Hướng Dẫn
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mọi thông tin bạn cần để tìm được phòng trọ ưng ý và an toàn
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <MessageCircle className="size-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Câu hỏi thường gặp</h3>
                <p className="text-sm text-gray-600">Giải đáp mọi thắc mắc</p>
              </div>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <CheckCircle2 className="size-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Checklist xem nhà</h3>
                <p className="text-sm text-gray-600">
                  Danh sách kiểm tra quan trọng
                </p>
              </div>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                  <Home className="size-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Hướng dẫn đăng trọ</h3>
                <p className="text-sm text-gray-600">Cho chủ nhà trọ</p>
              </div>
            </Card>
          </div>

          {/* FAQ Section */}
          <section className="mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <MessageCircle className="size-8 text-blue-600" />
                Câu hỏi thường gặp (FAQ)
              </h2>

              {faqs.map((category, idx) => (
                <div key={idx} className="mb-8 last:mb-0">
                  <h3 className="text-xl font-bold mb-4 text-green-600">
                    {category.category}
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, qIdx) => (
                      <AccordionItem key={qIdx} value={`${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 whitespace-pre-line">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </section>

          {/* Checklist Section */}
          <section className="mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle2 className="size-8 text-green-600" />
                Checklist Xem Nhà Trọ
              </h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="text-sm">
                  <strong>💡 Mẹo:</strong> In checklist này ra giấy và mang theo
                  khi đi xem phòng. Đánh dấu từng mục để không bỏ sót điều quan
                  trọng!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {checklist.map((section, idx) => (
                  <Card key={idx} className="p-6">
                    <h3 className="text-lg font-bold mb-4">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            <div className="size-4 border-2 border-gray-300 rounded"></div>
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-red-800 flex items-center gap-2">
                  <AlertCircle className="size-5" />
                  Cảnh báo: Dấu hiệu cần tránh
                </h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>❌ Chủ nhà yêu cầu đặt cọc trước khi xem phòng</li>
                  <li>❌ Không cho xem giấy tờ nhà đất</li>
                  <li>❌ Giá quá rẻ so với khu vực (có thể là lừa đảo)</li>
                  <li>❌ Phòng có mùi ẩm mốc nặng, nấm đen</li>
                  <li>❌ Khu vực không có người qua lại, vắng vẻ về đêm</li>
                  <li>❌ Chủ nhà không cung cấp hợp đồng chính thức</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <Card className="p-8 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <h2 className="text-2xl font-bold mb-4">Vẫn còn thắc mắc?</h2>
              <p className="mb-6">
                Đội ngũ hỗ trợ MapHome luôn sẵn sàng giúp bạn!
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="secondary" size="lg">
                  📧 Email: support@maphome.vn
                </Button>
                <Button variant="secondary" size="lg">
                  📱 Hotline: 1900 xxxx
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
