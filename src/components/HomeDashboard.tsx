import React from 'react';
import contentData from '../data/contentData.json';
import { TabType } from '../types';
import { 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  PiggyBank, 
  Calculator, 
  Sparkles, 
  MapPin, 
  Star, 
  Gift, 
  Phone, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface HomeDashboardProps {
  onSelectTab: (tab: TabType) => void;
  onOpenConsultant: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectTab,
  onOpenConsultant,
}) => {
  const { brand, modules } = contentData;

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle className="w-7 h-7" />;
      case 'Smartphone':
        return <Smartphone className="w-7 h-7" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-7 h-7" />;
      case 'PiggyBank':
        return <PiggyBank className="w-7 h-7" />;
      case 'Calculator':
        return <Calculator className="w-7 h-7" />;
      case 'Sparkles':
        return <Sparkles className="w-7 h-7" />;
      case 'MapPin':
        return <MapPin className="w-7 h-7" />;
      default:
        return <Star className="w-7 h-7" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero Welcome Banner for Kiosk / Tablet / Mobile */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#004b87] via-[#003b6b] to-[#00284d] text-white p-6 sm:p-12 mb-10 shadow-xl border border-blue-900">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-yellow-300 text-xs font-bold mb-4 border border-white/10">
            <Award className="w-4 h-4 text-yellow-300" />
            <span>Kính chào Quý khách đến với VietinBank Chi nhánh Tây Tiền Giang</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Quầy Giao Dịch Số Thông Minh
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            Nền tảng tương tác tự phục vụ tại quầy: giải đáp thắc mắc tài khoản, tính nhanh lãi suất tiết kiệm & phương án vay, săn voucher xăng giải trí, và khám phá tiện ích số VietinBank iPay.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('support')}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>Giải đáp thắc mắc ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('game-zone')}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-400/20 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 text-slate-950" />
              <span>Chơi game nhận Voucher Xăng</span>
            </button>

            <button
              onClick={onOpenConsultant}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl backdrop-blur-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Hỗ trợ trực tiếp</span>
            </button>
          </div>
        </div>

        {/* Floating consultant quick contact card in banner */}
        <div className="hidden lg:flex absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl items-center gap-3.5 max-w-xs">
          <div className="w-11 h-11 rounded-full bg-yellow-400 text-slate-900 font-bold flex items-center justify-center shrink-0">
            HT
          </div>
          <div>
            <span className="text-[10px] text-yellow-300 uppercase tracking-wider font-bold">Cán bộ tư vấn quầy</span>
            <div className="text-sm font-bold text-white">{brand.consultant.name}</div>
            <a href={`tel:${brand.consultant.phone}`} className="text-xs text-blue-200 hover:underline flex items-center gap-1 mt-0.5 font-semibold">
              <Phone className="w-3 h-3 text-red-400" /> {brand.consultant.displayPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Grid of the 7 Key Features */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Chọn tiện ích bạn cần phục vụ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Chạm vào bất kỳ tiện ích nào dưới đây để bắt đầu trải nghiệm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const isFeatured = mod.id === 'featured-products';

            // Special requirement from PDF 4:
            // "Card này nên có thiết kế nổi hơn một chút: có nhãn nhỏ “Nổi bật”, icon ngôi sao/quà tặng, nền gradient xanh nhẹ hoặc viền đỏ mảnh. Nút: Xem ngay"
            if (isFeatured) {
              return (
                <div
                  key={mod.id}
                  onClick={() => onSelectTab(mod.id as TabType)}
                  className="group relative bg-gradient-to-br from-blue-50/90 via-sky-50/70 to-red-50/40 rounded-3xl p-7 border-2 border-red-500/80 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className="text-[11px] font-extrabold text-white bg-red-600 px-3 py-1 rounded-full shadow-xs flex items-center gap-1 animate-pulse">
                      <Star className="w-3 h-3 fill-white" />
                      Nổi bật
                    </span>
                  </div>

                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center mb-5 shadow-md shadow-red-500/20 group-hover:scale-110 transition-transform">
                      <Gift className="w-7 h-7 text-yellow-200" />
                    </div>

                    <span className="text-xs font-bold text-red-600 tracking-wide uppercase">
                      {mod.subtitle}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-red-600 transition mt-1 mb-2">
                      {mod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                      {mod.description}
                    </p>
                  </div>

                  {/* Nút: Xem ngay as specified in PDF */}
                  <div className="pt-4 border-t border-red-200/50 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-red-600 flex items-center gap-1 group-hover:underline">
                      Xem ngay <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[11px] text-slate-500 bg-white/80 px-2 py-0.5 rounded-md font-semibold border border-slate-200">
                      5 Gói ưu đãi
                    </span>
                  </div>
                </div>
              );
            }

            // Normal cards
            return (
              <div
                key={mod.id}
                onClick={() => onSelectTab(mod.id as TabType)}
                className="group bg-white rounded-3xl p-7 border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 text-[#004b87] border border-slate-100 flex items-center justify-center group-hover:bg-[#004b87] group-hover:text-white transition-colors duration-300 group-hover:scale-105">
                      {getModuleIcon(mod.icon)}
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-[#004b87] transition">
                      {mod.badge}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {mod.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#004b87] transition mt-1 mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004b87]">
                  <span className="flex items-center gap-1 group-hover:underline">
                    Truy cập tiện ích
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Safe banking footer badge */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Ứng dụng hỗ trợ giao dịch số chuẩn xác, an toàn, được vận hành bởi Ngân hàng TMCP Công Thương Việt Nam.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-semibold shrink-0">
          <span>Hotline: 1900 558 868</span>
          <span>•</span>
          <span>Cán bộ tư vấn: {brand.consultant.displayPhone}</span>
        </div>
      </div>
    </div>
  );
};
