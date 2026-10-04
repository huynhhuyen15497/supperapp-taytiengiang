import React, { useState } from 'react';
import { VoucherItem } from '../types';
import { X, Gift, Copy, Check, Trash2, Trophy } from 'lucide-react';

interface VoucherHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vouchers: VoucherItem[];
  onClear: () => void;
}

export const VoucherHistoryModal: React.FC<VoucherHistoryModalProps> = ({
  isOpen,
  onClose,
  vouchers,
  onClear,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#004b87] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Voucher quà tặng của bạn</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {vouchers.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8" />
              </div>
              <p className="text-slate-600 font-bold text-sm">Chưa có voucher nào</p>
              <p className="text-xs text-slate-400 mt-1">
                Hãy tham gia mini game tại quầy để rinh ngay voucher xăng 2 lít!
              </p>
            </div>
          ) : (
            vouchers.map((item) => (
              <div
                key={item.id}
                className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-bold text-[#004b87]">{item.gameName}</span>
                  <span>{item.timestamp}</span>
                </div>
                <div className="text-xl font-black font-mono text-slate-900 tracking-wider my-1">
                  {item.voucherCode}
                </div>
                <p className="text-xs font-semibold text-emerald-700">
                  {item.reward}
                </p>

                <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Điểm đạt được: <strong>{item.score}</strong>
                  </span>
                  <button
                    onClick={() => handleCopy(item.voucherCode, item.id)}
                    className="flex items-center gap-1 text-xs font-bold text-[#004b87] hover:underline"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {vouchers.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClear}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa lịch sử
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#004b87] text-white text-xs font-bold rounded-xl"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
