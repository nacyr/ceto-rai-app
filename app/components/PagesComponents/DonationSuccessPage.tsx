'use client'

import React, { useState, useEffect } from 'react';
import { CheckCircle, Heart, ArrowLeft, Mail, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DonationSuccessPageProps } from '@/app/types/types';


const DonationSuccessPage: React.FC<DonationSuccessPageProps> = ({
  donationAmount,
  donorName
}) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsRedirecting(true);
      router.push('/get-involved/donate'); // Redirect back to donate page
    }
  }, [countdown, router]);

  const handleManualRedirect = () => {
    setIsRedirecting(true);
    router.push('/get-involved/donate');
  };

  const handleStayOnPage = () => {
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center text-white">
            <CheckCircle className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Thank You{donorName ? `, ${donorName}` : ''}!</h1>
            <p className="text-xl text-green-100">
              Your donation{donationAmount ? ` of $${donationAmount.toFixed(2)}` : ''} has been received successfully
            </p>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Timer Section */}
            {countdown > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-blue-900">Auto Redirect</h3>
                </div>
                <p className="text-blue-800 mb-4">
                  You will be redirected to make another donation in{' '}
                  <span className="font-bold text-2xl text-blue-600">{countdown}</span> seconds
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={handleManualRedirect}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    disabled={isRedirecting}
                  >
                    {isRedirecting ? 'Redirecting...' : 'Donate Again Now'}
                  </button>
                  <button
                    onClick={handleStayOnPage}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Stay Here
                  </button>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="mb-8">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Generosity Changes Lives
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We are incredibly grateful for your support. Your donation will help us continue 
                our mission to restore hope and transform lives in vulnerable communities around the world.
              </p>
            </div>

            {/* What happens next */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Email Confirmation</p>
                    <p className="text-sm text-gray-600">
                      You&apos;ll receive a donation receipt and confirmation email within 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Impact Updates</p>
                    <p className="text-sm text-gray-600">
                      We&apos;ll send you regular updates showing how your donation is making a difference
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Only show if countdown is stopped */}
            {countdown === 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={handleManualRedirect}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  disabled={isRedirecting}
                >
                  <Heart className="w-5 h-5" />
                  <span>{isRedirecting ? 'Redirecting...' : 'Make Another Donation'}</span>
                </button>
                <Link href="/get-involved">
                  <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
                    <span>Explore Other Ways to Help</span>
                  </button>
                </Link>
                <Link href="/">
                  <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Return to Homepage</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccessPage;
// 'use client'

// import React, { useState, useEffect } from 'react';
// import { CheckCircle, Heart, ArrowLeft, Mail, Share2, Clock } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { DonationSuccessPageProps } from '@/app/types/types';

// const DonationSuccessPage: React.FC<DonationSuccessPageProps> = ({
//   redirectDelay = 10,
//   redirectTo = '/get-involved/donate',
//   donationAmount,
//   donorName
// }) => {
//   const router = useRouter();
//   const [countdown, setCountdown] = useState(redirectDelay);
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setIsRedirecting(true);
//       router.push(redirectTo);
//     }
//   }, [countdown, redirectTo, router]);

//   const handleManualRedirect = () => {
//     setIsRedirecting(true);
//     router.push(redirectTo);
//   };

//   const handleStayOnPage = () => {
//     setCountdown(0);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center text-white relative">
//             <CheckCircle className="w-20 h-20 mx-auto mb-6" />
//             <h1 className="text-4xl font-bold mb-4">Thank You{donorName ? `, ${donorName}` : ''}!</h1>
//             <p className="text-xl text-green-100">
//               Your donation{donationAmount ? ` of $${donationAmount.toFixed(2)}` : ''} has been received successfully
//             </p>
//           </div>

//           {/* Content */}
//           <div className="p-8 text-center">
//             {/* Timer Section */}
//             {countdown > 0 && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
//                 <div className="flex items-center justify-center space-x-3 mb-4">
//                   <Clock className="w-6 h-6 text-blue-600" />
//                   <h3 className="text-xl font-semibold text-blue-900">Auto Redirect</h3>
//                 </div>
//                 <p className="text-blue-800 mb-4">
//                   You will be redirected to make another donation in{' '}
//                   <span className="font-bold text-2xl text-blue-600">{countdown}</span> seconds
//                 </p>
//                 <div className="flex justify-center space-x-3">
//                   <button
//                     onClick={handleManualRedirect}
//                     className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                   >
//                     Donate Again Now
//                   </button>
//                   <button
//                     onClick={handleStayOnPage}
//                     className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//                   >
//                     Stay Here
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Main Content */}
//             <div className="mb-8">
//               <Heart className="w-16 h-16 text-red-500 mx-auto mb-6" />
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">
//                 Your Generosity Changes Lives
//               </h2>
//               <p className="text-lg text-gray-600 leading-relaxed">
//                 We are incredibly grateful for your support. Your donation will help us continue 
//                 our mission to restore hope and transform lives in vulnerable communities around the world.
//               </p>
//             </div>

//             {/* What happens next */}
//             <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">What happens next?</h3>
//               <div className="space-y-3">
//                 <div className="flex items-start space-x-3">
//                   <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-gray-800">Email Confirmation</p>
//                     <p className="text-sm text-gray-600">
//                       You&apos;ll receive a donation receipt and confirmation email within 24 hours
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <Heart className="w-5 h-5 text-red-500 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-gray-800">Impact Updates</p>
//                     <p className="text-sm text-gray-600">
//                       We&apos;ll send you regular updates showing how your donation is making a difference
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <Share2 className="w-5 h-5 text-green-500 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-gray-800">Annual Report</p>
//                     <p className="text-sm text-gray-600">
//                       You&apos;ll receive our annual impact report showing all the lives changed
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons - Only show if countdown is stopped */}
//             {countdown === 0 && (
//               <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
//                 <button
//                   onClick={handleManualRedirect}
//                   className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                   disabled={isRedirecting}
//                 >
//                   <Heart className="w-5 h-5" />
//                   <span>{isRedirecting ? 'Redirecting...' : 'Make Another Donation'}</span>
//                 </button>
//                 <Link href="/get-involved">
//                   <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
//                     <span>Explore Other Ways to Help</span>
//                   </button>
//                 </Link>
//                 <Link href="/">
//                   <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
//                     <ArrowLeft className="w-5 h-5" />
//                     <span>Return to Homepage</span>
//                   </button>
//                 </Link>
//               </div>
//             )}

//             {/* Share Section */}
//             <div className="pt-8 border-t border-gray-200">
//               <p className="text-gray-600 mb-4">Help us reach more people who want to make a difference</p>
//               <div className="flex justify-center space-x-4">
//                 <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
//                   <Share2 className="w-4 h-4" />
//                   <span>Share on Facebook</span>
//                 </button>
//                 <button className="flex items-center space-x-2 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm">
//                   <Share2 className="w-4 h-4" />
//                   <span>Share on Twitter</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Additional Info Cards */}
//         <div className="mt-8 grid md:grid-cols-2 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
//             <h3 className="font-semibold text-gray-900 mb-2">Tax Deductible</h3>
//             <p className="text-sm text-gray-600">
//               Your donation is tax-deductible. Keep your receipt for tax purposes.
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
//             <h3 className="font-semibold text-gray-900 mb-2">100% Impact</h3>
//             <p className="text-sm text-gray-600">
//               Every dollar goes directly to our programs. Administrative costs are covered separately.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DonationSuccessPage;