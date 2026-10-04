import React, { useEffect, useState } from 'react';
import contentData from '../data/contentData.json';
import QRCode from 'qrcode';
import { Apple, Smartphone, CheckCircle, ExternalLink, QrCode, Shield, Zap, Gift, RefreshCw } from 'lucide-react';

export const IpayDownload: React.FC = () => {
  const { appDownload } = contentData;
  const [iosQr, setIosQr] = useState<string>('');
  const [androidQr, setAndroidQr] = useState<string>('');

  useEffect(() => {
    // Generate QR codes for iOS and Android
    QRCode.toDataURL(appDownload.ios.url, {
      width: 260,
      margin: 2,
      color: {
        dark: '#004b87',
        light: '#ffffff',
      },
    }).then(setIosQr).catch(console.error);

    QRCode.toDataURL(appDownload.android.url, {
      width: 260,
      margin: 2,
      color: {
        dark: '#004b87',
        light: '#ffffff',
      },
    }).then(setAndroidQr).catch(console.error);
  }, [appDownload.ios.url, appDownload.android.url]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004b87] text-xs font-bold mb-3 uppercase tracking-wider">
          <QrCode className="w-3.5 h-3.5" /> Quét mã tải nhanh
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#004b87] tracking-tight">
          {appDownload.title}
        </h1>
        <p className="mt-2 text-base text-slate-600">
          {appDownload.subtitle}
        </p>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {appDownload.description}
        </p>
      </div>

      {/* 2 Download Cards with QR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-xl -mr-6 -mt-6 group-hover:bg-blue-100 transition" />
          
          <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-4 shadow-md">
            <Apple className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
            Dành cho iPhone / iPad
          </span>

          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {appDownload.ios.name}
          </h3>
          <p className="text-xs text-slate-500 mb-6 font-medium">
            {appDownload.ios.rating}
          </p>

          {/* QR Code Container */}
          <div className="p-3 bg-white border-2 border-dashed border-slate-300 rounded-2xl shadow-inner mb-6 relative">
            {iosQr ? (
              <img src={iosQr} alt="QR Code iOS" className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl" />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-50 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-[#004b87]" />
              </div>
            )}
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#004b87] text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
              Quét bằng Camera
            </span>
          </div>

          <a
            href={appDownload.ios.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 bg-black hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
          >
            <Apple className="w-5 h-5" />
            <span>Tải trên App Store</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </a>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-xl -mr-6 -mt-6 group-hover:bg-emerald-100 transition" />
          
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md">
            <Smartphone className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            Samsung, Oppo, Xiaomi, Vivo...
          </span>

          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {appDownload.android.name}
          </h3>
          <p className="text-xs text-slate-500 mb-6 font-medium">
            {appDownload.android.rating}
          </p>

          {/* QR Code Container */}
          <div className="p-3 bg-white border-2 border-dashed border-slate-300 rounded-2xl shadow-inner mb-6 relative">
            {androidQr ? (
              <img src={androidQr} alt="QR Code Android" className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl" />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-50 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-[#004b87]" />
              </div>
            )}
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
              Quét bằng Camera
            </span>
          </div>

          <a
            href={appDownload.android.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 bg-[#004b87] hover:bg-[#003b6b] text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
          >
            <Smartphone className="w-5 h-5" />
            <span>Tải trên Google Play</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </a>
        </div>
      </div>

      {/* Highlights & Security assurance */}
      <div className="bg-gradient-to-br from-blue-900 to-[#004b87] text-white rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-blue-400/30">
          <div>
            <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4" /> Hệ sinh thái tiện ích số 1
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Vì sao nên cài đặt VietinBank iPay Mobile ngay tại quầy?
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-xs">
            <Shield className="w-4 h-4 text-emerald-300" />
            <span>Bảo mật kép Sinh trắc học theo QĐ 2345/NHNN</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appDownload.highlights.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl backdrop-blur-xs">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-blue-50 leading-snug font-medium">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
