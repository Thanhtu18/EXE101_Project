import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Calendar,
  User,
  Clock,
  Eye,
  Search,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  TrendingUp,
  Tag,
  ChevronLeft,
  ChevronRight,
  Mail,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

// ─── Blog Data ────────────────────────────────────────────────
const blogPosts = [
  {
    id: 1,
    title: "10 Mẹo Tìm Phòng Trọ Ưng Ý Tại Hà Nội Cho Sinh Viên",
    excerpt:
      "Hướng dẫn chi tiết để bạn có thể tìm được phòng trọ phù hợp với nhu cầu và ngân sách của mình. Từ việc chọn khu vực, thương lượng giá đến các lưu ý khi ký hợp đồng thuê nhà.",
    author: "Nguyễn Thị Lan",
    authorAvatar: "TL",
    date: "15/02/2026",
    image:
      "https://images.unsplash.com/photo-1547024842-a0e3d2127406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBhcGFydG1lbnQlMjBIYW5vaXxlbnwxfHx8fDE3NzE5MTU5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Kinh nghiệm",
    readTime: "8 phút",
    views: 5420,
    likes: 234,
    comments: 45,
    tags: ["tìm trọ", "sinh viên", "Hà Nội", "mẹo hay"],
    featured: true,
  },
  {
    id: 2,
    title: 'Hệ Thống Xác Thực "Trust is King" — Chống Tin Ảo Hiệu Quả',
    excerpt:
      "Tìm hiểu về cơ chế xác thực 3 cấp độ giúp bạn tránh xa các tin đăng lừa đảo và thông tin không chính xác trên MapHome.",
    author: "Trần Minh Đức",
    authorAvatar: "MĐ",
    date: "12/02/2026",
    image:
      "https://images.unsplash.com/photo-1657040899628-f4a028c62fbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBzYWZldHklMjBzZWN1cml0eSUyMGxvY2t8ZW58MXx8fHwxNzcxOTE1OTczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Tính năng",
    readTime: "6 phút",
    views: 3810,
    likes: 189,
    comments: 32,
    tags: ["xác thực", "Trust is King", "chống lừa đảo"],
  },
  {
    id: 3,
    title: "Top 5 Khu Vực Có Giá Phòng Trọ Hợp Lý Nhất Hà Nội 2026",
    excerpt:
      "Khảo sát thị trường phòng trọ tại 5 khu vực có mức giá phải chăng, thuận tiện cho sinh viên và người đi làm tại Hà Nội.",
    author: "Lê Hoàng Nam",
    authorAvatar: "HN",
    date: "08/02/2026",
    image:
      "https://images.unsplash.com/photo-1536785438246-08198ab7dd6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWlnaGJvcmhvb2QlMjBjb21tdW5pdHklMjBwZW9wbGV8ZW58MXx8fHwxNzcxOTE1OTc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Thị trường",
    readTime: "7 phút",
    views: 7230,
    likes: 312,
    comments: 67,
    tags: ["giá rẻ", "khu vực", "thị trường", "Hà Nội"],
  },
  {
    id: 4,
    title: "Quyền Lợi Và Trách Nhiệm Của Người Thuê Trọ Theo Pháp Luật",
    excerpt:
      "Hiểu rõ quyền lợi và nghĩa vụ khi thuê phòng trọ để tránh những rắc rối không đáng có. Hợp đồng, đặt cọc, và xử lý tranh chấp.",
    author: "Phạm Thu Hà",
    authorAvatar: "TH",
    date: "05/02/2026",
    image:
      "https://images.unsplash.com/photo-1666018215790-867b14fe4822?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGtleSUyMGNvbnRyYWN0JTIwc2lnbmluZ3xlbnwxfHx8fDE3NzE5MTU5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Pháp luật",
    readTime: "10 phút",
    views: 4150,
    likes: 198,
    comments: 53,
    tags: ["pháp luật", "hợp đồng", "đặt cọc", "quyền lợi"],
  },
  {
    id: 5,
    title: "Cách Trang Trí Phòng Trọ Đẹp Với Chi Phí Dưới 500K",
    excerpt:
      "Biến phòng trọ nhỏ trở nên ấm cúng và xinh xắn với những mẹo decor đơn giản, tiết kiệm nhưng vô cùng hiệu quả.",
    author: "Nguyễn Thị Lan",
    authorAvatar: "TL",
    date: "01/02/2026",
    image:
      "https://images.unsplash.com/photo-1718066236079-9085195c389e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcm9vbSUyMGRlY29yYXRpb24lMjBwbGFudHN8ZW58MXx8fHwxNzcxOTE1OTczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Mẹo hay",
    readTime: "5 phút",
    views: 6800,
    likes: 421,
    comments: 89,
    tags: ["trang trí", "decor", "tiết kiệm", "phòng trọ đẹp"],
  },
  {
    id: 6,
    title: "Bí Quyết Tiết Kiệm Chi Phí Khi Sống Ở Phòng Trọ",
    excerpt:
      "Chia sẻ những cách tiết kiệm điện, nước, ăn uống thông minh cho sinh viên và người mới đi làm sống trong phòng trọ.",
    author: "Trần Minh Đức",
    authorAvatar: "MĐ",
    date: "28/01/2026",
    image:
      "https://images.unsplash.com/photo-1561837581-abd854e0ee22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRnZXQlMjBzYXZpbmclMjBtb25leSUyMHBpZ2d5YmFua3xlbnwxfHx8fDE3NzE5MTU5NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Kinh nghiệm",
    readTime: "6 phút",
    views: 3290,
    likes: 156,
    comments: 28,
    tags: ["tiết kiệm", "chi phí", "sinh viên", "mẹo hay"],
  },
  {
    id: 7,
    title: "Hướng Dẫn Đặt Lịch Xem Phòng Online Trên MapHome",
    excerpt:
      "Tận dụng tính năng đặt lịch xem phòng trực tuyến để sắp xếp thời gian một cách khoa học và hiệu quả nhất.",
    author: "Lê Hoàng Nam",
    authorAvatar: "HN",
    date: "25/01/2026",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    category: "Hướng dẫn",
    readTime: "4 phút",
    views: 2100,
    likes: 87,
    comments: 15,
    tags: ["đặt lịch", "xem phòng", "hướng dẫn", "MapHome"],
  },
  {
    id: 8,
    title: "Checklist Kiểm Tra Phòng Trọ Trước Khi Ký Hợp Đồng",
    excerpt:
      "Danh sách 20+ điều cần kiểm tra kỹ khi đi xem phòng: từ điện nước, cửa khóa, tường nứt đến hàng xóm xung quanh.",
    author: "Phạm Thu Hà",
    authorAvatar: "TH",
    date: "20/01/2026",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    category: "Hướng dẫn",
    readTime: "9 phút",
    views: 4560,
    likes: 267,
    comments: 41,
    tags: ["checklist", "kiểm tra phòng", "hợp đồng", "lưu ý"],
  },
  {
    id: 9,
    title: "Xu Hướng Thị Trường Phòng Trọ Hà Nội Đầu Năm 2026",
    excerpt:
      "Phân tích biến động giá thuê, nhu cầu tìm trọ và dự báo xu hướng thị trường nhà trọ tại Hà Nội trong năm 2026.",
    author: "Trần Minh Đức",
    authorAvatar: "MĐ",
    date: "15/01/2026",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    category: "Thị trường",
    readTime: "8 phút",
    views: 5670,
    likes: 198,
    comments: 36,
    tags: ["xu hướng", "thị trường", "2026", "giá thuê"],
  },
];

const ALL_CATEGORIES = [
  "Tất cả",
  "Kinh nghiệm",
  "Hướng dẫn",
  "Thị trường",
  "Pháp luật",
  "Mẹo hay",
  "Tính năng",
];

const POPULAR_TAGS = [
  "tìm trọ",
  "sinh viên",
  "Hà Nội",
  "tiết kiệm",
  "pháp luật",
  "hợp đồng",
  "decor",
  "Trust is King",
  "thị trường",
  "mẹo hay",
];

const POSTS_PER_PAGE = 6;

// ─── Main Component ──────────────────────────────────────────
export function BlogPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarked, setBookmarked] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const toggleBookmark = (id) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Featured post
  const featuredPost = blogPosts.find((p) => p.featured);

  // Filtered posts (excluding featured from grid)
  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter((p) => !p.featured)
      .filter(
        (p) => activeCategory === "Tất cả" || p.category === activeCategory,
      )
      .filter((p) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
  }, [activeCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  // Popular posts (top 4 by views)
  const popularPosts = [...blogPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* ━━━ Hero Banner ━━━ */}
      <section className="relative bg-gradient-to-br from-green-700 via-emerald-700 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <span className="inline-block bg-white/15 backdrop-blur-sm text-sm px-4 py-1.5 rounded-full mb-5 border border-white/20">
            Blog MapHome
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Kiến Thức & Kinh Nghiệm
          </h1>
          <p className="text-green-100 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Chia sẻ thông tin hữu ích về việc tìm kiếm, thuê phòng trọ và cuộc
            sống tự lập tại Hà Nội
          </p>
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-12 pr-4 h-12 rounded-full bg-white text-gray-900 border-0 shadow-xl text-base placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* ━━━ Featured Post ━━━ */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10 mb-10">
        <article
          className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer group border border-gray-100"
          onClick={() => {}}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <ImageWithFallback
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                Nổi bật
              </span>
            </div>
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {featuredPost.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {featuredPost.readTime}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {featuredPost.authorAvatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {featuredPost.author}
                    </p>
                    <p className="text-xs text-gray-400">{featuredPost.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="size-3.5" />
                    {featuredPost.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5" />
                    {featuredPost.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="size-3.5" />
                    {featuredPost.comments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* ━━━ Category Tabs ━━━ */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  activeCategory === cat
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ━━━ Main Content ━━━ */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Blog Grid ── */}
          <div className="lg:col-span-2">
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <Search className="size-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-sm text-gray-400">
                  Thử thay đổi từ khóa hoặc danh mục khác
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {paginatedPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-green-700">
                        {post.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(post.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                      >
                        {bookmarked.has(post.id) ? (
                          <BookmarkCheck className="size-4 text-green-600" />
                        ) : (
                          <Bookmark className="size-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="size-3.5" />
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-green-700 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {post.authorAvatar}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700">
                              {post.author}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {post.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Heart className="size-3.5" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="size-3.5" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-9 w-9 ${currentPage === i + 1 ? "bg-green-600 hover:bg-green-700" : ""}`}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="h-9 w-9"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            {/* Popular Posts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <TrendingUp className="size-5 text-orange-500" />
                Bài viết phổ biến
              </h3>
              <div className="space-y-4">
                {popularPosts.map((post, i) => (
                  <div
                    key={post.id}
                    className="flex gap-3 cursor-pointer group"
                  >
                    <span
                      className={`
                      flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                      ${i === 0 ? "bg-orange-100 text-orange-600" : i === 1 ? "bg-blue-100 text-blue-600" : i === 2 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}
                    `}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <Eye className="size-3" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Heart className="size-3" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                <Mail className="size-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Nhận tin mới</h3>
              <p className="text-green-100 text-sm mb-4 leading-relaxed">
                Đăng ký để nhận bài viết mới nhất về kinh nghiệm tìm trọ và xu
                hướng thị trường
              </p>
              <div className="space-y-2.5">
                <Input
                  placeholder="Email của bạn..."
                  className="bg-white/15 border-white/20 text-white placeholder:text-green-200 h-10 rounded-lg"
                />
                <Button className="w-full bg-white text-green-700 hover:bg-green-50 h-10 font-semibold">
                  Đăng ký
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <Tag className="size-5 text-blue-500" />
                Tags phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setActiveCategory("Tất cả");
                      setCurrentPage(1);
                    }}
                    className="bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-600 text-xs px-3 py-1.5 rounded-full border border-gray-100 hover:border-green-200 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
              <h3 className="font-bold text-base mb-2">Bạn muốn đóng góp?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Chia sẻ kinh nghiệm tìm trọ, mẹo sống tiết kiệm cho cộng đồng
              </p>
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
                onClick={() => navigate("/contact")}
              >
                Viết bài
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
