import React, { useState, useMemo } from 'react';
import contentData from '../data/contentData.json';
import { Calculator, Calendar, FileText, ChevronRight, X, Printer, Download, DollarSign, HelpCircle, CheckCircle } from 'lucide-react';

interface ScheduleRow {
  period: number;
  dateStr: string;
  startBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endBalance: number;
}

export const LoanCalculator: React.FC = () => {
  const { loanCalculator } = contentData;

  // Inputs per specification - STRICTLY text/numeric input, NO SLIDERS!
  const [loanAmountStr, setLoanAmountStr] = useState<string>('500,000,000');
  const [assetValueStr, setAssetValueStr] = useState<string>('800,000,000');
  const [termMonths, setTermMonths] = useState<number>(60);
  const [annualRateStr, setAnnualRateStr] = useState<string>('8.5');
  const [disbursementDate, setDisbursementDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [repaymentCycle, setRepaymentCycle] = useState<'monthly' | 'quarterly' | 'semiAnnual' | 'annual'>('monthly');
  const [repaymentDay, setRepaymentDay] = useState<number>(25);
  const [roundingMode, setRoundingMode] = useState<'vnd' | 'thousand'>('thousand');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Formatting helpers
  const handleAmountChange = (val: string, setter: (v: string) => void) => {
    const rawVal = val.replace(/[^0-9]/g, '');
    if (!rawVal) {
      setter('');
      return;
    }
    const num = parseInt(rawVal, 10);
    setter(num.toLocaleString('en-US'));
  };

  const parsedLoanAmount = useMemo(() => {
    const raw = loanAmountStr.replace(/,/g, '');
    return raw ? parseFloat(raw) : 0;
  }, [loanAmountStr]);

  const parsedAnnualRate = useMemo(() => {
    const raw = annualRateStr.replace(/,/g, '.');
    return raw ? parseFloat(raw) : 0;
  }, [annualRateStr]);

  // Determine cycles per year and total periods
  const cycleConfig = useMemo(() => {
    switch (repaymentCycle) {
      case 'monthly':
        return { divisor: 12, monthsPerCycle: 1, name: 'Hằng tháng' };
      case 'quarterly':
        return { divisor: 4, monthsPerCycle: 3, name: 'Hằng quý' };
      case 'semiAnnual':
        return { divisor: 2, monthsPerCycle: 6, name: '6 tháng' };
      case 'annual':
        return { divisor: 1, monthsPerCycle: 12, name: 'Hằng năm' };
    }
  }, [repaymentCycle]);

  // Rounding function helper
  const roundValue = (val: number, mode: 'vnd' | 'thousand'): number => {
    if (mode === 'thousand') {
      return Math.round(val / 1000) * 1000;
    }
    return Math.round(val);
  };

  // Generate repayment schedule per business rules in PDF
  const scheduleData = useMemo(() => {
    if (parsedLoanAmount <= 0 || termMonths <= 0 || parsedAnnualRate < 0) {
      return { rows: [], totalPrincipal: 0, totalInterest: 0, totalPayment: 0, firstMonthPay: 0, lastMonthPay: 0 };
    }

    const totalPeriods = Math.max(1, Math.ceil(termMonths / cycleConfig.monthsPerCycle));
    const ratePerPeriod = (parsedAnnualRate / 100) / cycleConfig.divisor;
    
    // Base principal per period = Loan / TotalPeriods
    const rawBasePrincipal = parsedLoanAmount / totalPeriods;
    const basePrincipal = roundValue(rawBasePrincipal, roundingMode);

    const rows: ScheduleRow[] = [];
    let currentBalance = parsedLoanAmount;
    let accumulatedPrincipalPaid = 0;
    let sumPrincipal = 0;
    let sumInterest = 0;

    const [disburseYear, disburseMonth, disburseDay] = disbursementDate.split('-').map(Number);
    // Base date
    const dDate = new Date(disburseYear, disburseMonth - 1, disburseDay);

    for (let i = 1; i <= totalPeriods; i++) {
      const startBalance = currentBalance;
      
      // Calculate repayment date
      // Example: Disbursed 10/01/2026, monthly cycle, repayment day 25 -> 25/02/2026, 25/03/2026...
      const nextMonthIndex = (disburseMonth - 1) + (i * cycleConfig.monthsPerCycle);
      const rowDate = new Date(disburseYear, nextMonthIndex, 1);
      // Clamp repayment day to maximum days of that month
      const maxDaysInMonth = new Date(rowDate.getFullYear(), rowDate.getMonth() + 1, 0).getDate();
      const actualDay = Math.min(repaymentDay, maxDaysInMonth);
      rowDate.setDate(actualDay);

      const dayStr = String(rowDate.getDate()).padStart(2, '0');
      const monthStr = String(rowDate.getMonth() + 1).padStart(2, '0');
      const yearStr = rowDate.getFullYear();
      const dateStr = `${dayStr}/${monthStr}/${yearStr}`;

      // Calculate interest
      let interest = roundValue(startBalance * ratePerPeriod, roundingMode);

      // Principal: For the last period, adjust rounding difference!
      let principal = basePrincipal;
      if (i === totalPeriods) {
        principal = parsedLoanAmount - accumulatedPrincipalPaid;
      } else {
        if (principal > startBalance) {
          principal = startBalance;
        }
      }

      const totalPayment = principal + interest;
      const endBalance = Math.max(0, startBalance - principal);

      accumulatedPrincipalPaid += principal;
      currentBalance = endBalance;
      sumPrincipal += principal;
      sumInterest += interest;

      rows.push({
        period: i,
        dateStr,
        startBalance,
        principal,
        interest,
        totalPayment,
        endBalance,
      });
    }

    return {
      rows,
      totalPrincipal: sumPrincipal,
      totalInterest: sumInterest,
      totalPayment: sumPrincipal + sumInterest,
      firstMonthPay: rows[0] ? rows[0].totalPayment : 0,
      lastMonthPay: rows[rows.length - 1] ? rows[rows.length - 1].totalPayment : 0,
    };
  }, [cycleConfig, disbursementDate, parsedAnnualRate, parsedLoanAmount, repaymentDay, roundingMode, termMonths]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3 uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5 text-blue-600" /> Công cụ tài chính VietinBank
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#004b87] tracking-tight">
          {loanCalculator.title}
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          {loanCalculator.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* Left Form: Inputs (Strictly input, no sliders per PDF) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#004b87]" />
              <span>Bước 1: Nhập thông tin khoản vay</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">Đơn vị: VND</span>
          </div>

          <div className="space-y-5">
            {/* Giá trị tài sản (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Giá trị tài sản bảo đảm (Dự kiến)</label>
                <span className="text-[11px] text-slate-400">Tham khảo</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={assetValueStr}
                  onChange={(e) => handleAmountChange(e.target.value, setAssetValueStr)}
                  placeholder="800,000,000"
                  className="w-full font-bold px-4 py-3 rounded-xl border border-slate-300 focus:border-[#004b87] focus:ring-2 focus:ring-blue-100 outline-hidden text-slate-800"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">VND</span>
              </div>
            </div>

            {/* Số tiền vay - STRICTLY INPUT, NO SLIDERS */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>Số tiền vay</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Bắt buộc nhập</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={loanAmountStr}
                  onChange={(e) => handleAmountChange(e.target.value, setLoanAmountStr)}
                  placeholder="500,000,000"
                  className="w-full text-lg font-black px-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#004b87] focus:ring-2 focus:ring-blue-100 outline-hidden text-slate-900"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-500">VND</span>
              </div>

              {/* Quick amount chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[200000000, 500000000, 1000000000, 2000000000].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setLoanAmountStr(v.toLocaleString('en-US'))}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-[#004b87] text-slate-600 transition cursor-pointer"
                  >
                    {(v / 1000000000 >= 1) ? `${v / 1000000000} Tỷ` : `${v / 1000000} Triệu`}
                  </button>
                ))}
              </div>
            </div>

            {/* Thời gian vay (Tháng) & Lãi suất (%/năm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Thời gian vay (Tháng) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={termMonths}
                    onChange={(e) => setTermMonths(parseInt(e.target.value, 10) || 1)}
                    className="w-full font-bold px-4 py-3 rounded-xl border border-slate-300 focus:border-[#004b87] outline-hidden text-slate-900"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-xs text-slate-400">
                    tháng ({Math.floor(termMonths / 12)} năm {termMonths % 12 > 0 ? `${termMonths % 12}th` : ''})
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Lãi suất (%/Năm) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={annualRateStr}
                    onChange={(e) => setAnnualRateStr(e.target.value)}
                    placeholder="8.5"
                    className="w-full font-bold px-4 py-3 rounded-xl border border-slate-300 focus:border-[#004b87] outline-hidden text-slate-900"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-500">%/Năm</span>
                </div>
              </div>
            </div>

            {/* Ngày giải ngân & Chu kỳ trả nợ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Ngày giải ngân <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={disbursementDate}
                    onChange={(e) => setDisbursementDate(e.target.value)}
                    className="w-full font-bold px-4 py-3 rounded-xl border border-slate-300 focus:border-[#004b87] outline-hidden text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Chu kỳ trả nợ
                </label>
                <select
                  value={repaymentCycle}
                  onChange={(e) => setRepaymentCycle(e.target.value as any)}
                  className="w-full font-bold px-4 py-3 rounded-xl border border-slate-300 focus:border-[#004b87] outline-hidden text-slate-900 bg-white"
                >
                  {loanCalculator.cycles.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ngày trả nợ định kỳ & Quy tắc làm tròn số */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Ngày trả nợ định kỳ (Hàng tháng)
                </label>
                <select
                  value={repaymentDay}
                  onChange={(e) => setRepaymentDay(parseInt(e.target.value, 10))}
                  className="w-full font-bold px-4 py-3 rounded-xl border border-slate-300 focus:border-[#004b87] outline-hidden text-slate-900 bg-white"
                >
                  {[5, 10, 15, 20, 25, 28, 30].map(d => (
                    <option key={d} value={d}>Ngày {d} hằng tháng</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Quy tắc làm tròn số
                </label>
                <select
                  value={roundingMode}
                  onChange={(e) => setRoundingMode(e.target.value as any)}
                  className="w-full font-bold px-4 py-3 rounded-xl border border-slate-300 focus:border-[#004b87] outline-hidden text-slate-900 bg-white"
                >
                  <option value="thousand">Làm tròn đến 1.000 đồng</option>
                  <option value="vnd">Làm tròn đến đơn vị đồng (1đ)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: Summary Card per PDF design */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center justify-between">
              <span>Ước tính số tiền thanh toán</span>
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">Giảm dần</span>
            </h3>

            <div className="space-y-4 mb-6">
              {/* Số tiền trả hàng tháng (từ tháng đầu đến tháng cuối) */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <p className="text-xs text-slate-500 font-medium">Số tiền trả hàng tháng (Dự tính)</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs text-slate-500 font-semibold">Từ</span>
                  <span className="text-xl sm:text-2xl font-black text-[#004b87]">
                    {scheduleData.firstMonthPay.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">đến</span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-700">
                    {scheduleData.lastMonthPay.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs text-slate-500">VND</span>
                </div>
              </div>

              {/* Tổng lãi phải trả */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Tổng lãi phải trả:</span>
                <span className="text-sm sm:text-base font-bold text-red-600">
                  {scheduleData.totalInterest.toLocaleString('vi-VN')} VND
                </span>
              </div>

              {/* Tổng tiền phải trả (Gốc + Lãi) */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Tổng số tiền phải trả (Gốc + Lãi):</span>
                <span className="text-base sm:text-lg font-black text-[#004b87]">
                  {scheduleData.totalPayment.toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>

            {/* Bước 2: Khi click vào “Xem chi tiết” thì hiện bảng tính lịch trả nợ với dư nợ giảm dần */}
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="w-full py-3.5 px-6 bg-[#004b87] hover:bg-[#003b6b] text-white font-extrabold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Xem chi tiết lịch trả nợ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Principle explanation box as specified in PDF */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#004b87]" />
              <span>Nguyên tắc: Trả gốc đều, lãi tính trên dư nợ giảm dần</span>
            </h4>
            <p>• <strong>Gốc trả mỗi kỳ</strong> = Số tiền vay / Tổng số kỳ trả nợ</p>
            <p>• <strong>Lãi kỳ hiện tại</strong> = Dư nợ đầu kỳ × Lãi suất kỳ</p>
            <p>• <strong>Tổng tiền trả kỳ</strong> = Gốc kỳ + Lãi kỳ</p>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              Sai lệch do làm tròn được tự động điều chỉnh vào kỳ trả nợ cuối cùng theo đúng chuẩn nghiệp vụ ngân hàng.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Bảng tính lịch trả nợ với dư nợ giảm dần */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#004b87] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold">Bảng tính lịch trả nợ với dư nợ giảm dần</h3>
                <p className="text-xs text-blue-200">
                  Số tiền vay: {parsedLoanAmount.toLocaleString('vi-VN')} VND • Kỳ hạn: {termMonths} tháng • Lãi suất: {parsedAnnualRate}%/năm
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Table Container */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 shadow-xs">
                  <tr>
                    <th className="py-3 px-3 border-b border-slate-200 text-center">STT</th>
                    <th className="py-3 px-3 border-b border-slate-200">Kỳ trả nợ</th>
                    <th className="py-3 px-3 border-b border-slate-200 text-right">Số gốc còn lại</th>
                    <th className="py-3 px-3 border-b border-slate-200 text-right">Gốc</th>
                    <th className="py-3 px-3 border-b border-slate-200 text-right">Lãi</th>
                    <th className="py-3 px-3 border-b border-slate-200 text-right font-extrabold text-[#004b87]">Tổng Gốc + Lãi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row 0: Disbursed date and initial balance per PDF screenshot */}
                  <tr className="bg-slate-50/50 text-slate-500 font-medium">
                    <td className="py-2.5 px-3 text-center">0</td>
                    <td className="py-2.5 px-3">
                      {disbursementDate.split('-').reverse().join('/')} (Giải ngân)
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-700">
                      {parsedLoanAmount.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                  </tr>

                  {scheduleData.rows.map((row) => (
                    <tr key={row.period} className="hover:bg-blue-50/40 transition">
                      <td className="py-2.5 px-3 text-center font-medium text-slate-600">{row.period}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{row.dateStr}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">{row.startBalance.toLocaleString('vi-VN')}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900">{row.principal.toLocaleString('vi-VN')}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-red-600">{row.interest.toLocaleString('vi-VN')}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#004b87]">{row.totalPayment.toLocaleString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-extrabold text-slate-900 sticky bottom-0 border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={3} className="py-3 px-3 text-center uppercase tracking-wider">
                      TỔNG CỘNG
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-800">
                      {scheduleData.totalPrincipal.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-3 text-right text-red-600">
                      {scheduleData.totalInterest.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-3 text-right text-[#004b87] text-base">
                      {scheduleData.totalPayment.toLocaleString('vi-VN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Bảng tính mang tính chất tham khảo tại thời điểm tra cứu.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In bảng tính</span>
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2 bg-[#004b87] hover:bg-[#003b6b] text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
