import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, LogOut, LayoutDashboard, ShoppingBag, CreditCard,
  TrendingUp, DollarSign, Plus, X, CheckCircle, AlertCircle,
  Search, Filter, ChevronDown, Package, Clock, Target, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Program, Order } from '../lib/supabase';
import { getProducts, createProduct, deleteProductAPI, toggleProductStatus } from '../api/products';
import { getPrograms, createProgram, deleteProgramAPI, toggleProgramStatus } from '../api/programs';
import { getOrders } from '../api/orders';
import { uploadFile, uploadImages } from '../api/upload';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'programs' | 'orders'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  // Product form
  const [prodTitle, setProdTitle] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOrigPrice, setProdOrigPrice] = useState('');
  const prodImageRef = useRef<HTMLInputElement>(null);

  // Program form
  const [progTitle, setProgTitle] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [progPrice, setProgPrice] = useState('');
  const [progOrigPrice, setProgOrigPrice] = useState('');
  const progImagesRef = useRef<HTMLInputElement>(null);
  const progFileRef = useRef<HTMLInputElement>(null);

  // ─── Auth check ───
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // ─── Fetch data ───
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, pr, o] = await Promise.all([
        getProducts(true),
        getPrograms(true),
        getOrders(),
      ]);
      setProducts(p);
      setPrograms(pr);
      setOrders(o);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ─── Product actions ───
  const handleToggleProduct = async (id: number, active: boolean) => {
    try {
      await toggleProductStatus(id, !active);
      setProducts(products.map(p => p.id === id ? { ...p, active: !active } : p));
    } catch (err) { console.error(err); }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await deleteProductAPI(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodPrice) return;
    setSaving(true);
    try {
      let image_url = '';
      const files = prodImageRef.current?.files;
      if (files && files.length > 0) {
        image_url = await uploadFile('product-images', files[0]);
      }
      const newProduct = await createProduct({
        title: prodTitle,
        description: prodDesc,
        price: Number(prodPrice),
        original_price: Number(prodOrigPrice) || Number(prodPrice),
        image_url,
        features: [],
        popular: false,
        active: true,
      });
      setProducts([newProduct, ...products]);
      setShowAddProduct(false);
      setProdTitle(''); setProdDesc(''); setProdPrice(''); setProdOrigPrice('');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  // ─── Program actions ───
  const handleToggleProgram = async (id: number, active: boolean) => {
    try {
      await toggleProgramStatus(id, !active);
      setPrograms(programs.map(p => p.id === id ? { ...p, active: !active } : p));
    } catch (err) { console.error(err); }
  };

  const handleDeleteProgram = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا البرنامج؟')) return;
    try {
      await deleteProgramAPI(id);
      setPrograms(programs.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle || !progPrice) return;
    setSaving(true);
    try {
      let image_urls: string[] = [];
      let file_url = '';
      const imgFiles = progImagesRef.current?.files;
      if (imgFiles && imgFiles.length > 0) {
        image_urls = await uploadImages('program-images', imgFiles);
      }
      const progFile = progFileRef.current?.files;
      if (progFile && progFile.length > 0) {
        file_url = await uploadFile('program-files', progFile[0]);
      }
      const newProgram = await createProgram({
        title: progTitle,
        description: progDesc,
        price: Number(progPrice),
        original_price: Number(progOrigPrice) || Number(progPrice),
        image_urls,
        file_url,
        features: [],
        active: true,
      });
      setPrograms([newProgram, ...programs]);
      setShowAddProgram(false);
      setProgTitle(''); setProgDesc(''); setProgPrice(''); setProgOrigPrice('');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  // ─── Filters ───
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPrograms = programs.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOrders = orders.filter(o =>
    o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.product_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.amount), 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const activeProducts = products.filter(p => p.active).length;

  const tabs = [
    { id: 'dashboard' as const, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'products' as const, label: 'المنتجات', icon: ShoppingBag },
    { id: 'programs' as const, label: 'البرامج', icon: Target },
    { id: 'orders' as const, label: 'الطلبات', icon: CreditCard },
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-brand-cyan/20 outline-none transition-all";
  const fileInputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-purple outline-none transition-all text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-white border-l border-gray-200 z-40 hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Coach Chaima</span>
          </Link>

          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-lg shadow-brand-purple/20'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-lg flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Coach Chaima</span>
          </Link>
          <button onClick={handleLogout} className="p-2 text-red-600 hover:bg-red-50 rounded-xl">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <div className="flex border-t border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all whitespace-nowrap px-2 ${
                activeTab === tab.id
                  ? 'text-brand-purple border-b-2 border-brand-purple'
                  : 'text-gray-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:mr-64 pt-28 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-gray-500 text-sm mt-1">مرحباً بك في لوحة التحكم</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-full flex items-center justify-center text-white font-bold">
                ش
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
            </div>
          ) : (
          <AnimatePresence mode="wait">
            {/* ─── DASHBOARD ─── */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'إجمالي الإيرادات', value: `${totalRevenue} د.ج`, icon: DollarSign, color: 'from-green-500 to-emerald-400' },
                    { label: 'إجمالي الطلبات', value: totalOrders.toString(), icon: ShoppingBag, color: 'from-blue-500 to-cyan-400' },
                    { label: 'الطلبات المكتملة', value: completedOrders.toString(), icon: CheckCircle, color: 'from-brand-purple to-brand-cyan' },
                    { label: 'المنتجات النشطة', value: activeProducts.toString(), icon: Package, color: 'from-violet-500 to-purple-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">آخر الطلبات</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-brand-purple hover:text-brand-cyan text-sm font-medium">عرض الكل</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-600">{order.customer_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{order.product_title}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.amount} د.ج</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                {order.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                                {order.status === 'completed' ? 'مكتمل' : order.status === 'pending' ? 'معلق' : 'فاشل'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">لا توجد طلبات بعد</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── PRODUCTS ─── */}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="البحث في المنتجات..." className={`pr-10 pl-4 ${inputClass}`} />
                  </div>
                  <button onClick={() => setShowAddProduct(true)} className="px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة منتج
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-brand-purple/10 to-brand-cyan/10 rounded-2xl flex items-center justify-center overflow-hidden">
                            {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover rounded-2xl" /> : <span className="text-3xl">📦</span>}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{product.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{product.price} د.ج</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleProduct(product.id, product.active)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {product.active ? 'نشط' : 'معطل'}
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-2 text-center py-16 text-gray-400">لا توجد منتجات</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── PROGRAMS ─── */}
            {activeTab === 'programs' && (
              <motion.div key="programs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="البحث في البرامج..." className={`pr-10 pl-4 ${inputClass}`} />
                  </div>
                  <button onClick={() => setShowAddProgram(true)} className="px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة برنامج
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPrograms.map(program => (
                    <div key={program.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-brand-purple/10 to-brand-cyan/10 rounded-2xl flex items-center justify-center overflow-hidden">
                            {program.image_urls?.[0] ? <img src={program.image_urls[0]} alt="" className="w-full h-full object-cover rounded-2xl" /> : <span className="text-3xl">📋</span>}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{program.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{program.price} د.ج</p>
                            {program.file_url && <a href={program.file_url} target="_blank" className="text-xs text-brand-purple hover:underline mt-1 inline-block">📎 تحميل الملف</a>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleProgram(program.id, program.active)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${program.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {program.active ? 'نشط' : 'معطل'}
                          </button>
                          <button onClick={() => handleDeleteProgram(program.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{program.description}</p>
                    </div>
                  ))}
                  {filteredPrograms.length === 0 && (
                    <div className="col-span-2 text-center py-16 text-gray-400">لا توجد برامج</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── ORDERS ─── */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="البحث في الطلبات..." className={`pr-10 pl-4 ${inputClass}`} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">البريد</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-600">{order.customer_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{order.customer_email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{order.product_title}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.amount} د.ج</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('ar-DZ')}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                {order.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                                {order.status === 'completed' ? 'مكتمل' : order.status === 'pending' ? 'معلق' : 'فاشل'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                          <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">لا توجد طلبات</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </main>

      {/* ─── Add Product Modal ─── */}
      <AnimatePresence>
        {showAddProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddProduct(false)} className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">إضافة منتج جديد</h2>
                  <button onClick={() => setShowAddProduct(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
                </div>
                <form className="space-y-4" onSubmit={handleAddProduct}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنتج</label>
                    <input type="text" value={prodTitle} onChange={e => setProdTitle(e.target.value)} className={inputClass} placeholder="اسم المنتج" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                    <textarea rows={3} value={prodDesc} onChange={e => setProdDesc(e.target.value)} className={`${inputClass} resize-none`} placeholder="وصف المنتج"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">صورة المنتج</label>
                    <input type="file" ref={prodImageRef} accept="image/*" className={fileInputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">السعر (د.ج)</label>
                      <input type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className={inputClass} placeholder="499" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">السعر الأصلي</label>
                      <input type="number" value={prodOrigPrice} onChange={e => setProdOrigPrice(e.target.value)} className={inputClass} placeholder="699" />
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    {saving ? 'جارٍ الإضافة...' : 'إضافة المنتج'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Add Program Modal ─── */}
      <AnimatePresence>
        {showAddProgram && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddProgram(false)} className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">إضافة برنامج جديد</h2>
                  <button onClick={() => setShowAddProgram(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
                </div>
                <form className="space-y-4" onSubmit={handleAddProgram}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم البرنامج</label>
                    <input type="text" value={progTitle} onChange={e => setProgTitle(e.target.value)} className={inputClass} placeholder="اسم البرنامج" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                    <textarea rows={3} value={progDesc} onChange={e => setProgDesc(e.target.value)} className={`${inputClass} resize-none`} placeholder="وصف البرنامج"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">صور البرنامج</label>
                    <input type="file" ref={progImagesRef} multiple accept="image/*" className={fileInputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ملف البرنامج (PDF, ZIP...)</label>
                    <input type="file" ref={progFileRef} className={fileInputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">السعر (د.ج)</label>
                      <input type="number" value={progPrice} onChange={e => setProgPrice(e.target.value)} className={inputClass} placeholder="499" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">السعر الأصلي</label>
                      <input type="number" value={progOrigPrice} onChange={e => setProgOrigPrice(e.target.value)} className={inputClass} placeholder="699" />
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    {saving ? 'جارٍ الإضافة...' : 'إضافة البرنامج'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
