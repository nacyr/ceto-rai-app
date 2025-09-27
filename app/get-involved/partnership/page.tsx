'use client'

import React, { useState } from 'react';
import { Handshake, Building2, Users, Target, ArrowLeft, CheckCircle, Mail, Phone, Globe, Calendar } from 'lucide-react';
import Link from 'next/link';

interface PartnershipPageProps {
  onBack: () => void;
}

interface PartnershipType {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  commitment: string;
  icon: React.ReactNode;
  color: string;
}

interface PartnershipApplication {
  organizationType: string;
  organizationName: string;
  contactPerson: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  organizationSize: string;
  industry: string;
  partnershipTypes: string[];
  previousPartnerships: string;
  proposedContribution: string;
  expectedOutcomes: string;
  timeline: string;
  budget: string;
  additionalInfo: string;
}

const PartnershipPage: React.FC<PartnershipPageProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState<PartnershipApplication>({
    organizationType: '',
    organizationName: '',
    contactPerson: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    organizationSize: '',
    industry: '',
    partnershipTypes: [],
    previousPartnerships: '',
    proposedContribution: '',
    expectedOutcomes: '',
    timeline: '',
    budget: '',
    additionalInfo: ''
  });

  const partnershipTypes: PartnershipType[] = [
    {
      id: 'financial',
      title: 'Financial Partnership',
      description: 'Provide funding support for our programs and operations',
      benefits: [
        'Tax deductible contributions',
        'Brand visibility and recognition',
        'Impact reporting and updates',
        'Exclusive partner events access'
      ],
      commitment: 'Minimum $10,000 annual commitment',
      icon: <Target className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      id: 'strategic',
      title: 'Strategic Partnership',
      description: 'Long-term collaboration on program development and implementation',
      benefits: [
        'Joint program development',
        'Shared resources and expertise',
        'Co-branded initiatives',
        'Board representation opportunities'
      ],
      commitment: '2-3 year partnership agreement',
      icon: <Building2 className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      id: 'inkind',
      title: 'In-Kind Partnership',
      description: 'Provide goods, services, or expertise instead of monetary support',
      benefits: [
        'Product/service visibility',
        'CSR impact documentation',
        'Employee engagement opportunities',
        'Community recognition'
      ],
      commitment: 'Value equivalent to $5,000+ annually',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-500'
    },
    {
      id: 'technology',
      title: 'Technology Partnership',
      description: 'Provide technical solutions and digital infrastructure support',
      benefits: [
        'Showcase technical capabilities',
        'Access to impact data',
        'Innovation partnership credits',
        'Case study development'
      ],
      commitment: 'Ongoing technical support agreement',
      icon: <Globe className="w-8 h-8" />,
      color: 'bg-orange-500'
    },
    {
      id: 'employee',
      title: 'Employee Engagement',
      description: 'Enable employee volunteer programs and team building activities',
      benefits: [
        'Enhanced employee satisfaction',
        'Team building opportunities',
        'Skills-based volunteering',
        'Corporate social responsibility goals'
      ],
      commitment: 'Quarterly volunteer activities',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-indigo-500'
    },
    {
      id: 'advocacy',
      title: 'Advocacy Partnership',
      description: 'Joint advocacy efforts and policy influence initiatives',
      benefits: [
        'Amplified advocacy voice',
        'Policy influence opportunities',
        'Thought leadership positioning',
        'Industry recognition'
      ],
      commitment: 'Active participation in advocacy campaigns',
      icon: <Target className="w-8 h-8" />,
      color: 'bg-red-500'
    }
  ];

  const organizationSizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)',
    'Government Agency',
    'Non-profit Organization',
    'Educational Institution'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Agriculture', 'Energy', 'Transportation', 'Media',
    'Real Estate', 'Legal', 'Consulting', 'Government', 'Non-profit', 'Other'
  ];

  const handlePartnershipTypeToggle = (typeId: string) => {
    setApplication(prev => ({
      ...prev,
      partnershipTypes: prev.partnershipTypes.includes(typeId)
        ? prev.partnershipTypes.filter(id => id !== typeId)
        : [...prev.partnershipTypes, typeId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the partnership application
    console.log('Submitting partnership application:', application);
    alert('Thank you for your partnership application! We will contact you within 5-7 business days.');
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12">
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-800 px-8 py-12 text-center text-white">
            <Handshake className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Partner With Us</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join forces with Ceto Rai to amplify your impact and create lasting change together
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 px-8 py-4">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-20 h-1 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Partnership Type</span>
              <span>Organization Info</span>
              <span>Partnership Details</span>
              <span>Review & Submit</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Partnership Type Selection */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Select Partnership Types
                </h2>
                <p className="text-gray-600 mb-8">
                  Choose one or more partnership types that align with your organization's goals and capabilities.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {partnershipTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        application.partnershipTypes.includes(type.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handlePartnershipTypeToggle(type.id)}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 rounded-lg ${type.color} text-white`}>
                          {type.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {type.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">{type.description}</p>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {type.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        {type.commitment}
                      </div>
                      {application.partnershipTypes.includes(type.id) && (
                        <CheckCircle className="w-6 h-6 text-blue-500 mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Organization Information */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Organization Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Type *
                    </label>
                    <select
                      required
                      value={application.organizationType}
                      onChange={(e) => setApplication({...application, organizationType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select organization type</option>
                      <option value="corporation">Corporation</option>
                      <option value="nonprofit">Non-profit</option>
                      <option value="foundation">Foundation</option>
                      <option value="government">Government Agency</option>
                      <option value="educational">Educational Institution</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={application.organizationName}
                      onChange={(e) => setApplication({...application, organizationName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={application.contactPerson}
                      onChange={(e) => setApplication({...application, contactPerson: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title/Position *
                    </label>
                    <input
                      type="text"
                      required
                      value={application.title}
                      onChange={(e) => setApplication({...application, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={application.email}
                      onChange={(e) => setApplication({...application, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={application.phone}
                      onChange={(e) => setApplication({...application, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={application.website}
                      onChange={(e) => setApplication({...application, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Size *
                    </label>
                    <select
                      required
                      value={application.organizationSize}
                      onChange={(e) => setApplication({...application, organizationSize: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select organization size</option>
                      {organizationSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      required
                      value={application.industry}
                      onChange={(e) => setApplication({...application, industry: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Partnership Details */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Partnership Details
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Partnership Experience
                  </label>
                  <textarea
                    rows={3}
                    value={application.previousPartnerships}
                    onChange={(e) => setApplication({...application, previousPartnerships: e.target.value})}
                    placeholder="Describe any previous partnerships or collaborations with other organizations..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Contribution *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={application.proposedContribution}
                    onChange={(e) => setApplication({...application, proposedContribution: e.target.value})}
                    placeholder="Detail what your organization can contribute (funding, resources, expertise, etc.)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Outcomes *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={application.expectedOutcomes}
                    onChange={(e) => setApplication({...application, expectedOutcomes: e.target.value})}
                    placeholder="What do you hope to achieve through this partnership?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposed Timeline *
                    </label>
                    <select
                      required
                      value={application.timeline}
                      onChange={(e) => setApplication({...application, timeline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="3-months">3 months</option>
                      <option value="6-months">6 months</option>
                      <option value="1-year">1 year</option>
                      <option value="2-years">2 years</option>
                      <option value="3-years">3+ years</option>
                      <option value="ongoing">Ongoing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Budget Range
                    </label>
                    <select
                      value={application.budget}
                      onChange={(e) => setApplication({...application, budget: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-plus">$100,000+</option>
                      <option value="in-kind">In-kind contribution</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    rows={4}
                    value={application.additionalInfo}
                    onChange={(e) => setApplication({...application, additionalInfo: e.target.value})}
                    placeholder="Any additional information you'd like to share about your organization or partnership goals..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Review Your Partnership Application
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Selected Partnership Types:</h3>
                    <div className="flex flex-wrap gap-2">
                      {application.partnershipTypes.map(typeId => {
                        const type = partnershipTypes.find(t => t.id === typeId);
                        return type ? (
                          <span key={typeId} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {type.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Organization:</h3>
                    <p className="text-gray-600">{application.organizationName}</p>
                    <p className="text-gray-600">{application.organizationType} • {application.organizationSize}</p>
                    <p className="text-gray-600">{application.industry}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Contact:</h3>
                    <p className="text-gray-600">{application.contactPerson} - {application.title}</p>
                    <p className="text-gray-600">{application.email}</p>
                    <p className="text-gray-600">{application.phone}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Partnership Details:</h3>
                    <p className="text-gray-600 mb-2"><strong>Timeline:</strong> {application.timeline}</p>
                    {application.budget && (
                      <p className="text-gray-600 mb-2"><strong>Budget Range:</strong> {application.budget}</p>
                    )}
                    <p className="text-gray-600 text-sm">{application.proposedContribution.slice(0, 150)}...</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Partnership team will review your application within 5-7 business days</li>
                    <li>• You'll receive a follow-up call to discuss partnership details</li>
                    <li>• If approved, we'll schedule a formal partnership meeting</li>
                    <li>• Partnership agreement will be drafted and finalized</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${
                  currentStep === 1 ? 'invisible' : ''
                }`}
              >
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={currentStep === 1 && application.partnershipTypes.length === 0}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Partnership Benefits */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Proven Impact</h3>
            <p className="text-sm text-gray-600">
              Join partners who have collectively impacted over 10,000 lives
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Measurable Results</h3>
            <p className="text-sm text-gray-600">
              Receive detailed impact reports and success metrics
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Collaborative Approach</h3>
            <p className="text-sm text-gray-600">
              Work closely with our team to maximize partnership value
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipPage;