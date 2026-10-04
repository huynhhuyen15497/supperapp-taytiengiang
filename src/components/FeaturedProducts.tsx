import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { FeaturedProduct } from '../types';
import { Sparkles, Star, Gift, Phone, X, CheckCircle, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal, Eye } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { featuredProducts, brand } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [interestedProduct, setInterestedProduct] = useState<FeaturedProduct | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Filter items
  const filteredItems = featuredProducts.items.filter(item => {
    if (selectedCategory === 'Tất cả') return true;
    if (selectedCategory === 'Cá nhân') return item.category.includes('Cá nhân');
    if (selectedCategory === 'Hộ kinh doanh') return item.category.includes('Hộ kinh doanh');
    if (selectedCategory === 'Doanh nghiệp') return item.category.includes('Doanh nghiệp');
    if (selectedCategory === 'Ưu đãi') return item.category.includes('Ưu đãi');
    if (selectedCategory === 'Tài sản bảo đảm') return item.category.includes('bảo đảm');
    return item.category === selectedCategory;
  });

  const handleNextCarousel = () => {
    setActiveCarouselIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrevCarousel = () => {
    setActiveCarouselIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold mb-3 uppercase tracking-wider">
          <Star className="w-3.5 h-3.5 fill-red-500 text-red-500" /> Nổi bật tại quầy
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#004b87] tracking-tight">
          {featuredProducts.title}
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          {featuredProducts.description}
        </p>
      </div>

      {/* Filter Chips & View Mode switch */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {featuredProducts.categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveCarouselIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#004b87] text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs self-end sm:self-auto">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              viewMode === 'carousel' ? 'bg-[#004b87] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Dạng Carousel</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              viewMode === 'grid' ? 'bg-[#004b87] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Dạng Lưới</span>
          </button>
        </div>
      </div>

      {/* Display Content: Carousel or Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 text-sm">Không có sản phẩm nào thuộc danh mục này.</p>
        </div>
      ) : viewMode === 'carousel' ? (
        /* Carousel View */
        <div className="relative max-w-3xl mx-auto mb-10">
          {filteredItems[activeCarouselIndex] && (
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl transition-all duration-300">
              {/* Poster Image */}
              <div className="relative bg-slate-100 flex items-center justify-center p-3 sm:p-6 max-h-[520px]">
                <span className="absolute top-4 left-4 z-10 text-xs font-extrabold text-white bg-red-600 px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  {filteredItems[activeCarouselIndex].badge}
                </span>

                <img
                  src={filteredItems[activeCarouselIndex].imageUrl}
                  alt={filteredItems[activeCarouselIndex].title}
                  className="max-h-[460px] w-auto max-w-full object-contain rounded-2xl shadow-sm cursor-zoom-in"
                  onClick={() => setZoomedImage(filteredItems[activeCarouselIndex].imageUrl)}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      const div = document.createElement('div');
                      div.className = 'py-20 text-center text-slate-500 font-semibold';
                      div.innerText = `Poster: ${filteredItems[activeCarouselIndex].title}`;
                      parent.appendChild(div);
                    }
                  }}
                />

                <button
                  onClick={() => setZoomedImage(filteredItems[activeCarouselIndex].imageUrl)}
                  className="absolute bottom-5 right-5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Phóng to</span>
                </button>
              </div>

              {/* Poster Details */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#004b87] bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {filteredItems[activeCarouselIndex].category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeCarouselIndex + 1} / {filteredItems.length}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                  {filteredItems[activeCarouselIndex].title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-2">
                  {filteredItems[activeCarouselIndex].subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                  {filteredItems[activeCarouselIndex].description}
                </p>

                {/* Nút "Tôi quan tâm" as requested in PDF */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setInterestedProduct(filteredItems[activeCarouselIndex])}
                    className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm rounded-2xl shadow-md shadow-red-500/20 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Tôi quan tâm sản phẩm này</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Carousel navigation controls */}
          {filteredItems.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={handlePrevCarousel}
                className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-md transition cursor-pointer"
                aria-label="Poster trước"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-1.5">
                {filteredItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCarouselIndex(i)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      i === activeCarouselIndex ? 'w-8 bg-[#004b87]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Trang ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextCarousel}
                className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-md transition cursor-pointer"
                aria-label="Poster kế tiếp"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative bg-slate-100 p-4 flex items-center justify-center max-h-[360px] overflow-hidden group">
                <span className="absolute top-3 left-3 z-10 text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-md shadow-xs">
                  {item.badge}
                </span>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="max-h-[320px] w-auto object-contain rounded-xl cursor-zoom-in group-hover:scale-102 transition duration-300"
                  onClick={() => setZoomedImage(item.imageUrl)}
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#004b87] bg-blue-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => setInterestedProduct(item)}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Tôi quan tâm
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: "Tôi quan tâm" according to PDF */}
      {interestedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setInterestedProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Tiếp nhận sự quan tâm của Quý khách!
            </h3>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs font-semibold text-[#004b87] mb-4">
              Sản phẩm: {interestedProduct.title}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
              Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              {'\n'}Hoặc liên hệ Chuyên viên tư vấn <strong className="text-slate-900">{brand.consultant.name}</strong> - <strong className="text-red-600">{brand.consultant.displayPhone}</strong>.
            </p>

            <div className="flex gap-2">
              <a
                href={`tel:${brand.consultant.phone}`}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi ngay: {brand.consultant.displayPhone}</span>
              </a>
              <button
                onClick={() => setInterestedProduct(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs cursor-zoom-out animate-in fade-in duration-150"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[92vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl">
            <img src={zoomedImage} alt="Poster to" className="max-h-[88vh] w-auto mx-auto object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
