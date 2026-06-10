import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ShoppingBag, Mail, Play } from 'lucide-react';
import { metaPurchase, tiktokCompletePayment } from '../lib/pixels';

export default function Success() {
  useEffect(() => {
    metaPurchase({ content_ids: ['order'], value: 0, num_items: 1 });
    tiktokCompletePayment({ content_id: 'order', value: 0 });
    localStorage.setItem('programAccess', 'true');
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-brand-purple rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-cyan rounded-full blur-[120px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full blur-[150px] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              تم الدفع بنجاح!
            </h1>
            <p className="text-gray-300 leading-relaxed mb-2">
              شكراً لثقتك بـ Coach Chaima
            </p>
            <p className="text-gray-400 text-sm mb-8">
              تم استلام طلبك — يمكنك الوصول إلى البرنامج الآن مباشرة
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-brand-cyan" />
              <span className="text-white font-medium">تفاصيل الطلب</span>
            </div>
            <div className="space-y-3 text-right">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">رقم الطلب:</span>
                <span className="text-white font-medium">ORD-2025-001</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">تاريخ الطلب:</span>
                <span className="text-white font-medium">{new Date().toLocaleDateString('ar-MA')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">حالة الطلب:</span>
                <span className="text-green-400 font-medium">مكتمل</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/program"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              فتح البرنامج الآن
            </Link>
            <Link
              to="/"
              className="flex-1 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
