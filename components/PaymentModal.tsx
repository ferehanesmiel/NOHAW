
import * as React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Course } from '../types';

interface PaymentModalProps {
  course: Course;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose, onPaymentSuccess }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<'international' | 'local'>('international');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentSuccess();
  };

  const TabButton: React.FC<{tab: 'international' | 'local', label: string}> = ({ tab, label }) => (
    <button type="button" onClick={() => setActiveTab(tab)} className={`w-1/2 py-2 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-[--accent] text-[--accent]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
        {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-slate-800">{t('paymentDetails')}</h2>
        <p className="text-slate-600 mb-6">You are purchasing "{course.title}" for ${course.price}.</p>
        
        <div className="flex border-b border-slate-200 mb-4">
            <TabButton tab="international" label={t('internationalPayment')} />
            <TabButton tab="local" label={t('localPayment')} />
        </div>
        
        {activeTab === 'international' && (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700">{t('cardNumber')}</label>
                <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" className="mt-1 elegant-input" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700">{t('expiryDate')}</label>
                <input type="text" id="expiryDate" placeholder="MM/YY" className="mt-1 elegant-input" required />
                </div>
                <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-slate-700">{t('cvc')}</label>
                <input type="text" id="cvc" placeholder="123" className="mt-1 elegant-input" required />
                </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="elegant-button-outline">{t('cancel')}</button>
                <button type="submit" className="elegant-button">{t('completePayment')}</button>
            </div>
            </form>
        )}

        {activeTab === 'local' && (
            <div className="text-center py-8">
                <p className="text-slate-600">Local payment options coming soon.</p>
                <button type="button" onClick={onClose} className="mt-4 elegant-button-outline">{t('cancel')}</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;