import { useState } from 'react'
import { Steps } from './Steps'
import { PersonalInfo } from './steps/PersonalInfo'
import { SkillsAvailability } from './steps/SkillsAvailability'
import { Interests } from './steps/Interests'
import { Review } from './steps/Review'

export function VolunteerPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    personalInfo: {},
    skills: [],
    availability: '',
    interests: [],
    experience: ''
  })

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Skills & Availability' },
    { number: 3, title: 'Areas of Interest' },
    { number: 4, title: 'Review & Submit' }
  ]

  const renderStep = () => {
    switch(step) {
      case 1:
        return <PersonalInfo data={formData} onUpdate={setFormData} onNext={() => setStep(2)} />
      case 2:
        return <SkillsAvailability data={formData} onUpdate={setFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />
      case 3:
        return <Interests data={formData} onUpdate={setFormData} onNext={() => setStep(4)} onBack={() => setStep(2)} />
      case 4:
        return <Review data={formData} onBack={() => setStep(3)} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Volunteer Application</h1>
      <Steps currentStep={step} steps={steps} />
      <div className="mt-8">
        {renderStep()}
      </div>
    </div>
  )
}
