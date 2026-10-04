import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { TabType } from '../types';
import { Phone, Clock, UserCheck, Menu, X, ArrowLeft, Gift } from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  savedVouchersCount?: number;
  onOpenVouchers?: () => void;
  onOpenConsultant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  savedVouchersCount = 0,
  onOpenVouchers,
  onOpenConsultant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const brand = contentData.brand;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top microbar */}
      <div className="bg-[#004b87] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 text-slate-100">
            <span className="font-medium hidden sm:inline">{brand.fullName}</span>
            <span className="hidden md:inline text-blue-200">|</span>
            <span className="text-blue-100 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {brand.workingHours.days}: {brand.workingHours.morning} • {brand.workingHours.afternoon}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenConsultant}
              className="flex items-center gap-1.5 text-xs text-yellow-300 hover:text-white font-medium cursor-pointer transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Cán bộ: <strong className="underline underline-offset-2">{brand.consultant.name}</strong></span>
            </button>
            <a
              href={`tel:${brand.consultant.phone}`}
              className="hidden lg:flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded-full text-[11px] font-semibold transition"
            >
              <Phone className="w-3 h-3" /> {brand.consultant.displayPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo VietinBank per specification */}
          <div className="flex items-center space-x-4">
            {currentTab !== 'home' && (
              <button
                onClick={() => onSelectTab('home')}
                className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-[#004b87] hover:bg-slate-100 transition-colors flex items-center gap-1 text-sm font-medium"
                title="Quay về trang chủ"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Trang chủ</span>
              </button>
            )}

            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-3 text-left focus:outline-hidden group"
            >
              <img
                src={brand.logo}
                alt="Logo VietinBank"
                className="h-9 sm:h-11 object-contain transition-transform group-hover:scale-102"
                onError={(e) => {
                  // Fallback visually if raw github content has cross-origin or network lag
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-fallback" className="hidden items-center">
                <span className="text-[#004b87] text-2xl font-black tracking-tight">Vietin</span>
                <span className="text-[#ed1b24] text-2xl font-black tracking-tight">Bank</span>
              </div>
              <div className="hidden lg:block border-l border-slate-300 pl-3">
                <div className="text-[13px] font-bold text-[#004b87] uppercase tracking-wide leading-tight">
                  Quầy Giao Dịch Số
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                  Chi nhánh Tây Tiền Giang
                </div>
              </div>
            </button>
          </div>

          {/* Desktop quick navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {contentData.modules.slice(0, 5).map((mod) => {
              const active = currentTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => onSelectTab(mod.id as TabType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#004b87] text-white shadow-xs'
                      : 'text-slate-700 hover:text-[#004b87] hover:bg-blue-50/70'
                  }`}
                >
                  {mod.title}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {savedVouchersCount > 0 && (
              <button
                onClick={onOpenVouchers}
                className="relative flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-full text-xs font-semibold hover:bg-amber-100 transition shadow-xs"
              >
                <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                <span>Voucher của bạn</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedVouchersCount}
                </span>
              </button>
            )}

            <button
              onClick={onOpenConsultant}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#004b87] to-[#0068b3] hover:from-[#003b6b] hover:to-[#005594] text-white text-xs font-semibold rounded-lg shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gặp tư vấn viên</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:text-[#004b87] hover:bg-slate-100 transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => {
                onSelectTab('home');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                currentTab === 'home' ? 'bg-[#004b87] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Trang chủ quầy giao dịch
            </button>
            {contentData.modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  onSelectTab(mod.id as TabType);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-between ${
                  currentTab === mod.id
                    ? 'bg-[#004b87] text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{mod.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                  {mod.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-600 bg-blue-50/70 p-2.5 rounded-lg">
              <div>
                <p className="font-semibold text-[#004b87]">{brand.consultant.title}</p>
                <p className="font-bold text-slate-900">{brand.consultant.name}</p>
              </div>
              <a
                href={`tel:${brand.consultant.phone}`}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md font-bold text-xs flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> Gọi ngay
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
