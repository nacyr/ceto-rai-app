interface Step {
  number: number
  title: string
}

interface StepsProps {
  currentStep: number
  steps: Step[]
}

export function Steps({ currentStep, steps }: StepsProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            currentStep >= step.number
              ? 'bg-teal-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step.number}
          </div>
          <div className={`ml-2 text-sm ${
            currentStep >= step.number
              ? 'text-teal-600 font-medium'
              : 'text-gray-500'
          }`}>
            {step.title}
          </div>
          {index < steps.length - 1 && (
            <div className={`ml-4 w-16 h-0.5 ${
              currentStep > step.number
                ? 'bg-teal-600'
                : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}