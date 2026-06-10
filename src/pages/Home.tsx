import { useState, useEffect } from 'react';
// import { createPayment } from '../api/create-payment'; // Removed old lib
import { metaAddToCart, metaInitiateCheckout, metaContact, tiktokAddToCart, tiktokInitiateCheckout, tiktokContact } from '../lib/pixels';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Star, CheckCircle, ArrowRight, Phone, Mail, MapPin,
  Camera, Heart, Award, Users,
  Dumbbell, Flame, Target, ChevronRight, ChevronLeft, Maximize2, ShoppingCart, CreditCard,
  MessageSquare, MessageCircle, Play
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const products = [
  {
    id: 1,
    title: 'تدريب كارديو مستوى مبتدئ',
    description: 'برنامج كارديو للمبتدئين لحرق الدهون وتحسين اللياقة القلبية بتمارين خفيفة ومتدرجة.',
    price: 2500,
    originalPrice: 5000,
    image: '/cardio-images/cardio-1/coach-delhoum-chaima-wourkout.jpeg',
    images: [
      '/cardio-images/cardio-1/coach-delhoum-chaima-wourkout.jpeg',
      '/cardio-images/cardio-1/coach-delhoum-chaima-wourkout-2.jpeg',
      '/cardio-images/cardio-1/coach-delhoum-chaima-wourkout-3.jpeg',
      '/cardio-images/cardio-1/coach-delhoum-chaima-wourkout-4.jpeg'
    ],
    category: 'كارديو',
    features: ['تمارين كارديو أساسية', 'فيديوهات توضيحية'],
    popular: false
  },
  {
    id: 2,
    title: 'تدريب كارديو مستوى متوسط',
    description: 'برنامج كارديو متوسط لرفع مستوى التحمل وتكثيف حرق الدهون بتمارين متقدمة.',
    price: 3000,
    originalPrice: 6500,
    image: '/cardio-images/cardio-2/coach-delhoum-chaima-wourkout-5.jpeg',
    images: [
      '/cardio-images/cardio-2/coach-delhoum-chaima-wourkout-5.jpeg',
      '/cardio-images/cardio-2/coach-delhoum-chaima-wourkout-6.jpeg',
      '/cardio-images/cardio-2/coach-delhoum-chaima-wourkout-7.jpeg',
      '/cardio-images/cardio-2/coach-delhoum-chaima-wourkout-8.jpeg'
    ],
    category: 'كارديو',
    features: ['تمارين HIIT', 'فيديوهات تمارين مكثفة'],
    popular: true
  },
  {
    id: 3,
    title: 'تدريب كارديو مستوى متقدم',
    description: 'برنامج كارديو احترافي للرياضيين المتقدمين مع تمارين عالية الشدة.',
    price: 4000,
    originalPrice: 8000,
    image: '/cardio-images/cardio-3/coach-delhoum-chaima-wourkout-9.jpeg',
    images: [
      '/cardio-images/cardio-3/coach-delhoum-chaima-wourkout-9.jpeg',
      '/cardio-images/cardio-3/coach-delhoum-chaima-wourkout-10.jpeg',
      '/cardio-images/cardio-3/coach-delhoum-chaima-wourkout-11.jpeg',
      '/cardio-images/cardio-3/coach-delhoum-chaima-wourkout-12.jpeg'
    ],
    category: 'كارديو',
    features: ['تمارين عالية الشدة', 'برنامج تحدي 30 يوم'],
    popular: false
  },
  {
    id: 4,
    title: 'تدريب بناء عضلي مستوى مبتدئ',
    description: 'برنامج الأساس المتين لإتقان التكنيك وبناء قاعدة بدنية احترافية للمبتدئين.',
    price: 2500,
    originalPrice: 6000,
    image: '/musculation/تدريب عضلي 1/coach-delhoum-chaima-workout.jpeg',
    images: [
      '/musculation/تدريب عضلي 1/coach-delhoum-chaima-workout.jpeg',
      '/musculation/تدريب عضلي 1/coach-delhoum-chaima-workout-2.jpeg'
    ],
    category: 'بناء عضلي',
    features: ['إتقان التكنيك الصحيح', 'يدعم التنشيف والتضخيم', 'فيديوهات شرح'],
    popular: false
  },
  {
    id: 5,
    title: 'تدريب بناء عضلي مستوى متوسط',
    description: 'برنامج متوسط لزيادة الكتلة العضلية وتحسين القوة مع تمارين مركبة ومتنوعة.',
    price: 3000,
    originalPrice: 7500,
    image: '/musculation/تدريب عضلي 2/coach-delhoum-chaima-workout-3.jpeg',
    images: [
      '/musculation/تدريب عضلي 2/coach-delhoum-chaima-workout-3.jpeg',
      '/musculation/تدريب عضلي 2/coach-delhoum-chaima-workout-4.jpeg'
    ],
    category: 'بناء عضلي',
    features: ['تقنيات التضخيم', 'فيديوهات للتمارين'],
    popular: true
  },
  {
    id: 6,
    title: 'تدريب بناء عضلي مستوى متقدم',
    description: 'برنامج احترافي للرياضيين المتقدمين لتحقيق أقصى نمو عضلي وأداء بدني.',
    price: 4000,
    originalPrice: 10000,
    image: '/musculation/تدريب عضلي 3/coach-delhoum-chaima-workout-5.jpeg',
    images: [
      '/musculation/تدريب عضلي 3/coach-delhoum-chaima-workout-5.jpeg',
      '/musculation/تدريب عضلي 3/coach-delhoum-chaima-workout-6.jpeg',
      '/musculation/تدريب عضلي 3/coach-delhoum-chaima-workout-7.jpeg'
    ],
    category: 'بناء عضلي',
    features: ['برنامج تدريب مكثف', 'ركائز الأداء الاحترافي'],
    popular: false
  }
];

const testimonials = [
  {
    name: 'وسيم طاهي',
    text: 'كانت تدريبات جد ممتازة مع المدربة داخل الصالة وحتى البرامج المنزلية مشكورة جدا.',
    rating: 5,
    avatar: 'وسيم'
  },
  {
    name: 'نجم الدين بالعلمي',
    text: 'تجربة رائعة ونتائج ملموسة في وقت قصير. الاحترافية في التعامل والتمارين.',
    rating: 5,
    avatar: 'نجم'
  },
  {
    name: 'منال . ق',
    text: 'لكل من يريد صحة جيدة تنشيف تضخيم انصح بالمدربة بشدة.',
    rating: 5,
    avatar: 'منال'
  }
];

const stats = [
  { icon: Award, value: '+3', label: 'ختمومات' },
  { icon: Users, value: '+7', label: 'شهادة و سنة خبرة' },
  { icon: Heart, value: '+50', label: 'متدرب راض' },
  { icon: Dumbbell, value: '+12', label: 'تدريب مدربين' }
];

const programDetails = {
  muscleBeginner: {
    title: 'برنامج "الأساس المتين" (المستوى الأول)',
    subtitle: 'دليلك الشامل لإتقان التكنيك وبناء قاعدة بدنية احترافية',
    description: 'هذا المنتج الرقمي مصمم خصيصاً للمبتدئين في دخول عالم الرياضة بأساس علمي صحيح. يجمع البرنامج بين تعليم الأداء الاحترافي وتطوير القوة العضلية، وهو مرن تماماً ليناسب أهداف (التنشيف) أو (التضخيم).',
    goals: [
      'إتقان التكنيك: تعلم الأداء الصحيح للتمارين الأساسية لضمان أقصى استفادة وتجنب الإصابات.',
      'مرونة الهدف: برنامج ذكي يدعم "التنشيف" و "التضخيم" معاً عبر تعديل نطاق التكرارات.',
      'شمولية التدريب: نظام Full Body لتقوية وتفعيل عضلات الجسم كاملة 3 مرات أسبوعياً.'
    ],
    technicalSpecs: [
      'نوع التمارين: قائمة شاملة (Squat, Deadlift, Chest Press, Rows) تستهدف كافة المجموعات العضلية.',
      'الجدول التدريبي: 3 سلاسل لكل تمرين مع أوزان خفيفة إلى متوسطة للتركيز على الجودة.',
      'نظام التكرارات: للتضخيم (بناء العضل): 15-20 تكرار، للتنشيف (حرق الدهون): 20-30 تكرار.',
      'فترات الراحة: 45-60 ثانية لاستعادة النشاط بفعالية.'
    ],
    pillars: [
      'وضعية الظهر السليمة وشد عضلات البطن (Core).',
      'التحكم في سرعة الحركة (Tempo) بطيء لزيادة الضغط العضلي.',
      'تنظيم التنفس الصحيح أثناء المجهود.'
    ]
  },
  cardio: {
    specs: [
      'يتضمن البرنامج تمارين هوائية وتمارين المقاومة بوزن الجسم',
      'التحمية - 5 دقائق | التدريب الأساسي | التهدئة والإطالة - 5 دقائق',
      'الأمان أولاً - مرونة كاملة - بناء عادة، لا مجرد تمرين',
      'ضمان الجودة: الفيديوهات مصممة من طرف المدربة مما يضمن لك فهم كل حركة.'
    ]
  }
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<number[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [checkoutMode, setCheckoutMode] = useState<"cart" | "checkout">("cart");
  const [paymentMode, setPaymentMode] = useState<"CIB" | "EDAHABIA">("CIB");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (id: number) => {
    if (!cart.includes(id)) {
      setCart([...cart, id]);
      const product = products.find(p => p.id === id);
      if (product) {
        metaAddToCart({ content_name: product.title, content_ids: [String(product.id)], value: product.price });
        tiktokAddToCart({ content_id: String(product.id), content_name: product.title, value: product.price });
      }
    }
    setCheckoutMode("cart");
    setShowCart(true);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item !== id));
  };

  const cartItems = products.filter(p => cart.includes(p.id));
  const cartTotal = cartItems.reduce((sum, p) => sum + p.price, 0);

  const handleCheckout = async () => {
    if (!customerName) {
      alert("الرجاء إدخال اسمك الكامل");
      return;
    }
    setIsProcessing(true);
    
    // Auto-set the active program for access after successful payment
    if (cartItems.length > 0) {
      localStorage.setItem('programId', String(cartItems[0].id));
    }

    const productTitles = cartItems.map(item => item.title).join(", ");
    const contentIds = cartItems.map(item => String(item.id));
    metaInitiateCheckout({ content_ids: contentIds, value: cartTotal, num_items: cartItems.length });
    tiktokInitiateCheckout({ content_id: contentIds.join(','), value: cartTotal });
    
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: cartItems[0]?.id || 0,
          product_title: productTitles,
          amount: cartTotal,
          customer_email: "customer@example.com",
          customer_name: customerName,
          mode: paymentMode,
        })
      });

      const data = await response.json();

      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert(data.message || "حدث خطأ");
      }
    } catch (e) {
      alert("خطأ في الاتصال بخادم الدفع");
    } finally {
      setIsProcessing(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cyan font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-purple shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-brand-purple" />
              </div>
              <span className={`text-xl font-bold transition-colors text-white`}>
                Coach Chaima
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {[
                { label: 'الرئيسية', id: 'hero' },
                { label: 'من أنا', id: 'about' },
                { label: 'البرامج', id: 'products' },
                { label: 'آراء المتدربين', id: 'testimonials' },
                { label: 'تواصل معي', id: 'contact' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-white/70 text-white`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => { setCheckoutMode("cart"); setShowCart(!showCart); }}
                className={`relative p-2 rounded-xl transition-colors hover:bg-white/10 text-white`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-brand-purple text-xs rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl ${scrollY > 50 ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t shadow-lg"
            >
              <div className="px-4 py-4 space-y-2">
                {[
                  { label: 'الرئيسية', id: 'hero' },
                  { label: 'من أنا', id: 'about' },
                  { label: 'البرامج', id: 'products' },
                  { label: 'آراء المتدربين', id: 'testimonials' },
                  { label: 'تواصل معي', id: 'contact' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-right px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">◆ سلة المشتريات</h2>
                  <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">السلة فارغة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {checkoutMode === "cart" ? (
                      <>
                        {cartItems.map(item => (
                          <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-orange-100 rounded-xl flex items-center justify-center text-2xl">
                              {item.image}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{item.title}</h3>
                              <p className="text-rose-600 font-bold">{item.price} د.ج</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl self-start"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between text-lg font-bold mb-4">
                            <span>الإجمالي</span>
                            <span className="text-rose-600">{cartTotal} د.ج</span>
                          </div>
                          <button 
                            onClick={() => setCheckoutMode("checkout")}
                            className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            متابعة الدفع
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 mb-4">◆ بيانات الدفع</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                          <input 
                            type="text" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all" 
                            placeholder="اسمك الكامل" 
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع (Chargily)</label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => setPaymentMode("CIB")}
                              className={`p-3 rounded-xl border-2 transition-all ${paymentMode === 'CIB' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                              البطاقة البنكية (CIB)
                            </button>
                            <button
                              onClick={() => setPaymentMode("EDAHABIA")}
                              className={`p-3 rounded-xl border-2 transition-all ${paymentMode === 'EDAHABIA' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                              الذهبية (EDAHABIA)
                            </button>
                          </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between text-lg font-bold mb-4">
                            <span>الإجمالي</span>
                            <span className="text-rose-600">{cartTotal} د.ج</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setCheckoutMode("cart")}
                              className="px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">
                              رجوع
                            </button>
                            <button 
                              onClick={handleCheckout}
                              disabled={isProcessing}
                              className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                              <CreditCard className="w-5 h-5" />
                              {isProcessing ? "جاري التحويل..." : "الدفع الآن"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-cyan" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-purple rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-purple rounded-full blur-[120px]" />
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 w-full pt-0 pb-16">
          <div className="grid lg:grid-cols-2 gap-0 items-center relative">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-right order-2 lg:order-1 px-4 sm:px-6 lg:px-12 pt-20 lg:pt-24 relative z-10"
            >
              {/* Dark overlay behind text on mobile for readability */}
              <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-black/40 via-black/20 to-transparent -z-10" />

              <motion.h1 variants={fadeInUp} className="max-sm:![color:white] text-base sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                ✦ حوّل جسمك وروحك مع Coach Chaima
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-sm:![color:rgba(255,255,255,0.8)] text-lg sm:text-xl mb-10 leading-relaxed font-medium">
                برامج تدريبية مخصصة، خطط غذائية احترافية، ومتابعة يومية لتحقيق أهدافك الصحية والرياضية
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('products')}
                  className="px-8 py-4 bg-brand-purple text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-brand-purple/25 transition-all flex items-center justify-center gap-2"
                >
                  ابدأ رحلتك الآن
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-brand-purple font-bold rounded-2xl hover:bg-white/30 transition-all border border-brand-purple/20"
                >
                  تعرف عليّ أكثر
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 lg:static lg:relative order-1 lg:order-2"
            >
               <div className="relative overflow-hidden h-full">
                 <img src="/hero/coach-delhoum-chaima-front-picture-gym.png" alt="Coach Chaima" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="absolute -top-6 top-10 right-10 w-24 h-24 bg-brand-purple/40 rounded-full blur-xl -z-10" />
               <div className="absolute bottom-10 left-10 w-32 h-32 bg-brand-cyan/40 rounded-full blur-xl -z-10" />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-brand-cyan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple/10 text-brand-purple rounded-full text-sm font-bold mb-6">
                <Heart className="w-4 h-4" />
                من هي المدربة شيماء
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-base sm:text-4xl font-bold mb-6">
                ✦ شيماء، مدربتك الشخصية وشريكتك في النجاح
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-brand-purple font-medium leading-relaxed mb-6">
                شيماء دلهوم مدربة معتمدة في العديد من اختصاصات الرياضة اللياقة البدنية وبناء الجسم، كما انها متخصصة في التغذية الشاملة والطب البديل.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-brand-purple font-medium leading-relaxed mb-8">
                تساعدك على الوصول إلى أهدافك الصحية بطريقة آمنة وفعالة. أنا شيماء، مدربة معتمدة في اللياقة البدنية والتغذية الرياضية مع أكثر من 8 سنوات من الخبرة.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                {['CPT معتمدة', 'أخصائية تغذية', 'مدربة يوغا', 'مدربة CrossFit'].map((badge, i) => (
                  <span key={i} className="px-4 py-2 bg-brand-purple text-white rounded-xl text-sm font-medium border border-white/10">
                    {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-brand-purple/20 rounded-3xl overflow-hidden relative border-2 border-white/20 shadow-2xl group">
                <img src="/coach-delhoum-chaima-miror-picture-in-gym.png" alt="Coach Chaima" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-purple/90 to-transparent">
                  <h3 className="text-xl font-bold text-white whitespace-nowrap">Coach Chaima</h3>
                  <p className="text-brand-cyan mt-1 font-bold">مدربة معتمدة</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-brand-cyan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="bg-brand-purple rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <stat.icon className="w-8 h-8 text-brand-cyan" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-brand-cyan font-bold">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Seals and Certificates Section */}
      <section id="certificates" className="py-24 bg-brand-cyan relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple/10 text-brand-purple rounded-full text-sm font-bold mb-6">
              <Award className="w-4 h-4" />
              الشهادات والختمات الرسمية
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-4xl font-bold mb-6 whitespace-nowrap">
              ✦ الاعتمادات الرسمية
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-brand-purple font-medium max-w-4xl mx-auto leading-relaxed">
              تفتخر شيماء دلهوم بحيازتها لعدة شهادات وختمات رسمية تؤكد خبرتها ومهارتها في مجالات الرياضة، البناء العضلي، الكارديو، اللياقة البدنية، بناء الجسم، التغذية الصحية، والطب البديل. كل ختم وشهادة تمثل التزامها بتقديم برامج تدريبية موثوقة وعالية الجودة، لضمان تحقيق أفضل النتائج لعملائها.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { title: "ختم TOT للطب البديل", label: "دلهوم شيماء - مدربة مدربين TOT اختصاص الطب البديل", image: "/cachet/chaima-delhoum-tot-alternative-medicine.jpeg" },
              { title: "ختم استشارة التغذية الشاملة", label: "السيدة: دلهوم شيماء - مستشارة في التغذية الشاملة", image: "/cachet/chaima-delhoum-nutrition-consultant-stamp.jpeg" },
              { title: "ختم مدربة في اللياقة البدنية، بناء الجسم، والتغذية", label: "Delhoum Chaima - Trainer and trainer trainer in aerobic fitness, bodybuilding and nutrition", image: "/cachet/chaima-delhoum-fitness-trainer.jpeg" }
            ].map((seal, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white rounded-3xl p-6 shadow-xl shadow-brand-purple/5 border border-brand-purple/10 text-center group"
              >
                <div className="aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden relative">
                  <img
                    src={seal.image}
                    alt={seal.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-brand-purple mb-2">{seal.title}</h3>
                <p className="text-brand-purple/60 text-xs">{seal.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeInUp}
            className="bg-brand-purple rounded-[40px] p-8 md:p-12 text-center text-white"
          >
            <h3 className="text-lg sm:text-2xl font-bold mb-8 whitespace-nowrap">✦ الشهادات</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { src: "/certification/international-referee-training-delhoum-chaima-rotated.jpg", label: "Certification de international referee training" },
                { src: "/certification/aerobic-fitness-bodybuilding-delhoum-chaima-rotated.jpg", label: "Aerobic fitness & bodybuilding" },
                { src: "/certification/nutrition-advisor-delhoum-chaima-rotated.jpg", label: "Nutrition advisor" },
                { src: "/certification/nutrition-level-01-delhoum-chaima-rotated.jpg", label: "Nutrition Level 01" },
                { src: "/certification/nutrition-level-01-2-delhoum-chaima-rotated.jpg", label: "Nutrition Level 01 (2)" },
                { src: "/certification/nutrition-level-01-delhoum-chaima-2-rotated.jpg", label: "Nutrition Level 01 (3)" },
                { src: "/certification/nutrition-level-01-delhoum-chaima-4-rotated.jpg", label: "Nutrition Level 01 (4)" },
                { src: "/certification/Certification-de-nutrition-level-01-delhoum-chaima-3.jpeg", label: "Certification de nutrition Level 01" },
                { src: "/certification/first-aid-croissant-rouge-algerien-delhoum-chaima.jpg.jpeg", label: "First Aid - Croissant Rouge Algérien" },
              ].map((cert, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-white/10 rounded-2xl overflow-hidden border-2 border-white/20 hover:border-white/50 transition-all duration-300">
                    <img
                      src={cert.src}
                      alt={cert.label}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="mt-3 text-white/80 font-medium text-sm">{cert.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-brand-cyan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-right mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple/10 text-brand-purple rounded-full text-sm font-bold mb-6">
              <Target className="w-4 h-4" />
              البرامج المخصصة
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-4xl font-bold mb-4 whitespace-nowrap">
              ✦ البرامج المخصصة
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-brand-purple font-medium max-w-2xl">
              برامج تدريب شخصية في الكارديو، القوة العضلية، اللياقة البدنية، بناء الجسم، والتغذية الصحية. برامج مصممة للأفراد والمجموعات.
            </motion.p>
          </motion.div>



          {/* Cardio Programs */}
          <div className="mb-8">
            <h3 className="text-lg sm:text-2xl font-bold mb-6 whitespace-nowrap">◆ برامج الكارديو</h3>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {products.filter(p => p.category === 'كارديو').map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                className={`relative bg-brand-purple rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border-2 ${product.popular ? 'border-brand-cyan' : 'border-transparent'}`}
              >
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-cyan text-brand-purple text-xs font-bold rounded-full">
                    الأكثر طلباً
                  </div>
                )}
                {product.images ? (
                  <div className="mb-6">
                    <div 
                      className="w-full aspect-[4/3] bg-white/10 rounded-2xl overflow-hidden mb-3 cursor-pointer group"
                      onClick={() => openLightbox(product.images as string[], 0)}
                    >
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-black/60 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-between">
                      {product.images.slice(1, 4).map((img, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => openLightbox(product.images as string[], idx + 1)}
                          className="w-1/3 aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-brand-cyan transition-colors"
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-4 overflow-hidden">
                    {product.image.startsWith('/') ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      product.image
                    )}
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mb-2">{product.title}</h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">{product.description}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-brand-cyan">{product.price}</span>
                  <span className="text-sm text-white/40 line-through">{product.originalPrice}</span>
                  <span className="text-sm text-white/60">د.ج</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => addToCart(product.id)}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    cart.includes(product.id)
                      ? 'bg-brand-cyan text-brand-purple'
                      : 'bg-white text-brand-purple hover:bg-brand-cyan hover:text-brand-purple'
                  }`}
                >
                  {cart.includes(product.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      تمت الإضافة
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      أضف إلى السلة
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Muscle Building Programs */}
          <div className="mb-8">
            <h3 className="text-lg sm:text-2xl font-bold mb-6 whitespace-nowrap">◆ برامج البناء العضلي</h3>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.filter(p => p.category === 'بناء عضلي').map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                className={`relative bg-brand-purple rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border-2 ${product.popular ? 'border-brand-cyan' : 'border-transparent'}`}
              >
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-cyan text-brand-purple text-xs font-bold rounded-full">
                    الأكثر طلباً
                  </div>
                )}
                {product.images ? (
                  <div className="mb-6">
                    <div 
                      className="w-full aspect-[4/3] bg-white/10 rounded-2xl overflow-hidden mb-3 cursor-pointer group"
                      onClick={() => openLightbox(product.images as string[], 0)}
                    >
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-black/60 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-between">
                      {product.images.slice(1, 4).map((img, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => openLightbox(product.images as string[], idx + 1)}
                          className="w-1/3 aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-brand-cyan transition-colors"
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-4 overflow-hidden">
                    {product.image.startsWith('/') ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      product.image
                    )}
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mb-2">{product.title}</h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">{product.description}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-brand-cyan">{product.price}</span>
                  <span className="text-sm text-white/40 line-through">{product.originalPrice}</span>
                  <span className="text-sm text-white/60">د.ج</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => addToCart(product.id)}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    cart.includes(product.id)
                      ? 'bg-brand-cyan text-brand-purple'
                      : 'bg-white text-brand-purple hover:bg-brand-cyan hover:text-brand-purple'
                  }`}
                >
                  {cart.includes(product.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      تمت الإضافة
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      أضف إلى السلة
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-brand-cyan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-4xl font-bold mb-6 whitespace-nowrap">
              ✦ آراء عملائنا الكرام
            </motion.h2>
            <motion.div 
              variants={fadeInUp}
              className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl border-2 border-brand-purple/20 max-w-3xl mx-auto"
            >
              <p className="text-brand-purple font-medium text-lg leading-relaxed">
                بخصوص نتائج المتدربين والارقام (قبل/بعد) فمن باب الأمانة والخصوصية لا نشاركها للعلن، نحترم خصوصية كل مشترك تماماً.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-brand-purple text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <MessageSquare className="w-24 h-24" />
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-brand-cyan fill-current" />
                  ))}
                </div>
                <p className="text-white font-medium leading-relaxed mb-6 text-lg relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-brand-cyan">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-white/40">متدرب راضٍ</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA & Contact Section */}
      <section id="contact" className="py-24 bg-brand-purple relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#28E8FF_0%,transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-2xl sm:text-5xl font-bold mb-8 leading-tight">
                ✦ تخلص من حيرة البداية <br />
                ودعنا نصمم لك مسارك الخاص
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-white/80 mb-10 leading-relaxed">
                نحو جسم رياضي وصحة أفضل. تواصل معي الآن واطلب استشارتك المجانية لبرنامجك المخصص.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/213600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { metaContact(); tiktokContact(); }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-brand-cyan text-brand-purple rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-brand-cyan/20"
                >
                  <MessageCircle className="w-6 h-6" />
                  تواصل معي مباشرة عبر واتساب
                </a>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-12 grid grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Mail className="w-6 h-6 text-brand-cyan mb-2" />
                  <div className="text-sm text-white/40 mb-1">البريد الإلكتروني</div>
                  <div className="font-bold text-white text-sm truncate">contact@coachchaima.site</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <MapPin className="w-6 h-6 text-brand-cyan mb-2" />
                  <div className="text-sm text-white/40 mb-1">الموقع</div>
                  <div className="font-bold text-white text-sm">أونلاين عالمياً</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10"
            >
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-6 whitespace-nowrap">◆ أو أرسل رسالة سريعة</h3>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-white mb-2 font-medium">الاسم الكامل</label>
                  <input type="text" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors" placeholder="اسمك الكريم" />
                </div>
                <div>
                  <label className="block text-white mb-2 font-medium">البريد الإلكتروني</label>
                  <input type="email" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-white mb-2 font-medium">رقم الهاتف</label>
                  <input type="tel" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors" placeholder="0555 XXX XXX" dir="ltr" />
                </div>
                <div>
                  <label className="block text-white mb-2 font-medium">الرسالة</label>
                  <textarea rows={4} className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors resize-none" placeholder="كيف يمكنني مساعدتك؟"></textarea>
                </div>
                <button className="w-full py-4 bg-white text-brand-purple rounded-xl font-bold hover:bg-brand-cyan transition-colors shadow-lg">
                  إرسال الاستشارة
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-purple text-white py-16 text-center border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Quick Links */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-6 whitespace-nowrap">◆ Quick Links</h4>
              <ul className="space-y-4">
                <li><button onClick={() => scrollToSection('hero')} className="text-brand-cyan hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('products')} className="text-brand-cyan hover:text-white transition-colors">Programs</button></li>
                <li><button onClick={() => scrollToSection('products')} className="text-brand-cyan hover:text-white transition-colors">Shop</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-brand-cyan hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-brand-cyan hover:text-white transition-colors">Contact Us</button></li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-6 whitespace-nowrap">◆ Contact Information</h4>
              <div className="space-y-8">
                <div className="flex flex-col items-center gap-2">
                  <Phone className="w-6 h-6 text-brand-cyan opacity-60" />
                  <a href="tel:0555997365" className="text-brand-cyan font-bold text-lg">0555997365</a>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Mail className="w-6 h-6 text-brand-cyan opacity-60" />
                  <a href="mailto:zakhhroufa1996@gmail.com" className="text-brand-cyan font-bold text-lg">zakhhroufa1996@gmail.com</a>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-cyan font-bold">Instagram</span>
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright & Credit */}
            <div className="pt-8 space-y-4">
              <p className="text-white font-medium">Copyright Coach Chaima ©</p>
              <p className="text-brand-cyan text-sm font-bold">
                Powered by | <span className="hover:underline cursor-pointer">NE Developpement</span>
              </p>
            </div>
          </div>
        </div>

        {/* Back to top button - usually floating but can be added here as per screenshot context */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 left-8 w-12 h-12 bg-black text-white flex items-center justify-center rounded-sm shadow-xl z-50 hover:bg-gray-900 transition-colors"
        >
          <ChevronRight className="w-6 h-6 -rotate-90" />
        </button>
      </footer>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && lightboxImages.length > 0 && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm" dir="ltr">
            <button 
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <button 
                onClick={prevLightboxImage}
                className="absolute left-4 sm:left-8 text-white/50 hover:text-white bg-black/50 p-3 rounded-full transition-colors z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20 }}
                src={lightboxImages[lightboxIndex]}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                alt="Workout Preview"
              />

              <button 
                onClick={nextLightboxImage}
                className="absolute right-4 sm:right-8 text-white/50 hover:text-white bg-black/50 p-3 rounded-full transition-colors z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {lightboxImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === lightboxIndex ? "bg-brand-cyan w-6" : "bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
