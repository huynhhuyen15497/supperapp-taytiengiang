import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { SupportTopic, SupportStep } from '../types';
import { 
  KeyRound, 
  CreditCard, 
  ScanFace, 
  Receipt, 
  CalendarClock, 
  Youtube, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  RotateCcw, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface CustomerSupportProps {
  onBackToHome: () => void;
  onOpenConsultant: () => void;
}

export const CustomerSupport: React.FC<CustomerSupportProps> = ({
  onBackToHome,
  onOpenConsultant,
}) => {
  const { supportData } = contentData;
  const [selectedTopic, setSelectedTopic] = useState<SupportTopic | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'positive' | 'negative' | 'ended'>('idle');
  const [imageZoomUrl, setImageZoomUrl] = useState<string | null>(null);

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'forgot-password':
        return <KeyRound className="w-6 h-6 text-blue-600" />;
      case 'close-card':
        return <CreditCard className="w-6 h-6 text-red-600" />;
      case 'biometric-cccd':
        return <ScanFace className="w-6 h-6 text-emerald-600" />;
      case 'e-tax':
        return <Receipt className="w-6 h-6 text-amber-600" />;
      case 'appointment-booking':
        return <CalendarClock className="w-6 h-6 text-indigo-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-[#004b87]" />;
    }
  };

  const handleSelectTopic = (topic: SupportTopic) => {
    setSelectedTopic(topic);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  const handleResetToMenu = () => {
    setSelectedTopic(null);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  const handleEndConversation = () => {
    setFeedbackStatus('ended');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* If conversation ended */}
      {feedbackStatus === 'ended' ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-slate-100 max-w-xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Cảm ơn Quý khách!
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
            {supportData.endConversation}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleResetToMenu}
              className="px-6 py-3 bg-[#004b87] hover:bg-[#003b6b] text-white font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              Chọn chủ đề hỗ trợ khác
            </button>
            <button
              onClick={onBackToHome}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
            >
              Về màn hình chính
            </button>
          </div>
        </div>
      ) : !selectedTopic ? (
        /* Topic selection screen */
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Trung tâm hỗ trợ quầy VietinBank
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#004b87] tracking-tight">
              {supportData.question}
            </h1>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Chọn chủ đề bên dưới để xem hướng dẫn chi tiết từng bước có hình ảnh minh họa và video hướng dẫn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {supportData.topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic as SupportTopic)}
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                      {getTopicIcon(topic.id)}
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {topic.steps.length} bước
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004b87] transition-colors mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {topic.shortDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004b87]">
                  <span className="flex items-center gap-1 group-hover:underline">
                    Xem hướng dẫn chi tiết <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  {topic.videoUrl && (
                    <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      <Youtube className="w-3.5 h-3.5" /> Có Video
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#004b87] text-white flex items-center justify-center font-bold shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Cần nhân viên hỗ trợ trực tiếp tại quầy?</h4>
                <p className="text-xs text-slate-600">Giao dịch viên và Chuyên viên tư vấn luôn sẵn sàng trợ giúp Quý khách</p>
              </div>
            </div>
            <button
              onClick={onOpenConsultant}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition whitespace-nowrap"
            >
              Liên hệ CSKH tại quầy
            </button>
          </div>
        </div>
      ) : (
        /* Detailed Step Viewer */
        <div>
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <button
              onClick={handleResetToMenu}
              className="flex items-center gap-2 text-sm font-bold text-[#004b87] hover:text-blue-800 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách câu hỏi</span>
            </button>

            {selectedTopic.videoUrl && (
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg border border-red-200 transition"
              >
                <Youtube className="w-4 h-4" />
                <span>Xem trên YouTube</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>

          {/* Topic header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-50 shrink-0">
                {getTopicIcon(selectedTopic.id)}
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Hướng dẫn chi tiết
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {selectedTopic.title}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedTopic.shortDesc}
                </p>
              </div>
            </div>

            {/* Stepper progress indicator */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Bước {currentStepIndex + 1} trên {selectedTopic.steps.length}</span>
                <span>{Math.round(((currentStepIndex + 1) / selectedTopic.steps.length) * 100)}% hoàn thành</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#004b87] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStepIndex + 1) / selectedTopic.steps.length) * 100}%` }}
                />
              </div>

              {/* Step pills for quick jump */}
              <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
                {selectedTopic.steps.map((st, idx) => (
                  <button
                    key={st.stepNumber}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`h-7 px-2.5 rounded-md text-xs font-semibold shrink-0 transition ${
                      idx === currentStepIndex
                        ? 'bg-[#004b87] text-white'
                        : idx < currentStepIndex
                        ? 'bg-blue-100 text-[#004b87]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Bước {st.stepNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Step Card */}
          {selectedTopic.steps[currentStepIndex] && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden mb-6">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-[#004b87] text-white flex items-center justify-center font-bold text-sm">
                    {selectedTopic.steps[currentStepIndex].stepNumber}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedTopic.steps[currentStepIndex].title}
                  </h3>
                </div>

                <p className="text-slate-700 text-base leading-relaxed mb-6 font-medium whitespace-pre-line bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  {selectedTopic.steps[currentStepIndex].content}
                </p>

                {/* Step Image */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-2 sm:p-4 max-h-[500px]">
                  <img
                    src={selectedTopic.steps[currentStepIndex].imageUrl}
                    alt={`Bước ${selectedTopic.steps[currentStepIndex].stepNumber}: ${selectedTopic.steps[currentStepIndex].title}`}
                    className="max-h-[460px] w-auto max-w-full object-contain rounded-xl shadow-xs cursor-zoom-in hover:opacity-95 transition"
                    onClick={() => setImageZoomUrl(selectedTopic.steps[currentStepIndex].imageUrl)}
                    onError={(e) => {
                      // Fallback placeholder if image load fails
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        const fallbackText = document.createElement('div');
                        fallbackText.className = 'py-12 px-6 text-center text-slate-500 text-sm';
                        fallbackText.innerHTML = `<p class="font-semibold text-slate-700 mb-1">Hình ảnh minh họa cho Bước ${selectedTopic.steps[currentStepIndex].stepNumber}</p><p class="text-xs text-slate-400">Quý khách thực hiện thao tác theo chỉ dẫn trên ứng dụng VietinBank iPay</p>`;
                        parent.appendChild(fallbackText);
                      }
                    }}
                  />
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-md font-medium pointer-events-none">
                    Nhấn vào ảnh để xem to
                  </div>
                </div>

                {/* Prev / Next controls */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <button
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Bước trước</span>
                  </button>

                  {currentStepIndex < selectedTopic.steps.length - 1 ? (
                    <button
                      onClick={() => setCurrentStepIndex(prev => prev + 1)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#004b87] hover:bg-[#003b6b] text-white font-bold text-sm shadow-md transition cursor-pointer"
                    >
                      <span>Bước tiếp theo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Bước cuối cùng
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* YouTube Video link at the bottom of the content as requested */}
          {selectedTopic.videoUrl && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Youtube className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Xem video hướng dẫn trực quan trên YouTube</h4>
                  <p className="text-xs text-slate-600">Video chính thức minh họa từng thao tác thực tế</p>
                </div>
              </div>
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2 whitespace-nowrap"
              >
                <Youtube className="w-4 h-4" />
                <span>Mở Video YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Feedback & Actions section - strictly according to specification */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-base mb-2">
              Khách hàng thực hiện ổn hay chưa?
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Vui lòng cho chúng tôi biết kết quả để nhân viên có thể kịp thời hỗ trợ Quý khách
            </p>

            {feedbackStatus === 'idle' && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setFeedbackStatus('positive')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã ổn</span>
                </button>

                <button
                  onClick={() => setFeedbackStatus('negative')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Chưa ổn</span>
                </button>

                <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

                <button
                  onClick={handleResetToMenu}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Quay lại menu chính</span>
                </button>

                <button
                  onClick={handleEndConversation}
                  className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Kết thúc cuộc trò chuyện</span>
                </button>
              </div>
            )}

            {feedbackStatus === 'positive' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{supportData.feedbackPositive}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={handleResetToMenu}
                    className="px-4 py-2 bg-[#004b87] hover:bg-[#003b6b] text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Quay lại menu chính
                  </button>
                  <button
                    onClick={handleEndConversation}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {feedbackStatus === 'negative' && (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-amber-900 text-sm mb-1">
                      Thông tin hỗ trợ trực tiếp
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3">
                      {supportData.feedbackNegative}
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <a
                        href={`tel:${contentData.brand.consultant.phone}`}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi {contentData.brand.consultant.name}: {contentData.brand.consultant.displayPhone}</span>
                      </a>
                      <button
                        onClick={handleResetToMenu}
                        className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-lg transition cursor-pointer"
                      >
                        Quay lại menu chính
                      </button>
                      <button
                        onClick={handleEndConversation}
                        className="px-3.5 py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs transition cursor-pointer"
                      >
                        Kết thúc cuộc trò chuyện
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Modal Preview */}
      {imageZoomUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-zoom-out animate-in fade-in duration-150"
          onClick={() => setImageZoomUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl">
            <img 
              src={imageZoomUrl} 
              alt="Ảnh phóng to" 
              className="max-h-[85vh] w-auto mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
