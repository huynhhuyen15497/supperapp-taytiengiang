import React, { useState, useEffect, useRef } from 'react';
import { TabType, VoucherItem } from './types';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { CustomerSupport } from './components/CustomerSupport';
import { IpayDownload } from './components/IpayDownload';
import { GameZone } from './components/GameZone';
import { SavingsCalculator } from './components/SavingsCalculator';
import { LoanCalculator } from './components/LoanCalculator';
import { FeaturedProducts } from './components/FeaturedProducts';
import { BranchNetwork } from './components/BranchNetwork';
import { ConsultantModal } from './components/ConsultantModal';
import { VoucherHistoryModal } from './components/VoucherHistoryModal';
import { Footer } from './components/Footer';
import gsap from 'gsap';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isConsultantModalOpen, setIsConsultantModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [vouchers, setVouchers] = useState<VoucherItem[]>(() => {
    try {
      const stored = localStorage.getItem('vb_saved_vouchers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // Animate tab transitions smoothly with GSAP
  useEffect(() => {
    if (mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
    // Scroll to top on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleSaveVoucher = (newVoucher: VoucherItem) => {
    setVouchers((prev) => {
      const updated = [newVoucher, ...prev];
      localStorage.setItem('vb_saved_vouchers', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearVouchers = () => {
    setVouchers([]);
    localStorage.removeItem('vb_saved_vouchers');
    localStorage.removeItem('vb_flappy_latest_voucher');
    localStorage.removeItem('vb_snake_latest_voucher');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedVouchersCount={vouchers.length}
        onOpenVouchers={() => setIsVoucherModalOpen(true)}
        onOpenConsultant={() => setIsConsultantModalOpen(true)}
      />

      {/* Main Content Area */}
      <main ref={mainContentRef} className="flex-1">
        {currentTab === 'home' && (
          <HomeDashboard
            onSelectTab={setCurrentTab}
            onOpenConsultant={() => setIsConsultantModalOpen(true)}
          />
        )}

        {currentTab === 'support' && (
          <CustomerSupport
            onBackToHome={() => setCurrentTab('home')}
            onOpenConsultant={() => setIsConsultantModalOpen(true)}
          />
        )}

        {currentTab === 'app-download' && <IpayDownload />}

        {currentTab === 'game-zone' && (
          <GameZone
            onSaveVoucher={handleSaveVoucher}
            vouchers={vouchers}
          />
        )}

        {currentTab === 'savings-calc' && <SavingsCalculator />}

        {currentTab === 'loan-calc' && <LoanCalculator />}

        {currentTab === 'featured-products' && <FeaturedProducts />}

        {currentTab === 'branches' && <BranchNetwork />}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onOpenConsultant={() => setIsConsultantModalOpen(true)}
      />

      {/* Modals */}
      <ConsultantModal
        isOpen={isConsultantModalOpen}
        onClose={() => setIsConsultantModalOpen(false)}
      />

      <VoucherHistoryModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        vouchers={vouchers}
        onClear={handleClearVouchers}
      />
    </div>
  );
}
