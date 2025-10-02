// BookingProgress.jsx - Progress indicator component
export default function BookingProgress({ currentStep }) {
  const steps = [
    { number: 1, label: "Choose your treatment" },
    { number: 2, label: "Select date and time" },
    { number: 3, label: "Enter your details" }
  ];

  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex items-center justify-center gap-4 mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step.number 
                ? 'bg-[color:var(--rose)] border-[color:var(--rose)] text-white shadow-lg' 
                : 'bg-white border-slate-200 text-slate-400'
            }`}>
              {currentStep > step.number ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-sm font-semibold">{step.number}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                currentStep > step.number ? 'bg-[color:var(--rose)]' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-slate-500">
        {steps.find(step => step.number === currentStep)?.label}
      </div>
    </div>
  );
}