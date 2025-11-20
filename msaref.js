import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, Clock, Tag, DollarSign, PieChart, List, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    amount: '',
    category: 'طعام',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })
  });

  // فئات المصروفات
  const categories = [
    { id: 'طعام', name: 'طعام', color: 'bg-red-100 text-red-800', icon: '🍽️' },
    { id: 'مواصلات', name: 'مواصلات', color: 'bg-blue-100 text-blue-800', icon: '🚌' },
    { id: 'دراسة', name: 'دراسة', color: 'bg-green-100 text-green-800', icon: '📚' },
    { id: 'ترفيه', name: 'ترفيه', color: 'bg-purple-100 text-purple-800', icon: '🎬' },
    { id: 'صحة', name: 'صحة', color: 'bg-pink-100 text-pink-800', icon: '💊' },
    { id: 'أخرى', name: 'أخرى', color: 'bg-gray-100 text-gray-800', icon: '📦' }
  ];

  // تحميل المصروفات من الذاكرة المؤقتة (لأغراض العرض فقط)
  useEffect(() => {
    const savedExpenses = localStorage.getItem('studentExpenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      // مصروفات تجريبية
      const sampleExpenses = [
        { id: 1, amount: 15, category: 'طعام', description: 'غداء في المطعم الجامعي', date: '2025-11-18', time: '13:30' },
        { id: 2, amount: 8, category: 'مواصلات', description: 'تذكرة باص ذهاب وإياب', date: '2025-11-18', time: '08:15' },
        { id: 3, amount: 25, category: 'دراسة', description: 'طباعة أوراق بحث', date: '2025-11-19', time: '10:45' },
        { id: 4, amount: 12, category: 'طعام', description: 'عشاء خفيف', date: '2025-11-19', time: '20:00' },
        { id: 5, amount: 20, category: 'ترفيه', description: 'فيلم مع الأصدقاء', date: '2025-11-20', time: '19:00' },
      ];
      setExpenses(sampleExpenses);
    }
  }, []);

  // حفظ المصروفات
  useEffect(() => {
    localStorage.setItem('studentExpenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description || 'مصاريف عامة',
      date: formData.date,
      time: formData.time
    };

    setExpenses(prev => [newExpense, ...prev]);
    setFormData({
      amount: '',
      category: 'طعام',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })
    });
    setShowForm(false);
  };

  // حساب الإحصائيات
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const todaySpent = expenses
    .filter(exp => exp.date === new Date().toISOString().split('T')[0])
    .reduce((sum, exp) => sum + exp.amount, 0);
  
  // تجميع المصروفات حسب الفئة
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  // تجميع المصروفات حسب اليوم
  const dailyTotals = expenses.reduce((acc, exp) => {
    acc[exp.date] = (acc[exp.date] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">سجل مصروفاتي</h1>
              <p className="text-gray-600 mt-1">طالب أقسام داخلية - تتبّع مصروفاتك اليومية</p>
            </div>
            <div className="bg-indigo-600 text-white p-3 rounded-full">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">المجموع الكلي</p>
                <p className="text-2xl font-bold text-gray-800">{totalSpent.toFixed(2)} ج.م</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">اليوم</p>
                <p className="text-2xl font-bold text-gray-800">{todaySpent.toFixed(2)} ج.م</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <List className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">عدد المصروفات</p>
                <p className="text-2xl font-bold text-gray-800">{expenses.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-medium ${
                activeTab === 'list' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('list')}
            >
              <List className="ml-2" size={18} />
              القائمة
            </button>
            <button
              className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-medium ${
                activeTab === 'chart' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('chart')}
            >
              <PieChart className="ml-2" size={18} />
              التحليل
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'list' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">المصروفات الأخيرة</h2>
                  <motion.button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(true)}
                  >
                    <Plus size={18} className="ml-2" />
                    إضافة مصروف
                  </motion.button>
                </div>

                {expenses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="text-gray-400" size={24} />
                    </div>
                    <p className="text-gray-500">لا توجد مصروفات مسجّلة بعد</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.map((expense) => (
                      <motion.div
                        key={expense.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{expense.description}</h3>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Clock size={14} className="ml-1" />
                              {expense.time}
                              <span className="mx-2">•</span>
                              <Calendar size={14} className="ml-1" />
                              {new Date(expense.date).toLocaleDateString('ar-EG')}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-800">{expense.amount.toFixed(2)} ج.م</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs mt-1 ${
                              categories.find(c => c.id === expense.category)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {categories.find(c => c.id === expense.category)?.icon || '📦'} {expense.category}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chart' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">تحليل المصروفات</h2>
                
                {/* حسب الفئة */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-700 mb-4">المصروفات حسب الفئة</h3>
                  <div className="space-y-3">
                    {Object.entries(categoryTotals).map(([category, total]) => {
                      const percentage = (total / totalSpent) * 100;
                      const categoryInfo = categories.find(c => c.id === category) || { icon: '📦', color: 'bg-gray-100 text-gray-800' };
                      
                      return (
                        <div key={category} className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryInfo.color} mr-3`}>
                            <span>{categoryInfo.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{category}</span>
                              <span className="font-medium">{total.toFixed(2)} ج.م</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-indigo-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* حسب اليوم */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-4">المصروفات اليومية</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Object.entries(dailyTotals).slice(0, 7).map(([date, total]) => (
                      <div key={date} className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(date).toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-lg font-bold text-gray-800">{total.toFixed(1)} ج.م</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Expense Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">إضافة مصروف جديد</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowForm(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ج.م)</label>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="أدخل المبلغ"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                        <input
                          type="text"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="ماذا اشتريت؟"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">الوقت</label>
                          <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex space-x-3 space-x-reverse">
                      <button
                        type="button"
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        onClick={() => setShowForm(false)}
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        حفظ المصروف
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <p>© 2025 سجل مصروفاتي للطلاب في الأقسام الداخلية</p>
        <p className="mt-1">تابع مصروفاتك اليومية واعرف أين تنفق أموالك</p>
      </footer>
    </div>
  );
};

export default App;