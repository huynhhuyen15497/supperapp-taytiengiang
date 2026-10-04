import React, { useState, useMemo } from 'react';
import contentData from '../data/contentData.json';
import { PiggyBank, Calculator, AlertTriangle, Video, ExternalLink, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export const SavingsCalculator: React.FC = () => {
  const { savingsCalculator } = contentData;

  // Form states
  const [amountStr, setAmountStr] = useState<string>('50,000,000');
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [interestRateStr, setInterestRateStr] = useState<string>('5.0');
  const [touched, setTouched] = useState<{ amount: boolean; period: boolean; rate: boolean }>({
    amount: true,
    period: true,
    rate: true,
  });

  // Handle amount formatting with commas & strictly numbers
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, amount: true }));
    // Remove non-digits
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (!rawVal) {
      setAmountStr('');
      return;
    }
    const num = parseInt(rawVal, 10);
    setAmountStr(num.toLocaleString('en-US'));
  };

  // When changing period, auto-suggest standard rate from table
  const handlePeriodChange = (months: number) => {
    setTouched(prev => ({ ...prev, period: true }));
    setSelectedMonths(months);
    const match = savingsCalculator.defaultPeriods.find(p => p.months === months);
    if (match) {
      setInterestRateStr(match.rate.toString());
    }
  };

  // Validation per specification
  const parsedAmount = useMemo(() => {
    const raw = amountStr.replace(/,/g, '');
    return raw ? parseFloat(raw) : 0;
  }, [amountStr]);

  const parsedRate = useMemo(() => {
    const raw = interestRateStr.replace(/,/g, '.');
    return raw ? parseFloat(raw) : 0;
  }, [interestRateStr]);

  const amountError = useMemo(() => {
    if (!touched.amount) return null;
    if (!amountStr || parsedAmount <= 0 || isNaN(parsedAmount)) {
      return savingsCalculator.validation.amountRequired; // “Vui lòng nhập số tiền gửi hợp lệ.”
    }
    if (parsedAmount < savingsCalculator.minAmount) {
      return `Số tiền gửi tối thiểu là ${savingsCalculator.minAmount.toLocaleString('vi-VN')} VND.`;
    }
    return null;
  }, [amountStr, parsedAmount, savingsCalculator.minAmount, savingsCalculator.validation.amountRequired, touched.amount]);

  const periodError = useMemo(() => {
    if (!touched.period) return null;
    if (!selectedMonths || selectedMonths <= 0) {
      return savingsCalculator.validation.periodRequired; // “Vui lòng chọn kỳ hạn gửi.”
    }
    return null;
  }, [selectedMonths, savingsCalculator.validation.periodRequired, touched.period]);

  const rateError = useMemo(() => {
    if (!touched.rate) return null;
    if (interestRateStr === '' || isNaN(parsedRate) || parsedRate < 0 || parsedRate > 20) {
      return savingsCalculator.validation.rateRequired; // “Vui lòng nhập lãi suất hợp lệ.”
    }
    return null;
  }, [interestRateStr, parsedRate, savingsCalculator.validation.rateRequired, touched.rate]);

  const isValid = !amountError && !periodError && !rateError && parsedAmount > 0;

  // Calculate interest: Công thức trả lãi sau = (Số tiền gửi x Lãi suất %/năm x Số tháng) / 12
  const { interestAmount, totalAmount } = useMemo(() => {
    if (!isValid) return { interestAmount: 0, totalAmount: 0 };
    const interest = Math.round((parsedAmount * (parsedRate / 100) * selectedMonths) / 12);
    const total = parsedAmount + interest;
    return { interestAmount: interest, totalAmount: total };
  }, [isValid, parsedAmount, parsedRate, selectedMonths]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 uppercase tracking-wider">
          <PiggyBank className="w-3.5 h-3.5 text-emerald-600" /> Tiết kiệm thông minh VietinBank
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#004b87] tracking-tight">
          {savingsCalculator.title}
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          {savingsCalculator.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#004b87]" />
            <span>Nhập thông tin tiền gửi</span>
          </h3>

          <div className="space-y-6">
            {/* Input 1: Số tiền gửi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  <span>Số tiền gửi</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">VND</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountStr}
                  onChange={handleAmountChange}
                  onBlur={() => setTouched(prev => ({ ...prev, amount: true }))}
                  placeholder="Ví dụ: 100,000,000"
                  className={`w-full text-lg sm:text-xl font-bold px-4 py-3.5 rounded-xl border transition outline-hidden ${
                    amountError
                      ? 'border-red-400 bg-red-50/40 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#004b87] focus:ring-2 focus:ring-blue-100 text-slate-900'
                  }`}
                />
              </div>
              {amountError && (
                <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5 animate-in fade-in">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{amountError}</span>
                </p>
              )}

              {/* Quick amount chips */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[20000000, 50000000, 100000000, 500000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAmountStr(val.toLocaleString('en-US'));
                      setTouched(prev => ({ ...prev, amount: true }));
                    }}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#004b87] text-slate-600 transition cursor-pointer"
                  >
                    +{(val / 1000000).toLocaleString()} triệu
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Kỳ hạn gửi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  <span>Kỳ hạn (Tháng)</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500">Chọn theo biểu lãi suất</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                {savingsCalculator.defaultPeriods.map((period) => {
                  const isSelected = selectedMonths === period.months;
                  return (
                    <button
                      key={period.months}
                      type="button"
                      onClick={() => handlePeriodChange(period.months)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-[#004b87] bg-blue-50/70 shadow-xs ring-2 ring-blue-100'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm text-slate-900">
                        {period.months} Tháng
                      </div>
                      <div className="text-[11px] font-semibold text-[#004b87] mt-0.5">
                        {period.rate}% / năm
                      </div>
                    </button>
                  );
                })}
              </div>
              {periodError && (
                <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{periodError}</span>
                </p>
              )}
            </div>

            {/* Input 3: Lãi suất */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  <span>Lãi suất áp dụng</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500">Có thể chỉnh theo thỏa thuận</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={interestRateStr}
                  onChange={(e) => {
                    setTouched(prev => ({ ...prev, rate: true }));
                    setInterestRateStr(e.target.value);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, rate: true }))}
                  placeholder="5.0"
                  className={`w-full font-bold px-4 py-3 rounded-xl border transition outline-hidden ${
                    rateError
                      ? 'border-red-400 bg-red-50/40 text-red-900 focus:border-red-500'
                      : 'border-slate-300 focus:border-[#004b87] text-slate-900'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-slate-500">
                  %/năm
                </span>
              </div>
              {rateError && (
                <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{rateError}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Output: Calculations Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#004b87] to-[#002d52] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/20 mb-6">
              <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Kết quả dự tính
              </span>
              <span className="text-xs text-blue-200">Trả lãi cuối kỳ</span>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Tiền gửi ban đầu</p>
                <div className="text-2xl font-bold tracking-tight mt-0.5">
                  {isValid ? parsedAmount.toLocaleString('vi-VN') : 0} <span className="text-sm font-normal text-blue-200">VND</span>
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs">
                <p className="text-xs text-amber-300 uppercase tracking-wide font-bold">Tiền lãi dự tính</p>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight mt-1">
                  +{isValid ? interestAmount.toLocaleString('vi-VN') : 0} <span className="text-base font-normal">VND</span>
                </div>
                <p className="text-[11px] text-blue-200 mt-1">
                  Tương đương ~ {isValid ? Math.round(interestAmount / selectedMonths).toLocaleString('vi-VN') : 0} VND/tháng
                </p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Tổng tiền nhận được (Gốc + Lãi)</p>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  {isValid ? totalAmount.toLocaleString('vi-VN') : 0} <span className="text-sm font-normal text-blue-200">VND</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-blue-200">
              <Info className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>Lãi tính theo quy ước 365 ngày/năm. Tiền lãi thực tế có thể thay đổi tùy số ngày thực gửi.</span>
            </div>
          </div>

          {/* Video guide card as specified in PDF 1 page 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{savingsCalculator.videoGuide.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Hướng dẫn gửi tiết kiệm trực tuyến nhận ưu đãi lãi suất trên điện thoại</p>
              </div>
            </div>

            <a
              href={savingsCalculator.videoGuide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Xem video trên TikTok</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
