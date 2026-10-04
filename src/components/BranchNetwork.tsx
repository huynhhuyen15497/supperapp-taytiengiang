import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { BranchInfo } from '../types';
import { MapPin, Phone, Clock, ExternalLink, Building2, Search, Navigation, ShieldCheck, ChevronRight } from 'lucide-react';

export const BranchNetwork: React.FC = () => {
  const { branchNetwork, brand } = contentData;
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo>(branchNetwork.branches[0] as BranchInfo);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBranches = branchNetwork.branches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.office.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#004b87] text-xs font-bold mb-3 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-[#004b87]" /> Mạng lưới phục vụ khách hàng
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#004b87] tracking-tight">
          {branchNetwork.title}
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          {branchNetwork.subtitle}
        </p>
      </div>

      {/* Working hours banner per PDF */}
      <div className="bg-gradient-to-r from-blue-900 to-[#004b87] text-white rounded-3xl p-5 sm:p-6 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">
                Thời gian làm việc chuẩn tại quầy
              </span>
              <h4 className="text-lg font-bold">{branchNetwork.workingHours.weekdays}</h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <div className="bg-white/15 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 font-semibold">
              {branchNetwork.workingHours.morning}
            </div>
            <div className="bg-white/15 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 font-semibold">
              {branchNetwork.workingHours.afternoon}
            </div>
            <div className="bg-red-500/80 px-3.5 py-1.5 rounded-xl text-white font-bold">
              {branchNetwork.workingHours.weekend}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: List & Selected details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Branch Directory List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên PGD, khu vực, địa chỉ..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm outline-hidden focus:border-[#004b87] shadow-xs"
            />
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredBranches.map((branch) => {
              const isSelected = selectedBranch.stt === branch.stt;
              return (
                <div
                  key={branch.stt}
                  onClick={() => setSelectedBranch(branch as BranchInfo)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#004b87] shadow-sm ring-1 ring-[#004b87]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#004b87] text-white text-[10px] font-bold flex items-center justify-center">
                          {branch.stt}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {branch.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1 pl-7">
                        {branch.address}
                      </p>
                    </div>

                    {branch.isHeadquarters && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded shrink-0">
                        Hội sở
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Selected Branch Showcase */}
        <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          {/* Branch Image */}
          <div className="relative h-64 sm:h-72 bg-slate-100 overflow-hidden">
            <img
              src={selectedBranch.imageUrl}
              alt={selectedBranch.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback placeholder
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

            <div className="absolute top-4 left-4">
              <span className="text-xs font-black text-white bg-[#004b87] px-3 py-1 rounded-full shadow-md">
                {selectedBranch.office}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
                {selectedBranch.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 flex items-center gap-1.5 drop-shadow-xs">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>{selectedBranch.address}</span>
              </p>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hotline Call Button */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Đường dây nóng PGD
                </span>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {selectedBranch.displayPhone}
                </div>
                <a
                  href={`tel:${selectedBranch.phone}`}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" /> Gọi điện ngay
                </a>
              </div>

              {/* Working hours */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Giờ phục vụ
                </span>
                <div className="text-xs font-semibold text-slate-800 mt-1 space-y-0.5">
                  <p>Sáng: 07:30 - 11:30</p>
                  <p>Chiều: 13:30 - 16:30</p>
                  <p className="text-slate-400 text-[10px]">T7 - CN: Nghỉ giao dịch</p>
                </div>
              </div>
            </div>

            {/* Google Maps link as requested in PDF with Map icon */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={selectedBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Mở bản đồ Google Maps & Chỉ đường</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href={`tel:${brand.consultant.phone}`}
                className="w-full sm:w-auto py-3.5 px-5 bg-[#004b87] hover:bg-[#003b6b] text-white font-bold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Gặp tư vấn viên ({brand.consultant.name})</span>
              </a>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#004b87] shrink-0" />
              <span>Quý khách cũng có thể đặt lịch hẹn trước qua ứng dụng VietinBank iPay để được phục vụ ưu tiên không phải chờ đợi.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
