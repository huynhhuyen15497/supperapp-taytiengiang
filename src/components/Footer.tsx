import React from 'react';
import contentData from '../data/contentData.json';
import { TabType } from '../types';
import { Phone, Building, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: TabType) => void;
  onOpenConsultant: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenConsultant,
}) => {
  const { brand } = contentData;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-xs">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-white text-xl font-black tracking-tight">VietinBank</span>
              <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">Tây Tiền Giang</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {brand.fullName} - {brand.slogan}. Ứng dụng web quầy thông minh hỗ trợ khách hàng tra cứu, tương tác số hóa và trải nghiệm dịch vụ tiện ích ngân hàng.
            </p>
            <div className="pt-2 text-slate-400 space-y-1">
              <p>📍 Hội sở: 560 Quốc lộ 1A, Khu phố 1, Phường Cai Lậy, Tỉnh Đồng Tháp</p>
              <p>🕒 Giờ giao dịch: Thứ 2 - Thứ 6 (07:30 - 11:30 | 13:30 - 16:30)</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Tiện ích nhanh</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onSelectTab('support')} className="hover:text-white transition">
                  Giải đáp thắc mắc tài khoản
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('game-zone')} className="hover:text-white transition">
                  Thử thách Game nhận Voucher
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('savings-calc')} className="hover:text-white transition">
                  Tính lãi suất tiền gửi
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('loan-calc')} className="hover:text-white transition">
                  Bảng tính lịch trả nợ vay
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('featured-products')} className="hover:text-white transition">
                  Sản phẩm dịch vụ nổi bật
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('branches')} className="hover:text-white transition">
                  Điểm giao dịch mạng lưới
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Consultant info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Tư vấn trực tiếp</h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
              <p className="text-slate-300 font-semibold">{brand.consultant.title}</p>
              <p className="text-white font-bold text-sm">{brand.consultant.name}</p>
              <a
                href={`tel:${brand.consultant.phone}`}
                className="inline-flex items-center gap-1.5 text-yellow-300 font-bold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" /> {brand.consultant.displayPhone}
              </a>
            </div>
            <p className="text-slate-400 text-[11px]">
              Tổng đài VietinBank toàn quốc: <a href="tel:1900558868" className="text-white font-bold hover:underline">1900 558 868</a>
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} VietinBank. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-1">
            <span>Dành cho trải nghiệm tại quầy giao dịch VietinBank</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
