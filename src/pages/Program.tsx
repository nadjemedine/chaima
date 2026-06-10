import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Unlock, Play, CheckCircle, ArrowRight, Dumbbell, Flame, Target,
  Award, Clock, Heart, ChevronDown, ChevronUp, Home, Video, Copy
} from 'lucide-react';

const ACCESS_PASSWORD = 'coach2025';
const STORAGE_KEY = 'programAccess';

const programContent = [
  {
    id: 'week1',
    title: 'الأسبوع الأول – التأسيس',
    icon: Target,
    lessons: [
      { title: 'تقديم البرنامج والأهداف', duration: '5 دقائق', type: 'video' },
      { title: 'الإحماء الصحيح قبل التمرين', duration: '8 دقائق', type: 'video' },
      { title: 'تمارين اليوم الأول – Full Body', duration: '35 دقيقة', type: 'video' },
      { title: 'تمارين اليوم الثاني – Cardio خفيف', duration: '20 دقيقة', type: 'video' },
      { title: 'تمارين اليوم الثالث – Full Body', duration: '35 دقيقة', type: 'video' },
    ]
  },
  {
    id: 'week2',
    title: 'الأسبوع الثاني – البناء',
    icon: Dumbbell,
    lessons: [
      { title: 'تمارين مركبة متقدمة', duration: '40 دقيقة', type: 'video' },
      { title: 'تمارين عزل وتضخيم', duration: '30 دقيقة', type: 'video' },
      { title: 'كارديو متوسط الشدة', duration: '25 دقيقة', type: 'video' },
      { title: 'تمارين القوة والتحمل', duration: '40 دقيقة', type: 'video' },
      { title: 'جلسة إطالة واستشفاء', duration: '20 دقيقة', type: 'video' },
    ]
  },
  {
    id: 'week3',
    title: 'الأسبوع الثالث – التكثيف',
    icon: Flame,
    lessons: [
      { title: 'تمارين HIIT عالية الشدة', duration: '30 دقيقة', type: 'video' },
      { title: 'تمارين متقدمة Full Body', duration: '45 دقيقة', type: 'video' },
      { title: 'كارديو مكثف لحرق الدهون', duration: '30 دقيقة', type: 'video' },
      { title: 'تمارين القوة القصوى', duration: '45 دقيقة', type: 'video' },
      { title: 'جلسة يوغا واسترخاء', duration: '25 دقيقة', type: 'video' },
    ]
  },
  {
    id: 'week4',
    title: 'الأسبوع الرابع – التقييم والتطوير',
    icon: Award,
    lessons: [
      { title: 'تقييم التقدم والقياسات', duration: '10 دقائق', type: 'video' },
      { title: 'تمارين متقدمة مكثفة', duration: '50 دقيقة', type: 'video' },
      { title: 'كارديو تحدي 30 دقيقة', duration: '30 دقيقة', type: 'video' },
      { title: 'تمارين ختامية – Best Of', duration: '45 دقيقة', type: 'video' },
      { title: 'خطة الاستمرارية بعد البرنامج', duration: '15 دقيقة', type: 'video' },
    ]
  }
];

const nutritionTips = [
  { icon: Heart, title: 'البروتين اليومي', desc: 'تناول 1.6 إلى 2.2 غرام بروتين لكل كيلوغرام من وزن الجسم.' },
  { icon: Clock, title: 'توقيت الوجبات', desc: 'وجبة كل 3-4 ساعات للحفاظ على مستوى الطاقة والبناء العضلي.' },
  { icon: Flame, title: 'السعرات الحرارية', desc: 'عجز 300-500 سعرة يومياً للتنشيف، فائض 300-500 للتضخيم.' },
  { icon: Award, title: 'الماء', desc: 'شرب 2-3 لتر ماء يومياً لدعم الأداء والاستشفاء العضلي.' },
];

export default function Program() {
  const [hasAccess, setHasAccess] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openWeek, setOpenWeek] = useState<string | null>('week1');
  const [copied, setCopied] = useState(false);
  const [programId, setProgramId] = useState<string | null>(null);

  // Program links mapping
  const driveLinks: Record<string, string> = {
    '1': 'https://drive.google.com/drive/folders/1SltnNG2Os6PZUZFT7zTL51rN41gywefE?usp=drive_link',
    '2': 'https://drive.google.com/drive/folders/102HJTpDm_qvBhOHgo5JGFvSUsbG7P2Va?usp=drive_link',
    '3': 'https://drive.google.com/drive/folders/1trcgvKwX2DPlZo-Iwih0SbbQtQGr4JKX?usp=drive_link',
    '4': 'https://drive.google.com/drive/folders/1mAy81BnVHeStzpSd1P675xReylbOpeyY?usp=drive_link',
    '5': 'https://drive.google.com/drive/folders/162TtqoiUqs_oYdWtXxUN67PTIQ2W09Rl?usp=drive_link',
    '6': 'https://drive.google.com/drive/folders/1n0ZEOD1pXxPDWUdD_DR19qaQKHb-a99E?usp=drive_link',
  };

  const currentDriveLink = programId ? driveLinks[programId] : undefined;

  const handleCopy = () => {
    if (currentDriveLink) {
      navigator.clipboard.writeText(currentDriveLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') setHasAccess(true);
    setProgramId(localStorage.getItem('programId'));
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === ACCESS_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setHasAccess(true);
      setError('');
    } else {
      setError('كلمة السر غير صحيحة');
    }
  };

  const toggleWeek = (id: string) => {
    setOpenWeek(openWeek === id ? null : id);
  };

  // Access gate
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4" dir="rtl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-brand-purple rounded-full blur-[120px] opacity-20" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-cyan rounded-full blur-[120px] opacity-20" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="w-20 h-20 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-3">الوصول إلى البرنامج</h1>
            <p className="text-gray-400 text-sm mb-8">
              أدخل كلمة السر للوصول إلى محتوى البرنامج التدريبي
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="كلمة السر"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-brand-cyan transition-colors"
                />
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-5 h-5" />
                فتح البرنامج
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-500 text-xs mb-3">ليس لديك كلمة السر؟</p>
              <Link
                to="/"
                className="text-brand-cyan text-sm font-medium hover:underline flex items-center justify-center gap-1"
              >
                <Home className="w-4 h-4" />
                اشترِ البرنامج الآن
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Full program content
  return (
    <div className="min-h-screen bg-gray-900" dir="rtl">
      {/* Header */}
      <header className="bg-brand-purple py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-brand-cyan transition-colors">
            <ArrowRight className="w-5 h-5" />
            <span className="font-medium">العودة</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Coach Chaima</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-brand-purple py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-bold text-brand-cyan mb-4">
              <CheckCircle className="w-4 h-4" />
              تم تفعيل البرنامج بنجاح
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">برنامجك التدريبي</h1>
            <p className="text-white/70">4 أسابيع من التمارين الاحترافية مع فيديوهات توضيحية</p>
          </motion.div>
        </div>
      </section>

      {/* Program Access Link */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">الوصول إلى ملفات البرنامج الرياضي</h2>
          
          {currentDriveLink ? (
            <>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                يمكنك الوصول إلى الفيديوهات التعليمية، خطط التدريب، والتعليمات الكاملة للبرنامج الرياضي عبر مجلد Google Drive الخاص بنا. يرجى عدم مشاركة هذا الرابط لأنه مخصص لك.
              </p>

              <div className="bg-black/30 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center gap-4 border border-white/5">
                <code className="text-brand-cyan/80 truncate w-full sm:flex-1 text-left sm:text-right" dir="ltr">
                  {currentDriveLink}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-bold">تم النسخ بنجاح</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="font-bold">نسخ الرابط</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={currentDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-cyan text-brand-purple rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-brand-cyan/20 w-full sm:w-auto"
              >
                <Play className="w-6 h-6" />
                فتح مجلد البرنامج مباشرة
              </a>
            </>
          ) : (
            <p className="text-white/70 py-10 max-w-2xl mx-auto leading-relaxed">
              روابط ملفات ومحتوى هذا البرنامج ستكون متاحة قريباً.
            </p>
          )}
        </div>
      </section>

      {/* Nutrition Tips */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-brand-cyan" />
            نصائح التغذية المرافقة
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {nutritionTips.map((tip, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-brand-cyan/30 transition-colors">
                <div className="w-10 h-10 bg-brand-purple/40 rounded-xl flex items-center justify-center mb-3">
                  <tip.icon className="w-5 h-5 text-brand-cyan" />
                </div>
                <h3 className="font-bold text-white mb-1">{tip.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center">
        <p className="text-gray-500 text-sm">Coach Chaima © – برنامج تدريبي رقمي</p>
      </footer>
    </div>
  );
}
