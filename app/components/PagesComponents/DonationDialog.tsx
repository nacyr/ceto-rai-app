'use client'

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import { DonationDialogProps, ExchangeRate } from '@/app/types/types';

const DonationDialog: React.FC<DonationDialogProps> = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  bankDetails, 
  donationData 
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);

  // Fetch exchange rate when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchExchangeRate();
    }
  }, [isOpen]);

  const fetchExchangeRate = async () => {
    setIsLoadingRate(true);
    setRateError(null);
    
    try {
      // Using a free API like exchangerate-api.com
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates && data.rates.NGN) {
        setExchangeRate({
          rate: data.rates.NGN,
          lastUpdated: new Date().toLocaleString()
        });
      } else {
        throw new Error('NGN rate not found');
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      setRateError('Unable to fetch current exchange rate');
      // Fallback rate (you should update this periodically)
      setExchangeRate({
        rate: 1650, // Approximate NGN/USD rate - update this as needed
        lastUpdated: 'Offline rate'
      });
    } finally {
      setIsLoadingRate(false);
    }
  };

  const getNairaAmount = () => {
    if (!exchangeRate) return 0;
    return donationData.amount * exchangeRate.rate;
  };

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">Complete Your Donation</h2>
            <p className="text-blue-100">Transfer the NGN equivalent below to complete your ${donationData.amount.toFixed(2)} donation</p>
          </div>
        </div>

        {/* Currency Conversion */}
        <div className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-900">Currency Conversion</h3>
              <button
                onClick={fetchExchangeRate}
                className="text-green-600 hover:text-green-700 transition-colors"
                disabled={isLoadingRate}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingRate ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">USD Amount:</span>
                <span className="font-bold text-lg">${donationData.amount.toFixed(2)}</span>
              </div>
              
              {isLoadingRate ? (
                <div className="flex items-center justify-center py-4">
                  <RefreshCw className="w-5 h-5 animate-spin text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Getting current rate...</span>
                </div>
              ) : rateError ? (
                <div className="flex items-center text-yellow-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>{rateError}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Exchange Rate:</span>
                    <span className="text-sm">1 USD = ₦{exchangeRate?.rate.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm text-gray-600">NGN Amount:</span>
                    <span className="font-bold text-2xl text-green-700">₦{getNairaAmount().toLocaleString()}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Rate updated: {exchangeRate?.lastUpdated}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Bank Transfer Details (NGN Account)</h3>
            
            {/* Account Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
                <span className="font-mono text-lg">{bankDetails.accountNumber}</span>
                <button
                  onClick={() => copyToClipboard(bankDetails.accountNumber, 'account')}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {copiedField === 'account' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Bank Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
                <span className="font-medium">{bankDetails.bankName}</span>
                <button
                  onClick={() => copyToClipboard(bankDetails.bankName, 'bank')}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {copiedField === 'bank' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Account Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
                <span className="font-medium">{bankDetails.accountName}</span>
                <button
                  onClick={() => copyToClipboard(bankDetails.accountName, 'name')}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {copiedField === 'name' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Amount to Transfer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Transfer (NGN)</label>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-2xl font-bold text-green-700">₦{getNairaAmount().toLocaleString()}</span>
                <button
                  onClick={() => copyToClipboard(getNairaAmount().toString(), 'amount')}
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  {copiedField === 'amount' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Instructions:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Transfer exactly ₦{getNairaAmount().toLocaleString()} (NGN equivalent)</li>
              <li>• Include your name in the transfer description</li>
              <li>• Keep your transfer receipt for records</li>
              <li>• Click &quot;Complete&quot; below after making the transfer</li>
              <li>• Exchange rate may vary slightly at transfer time</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onComplete}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              disabled={isLoadingRate}
            >
              Complete Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationDialog;


//DualCurrencyDialog for later USE
// 'use client'

// import React, { useState, useEffect } from 'react';
// import { X, Copy, Check, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
// import { DonationDialogProps } from '@/app/types/types';

// interface ExchangeRate {
//   rate: number;
//   lastUpdated: string;
// }

// type CurrencyOption = 'NGN' | 'USD';

// const DualCurrencyDialog: React.FC<DonationDialogProps> = ({ 
//   isOpen, 
//   onClose, 
//   onComplete, 
//   bankDetails, 
//   donationData 
// }) => {
//   const [copiedField, setCopiedField] = useState<string | null>(null);
//   const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>('NGN');
//   const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
//   const [isLoadingRate, setIsLoadingRate] = useState(true);
//   const [rateError, setRateError] = useState<string | null>(null);

//   // Mock bank details for different currencies
//   const bankAccounts = {
//     NGN: {
//       accountNumber: "1234567890",
//       bankName: "First Bank Nigeria",
//       accountName: "Hope Foundation Nigeria",
//       currency: "NGN"
//     },
//     USD: {
//       accountNumber: "9876543210", 
//       bankName: "Standard Chartered Bank",
//       accountName: "Hope Foundation USD",
//       currency: "USD"
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       fetchExchangeRate();
//     }
//   }, [isOpen]);

//   const fetchExchangeRate = async () => {
//     setIsLoadingRate(true);
//     setRateError(null);
    
//     try {
//       const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
//       const data = await response.json();
      
//       if (data.rates && data.rates.NGN) {
//         setExchangeRate({
//           rate: data.rates.NGN,
//           lastUpdated: new Date().toLocaleString()
//         });
//       } else {
//         throw new Error('NGN rate not found');
//       }
//     } catch (error) {
//       console.error('Failed to fetch exchange rate:', error);
//       setRateError('Unable to fetch current exchange rate');
//       setExchangeRate({
//         rate: 1650,
//         lastUpdated: 'Offline rate'
//       });
//     } finally {
//       setIsLoadingRate(false);
//     }
//   };

//   const getTransferAmount = () => {
//     if (selectedCurrency === 'USD') {
//       return donationData.amount;
//     }
//     return exchangeRate ? donationData.amount * exchangeRate.rate : 0;
//   };

//   const getCurrentBankDetails = () => {
//     return bankAccounts[selectedCurrency];
//   };

//   if (!isOpen) return null;

//   const copyToClipboard = async (text: string, field: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedField(field);
//       setTimeout(() => setCopiedField(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//           <div className="text-center">
//             <CreditCard className="w-12 h-12 mx-auto mb-3" />
//             <h2 className="text-2xl font-bold mb-2">Complete Your Donation</h2>
//             <p className="text-blue-100">Choose your preferred transfer currency and account</p>
//           </div>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* Currency Selection */}
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//             <h3 className="font-semibold text-gray-900 mb-3">Choose Transfer Currency</h3>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 onClick={() => setSelectedCurrency('NGN')}
//                 className={`p-3 rounded-lg border-2 transition-all ${
//                   selectedCurrency === 'NGN'
//                     ? 'border-green-500 bg-green-50 text-green-700'
//                     : 'border-gray-300 hover:border-gray-400'
//                 }`}
//               >
//                 <div className="text-center">
//                   <div className="font-semibold">Nigerian Naira</div>
//                   <div className="text-sm opacity-75">₦ NGN Account</div>
//                   <div className="text-xs mt-1 text-green-600">
//                     {selectedCurrency === 'NGN' && '✓ Most convenient'}
//                   </div>
//                 </div>
//               </button>
              
//               <button
//                 onClick={() => setSelectedCurrency('USD')}
//                 className={`p-3 rounded-lg border-2 transition-all ${
//                   selectedCurrency === 'USD'
//                     ? 'border-blue-500 bg-blue-50 text-blue-700'
//                     : 'border-gray-300 hover:border-gray-400'
//                 }`}
//               >
//                 <div className="text-center">
//                   <div className="font-semibold">US Dollars</div>
//                   <div className="text-sm opacity-75">$ USD Account</div>
//                   <div className="text-xs mt-1 text-orange-600">
//                     {selectedCurrency === 'USD' && '⚠ Limited availability'}
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Currency Conversion (only show for NGN) */}
//           {selectedCurrency === 'NGN' && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-semibold text-green-900">Currency Conversion</h3>
//                 <button
//                   onClick={fetchExchangeRate}
//                   className="text-green-600 hover:text-green-700 transition-colors"
//                   disabled={isLoadingRate}
//                 >
//                   <RefreshCw className={`w-4 h-4 ${isLoadingRate ? 'animate-spin' : ''}`} />
//                 </button>
//               </div>
              
//               {isLoadingRate ? (
//                 <div className="flex items-center justify-center py-4">
//                   <RefreshCw className="w-5 h-5 animate-spin text-green-600 mr-2" />
//                   <span className="text-sm text-gray-600">Getting current rate...</span>
//                 </div>
//               ) : rateError ? (
//                 <div className="flex items-center text-yellow-600 text-sm">
//                   <AlertCircle className="w-4 h-4 mr-2" />
//                   <span>{rateError}</span>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">USD Amount:</span>
//                     <span className="font-bold">${donationData.amount.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Exchange Rate:</span>
//                     <span className="text-sm">1 USD = ₦{exchangeRate?.rate.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between items-center border-t pt-2">
//                     <span className="text-sm text-gray-600">NGN Amount:</span>
//                     <span className="font-bold text-xl text-green-700">₦{getTransferAmount().toLocaleString()}</span>
//                   </div>
//                   <p className="text-xs text-gray-500 text-center">Rate updated: {exchangeRate?.lastUpdated}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Bank Details */}
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h3 className="font-semibold text-blue-900 mb-3">
//               Bank Transfer Details ({getCurrentBankDetails().currency} Account)
//             </h3>
            
//             {/* Account Number */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
//               <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
//                 <span className="font-mono text-lg">{getCurrentBankDetails().accountNumber}</span>
//                 <button
//                   onClick={() => copyToClipboard(getCurrentBankDetails().accountNumber, 'account')}
//                   className="text-blue-600 hover:text-blue-700 transition-colors"
//                 >
//                   {copiedField === 'account' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Bank Name */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
//               <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
//                 <span className="font-medium">{getCurrentBankDetails().bankName}</span>
//                 <button
//                   onClick={() => copyToClipboard(getCurrentBankDetails().bankName, 'bank')}
//                   className="text-blue-600 hover:text-blue-700 transition-colors"
//                 >
//                   {copiedField === 'bank' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Account Name */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
//               <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
//                 <span className="font-medium">{getCurrentBankDetails().accountName}</span>
//                 <button
//                   onClick={() => copyToClipboard(getCurrentBankDetails().accountName, 'name')}
//                   className="text-blue-600 hover:text-blue-700 transition-colors"
//                 >
//                   {copiedField === 'name' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Amount */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Amount to Transfer ({selectedCurrency})
//               </label>
//               <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
//                 <span className="text-2xl font-bold text-green-700">
//                   {selectedCurrency === 'NGN' ? '₦' : '$'}{getTransferAmount().toLocaleString()}
//                 </span>
//                 <button
//                   onClick={() => copyToClipboard(getTransferAmount().toString(), 'amount')}
//                   className="text-green-600 hover:text-green-700 transition-colors"
//                 >
//                   {copiedField === 'amount' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Instructions */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <h4 className="font-semibold text-yellow-800 mb-2">Instructions:</h4>
//             <ul className="text-sm text-yellow-700 space-y-1">
//               <li>• Transfer exactly {selectedCurrency === 'NGN' ? '₦' : '$'}{getTransferAmount().toLocaleString()}</li>
//               <li>• Use the {selectedCurrency} account details above</li>
//               <li>• Include your name in the transfer description</li>
//               <li>• Keep your transfer receipt for records</li>
//               <li>• Click "Complete" below after making the transfer</li>
//               {selectedCurrency === 'NGN' && <li>• Exchange rate may vary slightly at transfer time</li>}
//             </ul>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex space-x-3 pt-4">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onComplete}
//               className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
//               disabled={selectedCurrency === 'NGN' && isLoadingRate}
//             >
//               Complete Donation
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DualCurrencyDialog;
// 'use client'

// import React from 'react';
// import { X, Copy, Check, CreditCard } from 'lucide-react';
// import { DonationDialogProps } from '@/app/types/types';


// const DonationDialog: React.FC<DonationDialogProps> = ({ 
//   isOpen, 
//   onClose, 
//   onComplete, 
//   bankDetails, 
//   donationData 
// }) => {
//   const [copiedField, setCopiedField] = React.useState<string | null>(null);

//   if (!isOpen) return null;

//   const copyToClipboard = async (text: string, field: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedField(field);
//       setTimeout(() => setCopiedField(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//           <div className="text-center">
//             <CreditCard className="w-12 h-12 mx-auto mb-3" />
//             <h2 className="text-2xl font-bold mb-2">Complete Your Donation</h2>
//             <p className="text-blue-100">Transfer ${donationData.amount.toFixed(2)} to the account below</p>
//           </div>
//         </div>

//         {/* Bank Details */}
//         <div className="p-6 space-y-4">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h3 className="font-semibold text-blue-900 mb-3">Bank Transfer Details</h3>
            
//             {/* Account Number */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
//               <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
//                 <span className="font-mono text-lg">{bankDetails.accountNumber}</span>
//                 <button
//                   onClick={() => copyToClipboard(bankDetails.accountNumber, 'account')}
//                   className="text-blue-600 hover:text-blue-700 transition-colors"
//                 >
//                   {copiedField === 'account' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Bank Name */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
//               <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
//                 <span className="font-medium">{bankDetails.bankName}</span>
//                 <button
//                   onClick={() => copyToClipboard(bankDetails.bankName, 'bank')}
//                   className="text-blue-600 hover:text-blue-700 transition-colors"
//                 >
//                   {copiedField === 'bank' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Account Name */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
//               <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
//                 <span className="font-medium">{bankDetails.accountName}</span>
//                 <button
//                   onClick={() => copyToClipboard(bankDetails.accountName, 'name')}
//                   className="text-blue-600 hover:text-blue-700 transition-colors"
//                 >
//                   {copiedField === 'name' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Amount */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Transfer</label>
//               <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//                 <span className="text-2xl font-bold text-green-700">${donationData.amount.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Instructions */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <h4 className="font-semibold text-yellow-800 mb-2">Instructions:</h4>
//             <ul className="text-sm text-yellow-700 space-y-1">
//               <li>• Use the exact amount shown above</li>
//               <li>• Include your name in the transfer description</li>
//               <li>• Keep your transfer receipt for records</li>
//               <li>• Click &quot;Complete&quot; below after making the transfer</li>
//             </ul>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex space-x-3 pt-4">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onComplete}
//               className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
//             >
//               Complete Donation
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DonationDialog;