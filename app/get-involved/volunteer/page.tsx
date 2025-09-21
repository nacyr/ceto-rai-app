'use client'

import React, { useState } from 'react';
import { Users, Clock, MapPin, ArrowLeft, CheckCircle, User, Mail, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';

interface VolunteerPageProps {
  onBack: () => void;
}

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  timeCommitment: string;
  location: string;
  skills: string[];
  icon: React.ReactNode;
}

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  selectedOpportunities: string[];
  skills: string[];
  availability: string;
  experience: string;
  motivation: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const VolunteerPage: React.FC<VolunteerPageProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    selectedOpportunities: [],
    skills: [],
    availability: '',
    experience: '',
    motivation: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const opportunities: VolunteerOpportunity[] = [
    {
      id: 'education',
      title: 'Education Support Volunteer',
      description: 'Help with tutoring, teaching assistance, and educational program coordination',
      timeCommitment: '4-6 hours per week',
      location: 'Various schools and community centers',
      skills: ['Teaching', 'Patience', 'Communication'],
      icon: <Users className="w-8 h-8 text-blue-600" />
    },
    {
      id: 'healthcare',
      title: 'Healthcare Outreach Assistant',
      description: 'Support mobile clinics, health education, and community health programs',
      timeCommitment: '6-8 hours per week',
      location: 'Rural communities',
      skills: ['Healthcare background preferred', 'Compassion', 'First Aid'],
      icon: <Users className="w-8 h-8 text-green-600" />
    },
    {
      id: 'empowerment',
      title: 'Women Empowerment Facilitator',
      description: 'Lead skills training workshops and mentorship programs',
      timeCommitment: '3-5 hours per week',
      location: 'Community centers',
      skills: ['Leadership', 'Training Experience', 'Cultural Sensitivity'],
      icon: <Users className="w-8 h-8 text-purple-600" />
    },
    {
      id: 'admin',
      title: 'Administrative Support',
      description: 'Help with office tasks, data entry, and program coordination',
      timeCommitment: '2-4 hours per week',
      location: 'Foundation office or remote',
      skills: ['Computer Skills', 'Organization', 'Communication'],
      icon: <Users className="w-8 h-8 text-orange-600" />
    },
    {
      id: 'fundraising',
      title: 'Fundraising and Events',
      description: 'Assist with fundraising campaigns and community events',
      timeCommitment: '5-10 hours per month',
      location: 'Various event venues',
      skills: ['Event Planning', 'Social Media', 'Networking'],
      icon: <Users className="w-8 h-8 text-red-600" />
    },
    {
      id: 'media',
      title: 'Media and Communications',
      description: 'Help with social media, photography, and content creation',
      timeCommitment: '3-6 hours per week',
      location: 'Remote with field visits',
      skills: ['Photography', 'Writing', 'Social Media Management'],
      icon: <Users className="w-8 h-8 text-indigo-600" />
    }
  ];

  const availableSkills = [
    'Teaching', 'Healthcare', 'Administration', 'Event Planning', 'Photography', 
    'Writing', 'Social Media', 'First Aid', 'Counseling', 'Translation',
    'Computer Skills', 'Leadership', 'Public Speaking', 'Research', 'Fundraising'
  ];

  const handleOpportunityToggle = (opportunityId: string) => {
    setApplicationData(prev => ({
      ...prev,
      selectedOpportunities: prev.selectedOpportunities.includes(opportunityId)
        ? prev.selectedOpportunities.filter(id => id !== opportunityId)
        : [...prev.selectedOpportunities, opportunityId]
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setApplicationData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the application
    console.log('Submitting volunteer application:', applicationData);
    alert('Thank you for your volunteer application! We will contact you soon.');
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <Link href={'/get-involved/'}>
            <span className="font-medium">Back to Get Involved</span>
          </Link>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-800 px-8 py-12 text-center text-white">
            <Users className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Become a Volunteer</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Join our team of dedicated volunteers making a difference in communities
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 px-8 py-4">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-20 h-1 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Opportunities</span>
              <span>Personal Info</span>
              <span>Skills & Experience</span>
              <span>Review & Submit</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Select Opportunities */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Choose Your Volunteer Opportunities
                </h2>
                <p className="text-gray-600 mb-8">
                  Select one or more areas where you'd like to contribute your time and skills.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {opportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        applicationData.selectedOpportunities.includes(opportunity.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => handleOpportunityToggle(opportunity.id)}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        {opportunity.icon}
                        <h3 className="text-xl font-semibold text-gray-900">
                          {opportunity.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">{opportunity.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{opportunity.timeCommitment}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{opportunity.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {opportunity.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      {applicationData.selectedOpportunities.includes(opportunity.id) && (
                        <CheckCircle className="w-6 h-6 text-green-500 mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationData.firstName}
                      onChange={(e) => setApplicationData({...applicationData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationData.lastName}
                      onChange={(e) => setApplicationData({...applicationData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={applicationData.email}
                      onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={applicationData.phone}
                      onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={applicationData.dateOfBirth}
                      onChange={(e) => setApplicationData({...applicationData, dateOfBirth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationData.city}
                      onChange={(e) => setApplicationData({...applicationData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationData.state}
                      onChange={(e) => setApplicationData({...applicationData, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicationData.emergencyContact.name}
                        onChange={(e) => setApplicationData({
                          ...applicationData, 
                          emergencyContact: {...applicationData.emergencyContact, name: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={applicationData.emergencyContact.phone}
                        onChange={(e) => setApplicationData({
                          ...applicationData, 
                          emergencyContact: {...applicationData.emergencyContact, phone: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <select
                        required
                        value={applicationData.emergencyContact.relationship}
                        onChange={(e) => setApplicationData({
                          ...applicationData, 
                          emergencyContact: {...applicationData.emergencyContact, relationship: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select relationship</option>
                        <option value="parent">Parent</option>
                        <option value="spouse">Spouse</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills & Experience */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Skills & Experience
                </h2>

                {/* Skills Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Your Skills
                  </h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {availableSkills.map((skill) => (
                      <div
                        key={skill}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                          applicationData.skills.includes(skill)
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability *
                  </label>
                  <select
                    required
                    value={applicationData.availability}
                    onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select your availability</option>
                    <option value="weekdays">Weekdays only</option>
                    <option value="weekends">Weekends only</option>
                    <option value="flexible">Flexible schedule</option>
                    <option value="evenings">Evenings only</option>
                    <option value="mornings">Mornings only</option>
                  </select>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Experience
                  </label>
                  <textarea
                    rows={4}
                    value={applicationData.experience}
                    onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                    placeholder="Tell us about any relevant volunteer or professional experience..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Motivation */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to volunteer with us? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={applicationData.motivation}
                    onChange={(e) => setApplicationData({...applicationData, motivation: e.target.value})}
                    placeholder="Share your motivation for volunteering with Ceto Rai..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Review Your Application
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Selected Opportunities:</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {applicationData.selectedOpportunities.map(id => {
                        const opportunity = opportunities.find(o => o.id === id);
                        return opportunity ? <li key={id}>{opportunity.title}</li> : null;
                      })}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Information:</h3>
                    <p className="text-gray-600">{applicationData.email}</p>
                    <p className="text-gray-600">{applicationData.phone}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Skills & Availability:</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {applicationData.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600">Available: {applicationData.availability}</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• We'll review your application within 5-7 business days</li>
                    <li>• You'll receive an email confirmation with next steps</li>
                    <li>• Selected volunteers will be invited for an orientation session</li>
                    <li>• Background check may be required for certain positions</li>
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
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={currentStep === 1 && applicationData.selectedOpportunities.length === 0}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <User className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Training Provided</h3>
            <p className="text-sm text-gray-600">
              We provide comprehensive training for all volunteer positions
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Flexible Schedule</h3>
            <p className="text-sm text-gray-600">
              Work around your schedule with flexible volunteer opportunities
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Make an Impact</h3>
            <p className="text-sm text-gray-600">
              See the direct impact of your volunteer work in communities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;
// firstName} {applicationData.lastName}</p>
//                     <p className="text-gray-600">{applicationData.
// import { useState } from 'react'
// import { VolunteerForm } from '../volunteer/VolunteerForm'
// import { Toast } from '../common/Toast'

// export function VolunteerPage() {
//   const [showToast, setShowToast] = useState(false)

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Volunteer With Us</h1>
//       <div className="bg-white shadow rounded-lg p-6">
//         <VolunteerForm />
//       </div>
      
//       {showToast && (
//         <Toast 
//           message="Application submitted successfully!" 
//           onClose={() => setShowToast(false)} 
//         />
//       )}
//     </div>
//   )
// }
