'use client'

import React, { useState } from 'react';
import { DollarSign, Heart, CreditCard, Shield, Check, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';

interface DonatePageProps {
  onBack: () => void;
}

interface DonationOption {
  id: string;
  amount: number;
  description: string;
  impact: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const DonatePage: React.FC<DonatePageProps> = ({ onBack }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('general');
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isAnonymous: false
  });

  const donationOptions: DonationOption[] = [
    {
      id: '1',
      amount: 25,
      description: 'School Supplies',
      impact: 'Provides school materials for 5 children'
    },
    {
      id: '2',
      amount: 50,
      description: 'Healthcare Support',
      impact: 'Basic healthcare for 3 families'
    },
    {
      id: '3',
      amount: 100,
      description: 'Skills Training',
      impact: 'Training materials for 10 women'
    },
    {
      id: '4',
      amount: 250,
      description: 'Family Support',
      impact: 'Emergency aid for 5 families'
    },
    {
      id: '5',
      amount: 500,
      description: 'Program Sponsorship',
      impact: 'Sponsor a complete program cycle'
    },
    {
      id: '6',
      amount: 1000,
      description: 'Community Impact',
      impact: 'Transform an entire community'
    }
  ];

  const programs: Program[] = [
    {
      id: 'general',
      name: 'General Fund',
      description: 'Support where the need is greatest',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-red-500'
    },
    {
      id: 'education',
      name: 'Education Support',
      description: 'School supplies, scholarships, and infrastructure',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'healthcare',
      name: 'Healthcare Outreach',
      description: 'Medical clinics and health education',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'empowerment',
      name: 'Women Empowerment',
      description: 'Skills training and microfinance',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-purple-500'
    }
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getDonationAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getDonationAmount();
    if (amount <= 0) {
      alert('Please select or enter a valid donation amount');
      return;
    }
    
    // Here you would integrate with your payment processor
    console.log('Processing donation:', {
      amount,
      program: selectedProgram,
      donorInfo
    });
    
    alert(`Thank you for your donation of $${amount}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <Link href={'/get-involved/'}>
            <span className="font-medium">Back to Get Involved</span>
          </Link>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12 text-center text-white">
            <DollarSign className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Make a Donation</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your generosity creates lasting change in communities that need it most
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Program Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Program</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedProgram === program.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedProgram(program.id)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-full ${program.color} text-white`}>
                        {program.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900">{program.name}</h3>
                      {selectedProgram === program.id && (
                        <Check className="w-5 h-5 text-blue-500 ml-auto" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 ml-11">{program.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation Amount */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Impact</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {donationOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAmount === option.amount
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleAmountSelect(option.amount)}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        ${option.amount}
                      </div>
                      <div className="font-semibold text-gray-900 mb-2">
                        {option.description}
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.impact}
                      </div>
                      {selectedAmount === option.amount && (
                        <Check className="w-5 h-5 text-blue-500 mx-auto mt-3" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="border-2 border-gray-200 rounded-lg p-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Or enter a custom amount:
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Donor Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorInfo.firstName}
                    onChange={(e) => setDonorInfo({...donorInfo, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorInfo.lastName}
                    onChange={(e) => setDonorInfo({...donorInfo, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={donorInfo.isAnonymous}
                  onChange={(e) => setDonorInfo({...donorInfo, isAnonymous: e.target.checked})}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Make this donation anonymous
                </label>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Secure Donation</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Tax Deductible</span>
                </div>
              </div>
            </div>

            {/* Impact Summary */}
            {getDonationAmount() > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
                <div className="flex items-start space-x-3">
                  <Info className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Impact</h3>
                    <p className="text-blue-800">
                      Your donation of <strong>${getDonationAmount()}</strong> to{' '}
                      <strong>{programs.find(p => p.id === selectedProgram)?.name}</strong> will help us continue our mission to restore hope and change lives in vulnerable communities.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center mx-auto"
              >
                <CreditCard className="w-6 h-6 mr-3" />
                Donate ${getDonationAmount().toFixed(2)}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                You will be redirected to our secure payment processor to complete your donation.
              </p>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">100% Transparency</h3>
            <p className="text-sm text-gray-600">
              Every dollar is tracked and reported in our annual impact reports
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Check className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Tax Deductible</h3>
            <p className="text-sm text-gray-600">
              All donations are tax-deductible. Receipt will be emailed to you
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Regular Updates</h3>
            <p className="text-sm text-gray-600">
              Receive updates on how your donation is making a difference
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;

// import { useState } from 'react'
// import { DonationForm } from '../donations/DonationForm'
// import { Toast } from '../common/Toast'

// export function DonationPage() {
//   const [showToast, setShowToast] = useState(false)

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Make a Donation</h1>
//       <div className="bg-white shadow rounded-lg p-6">
//         <DonationForm />
//       </div>
      
//       {showToast && (
//         <Toast 
//           message="Thank you for your donation!" 
//           onClose={() => setShowToast(false)} 
//         />
//       )}
//     </div>
//   )
// }
