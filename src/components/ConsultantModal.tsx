import React from 'react';
import contentData from '../data/contentData.json';
import { Phone, MessageSquare, X, ShieldCheck, User, Building, Clock } from 'lucide-react';

interface ConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicRef?: string;
}

export const ConsultantModal: React.FC<ConsultantModalProps> = ({
  isOpen,
  onClose,
  topicRef,
}) => {
  if (!isOpen) return null;
  const { brand } = contentData;
  const { consultant, workingHours } = brand;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-[#004b87] flex items-center justify-center font-bold text-xl ring-4 ring-blue-50">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-md">
              Hỗ trợ trực tiếp tại quầy
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
              {consultant.name}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {consultant.title}
            </p>
          </div>
        </div>

        {topicRef && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <p className="font-semibold">Nhu cầu hỗ trợ:</p>
            <p className="text-slate-700 mt-0.5">{topicRef}</p>
          </div>
        )}

        <div className="space-y-2.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-700">
            <Building className="w-4 h-4 text-[#004b87] shrink-0" />
            <span>{consultant.branch}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-[#004b87] shrink-0" />
            <span>{workingHours.morning} • {workingHours.afternoon} (Thứ 2 - Thứ 6)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cam kết tư vấn nhiệt tình, bảo mật tuyệt đối</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${consultant.phone}`}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm rounded-xl shadow-md shadow-red-500/20 transition transform active:scale-98"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi {consultant.displayPhone}</span>
          </a>
          <a
            href={`https://zalo.me/${consultant.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#004b87] hover:bg-[#003b6b] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-900/20 transition transform active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Nhắn tin Zalo</span>
          </a>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Tổng đài chăm sóc khách hàng VietinBank: <a href="tel:1900558868" className="text-[#004b87] font-semibold hover:underline">1900 558 868</a>
          </p>
        </div>
      </div>
    </div>
  );
};
