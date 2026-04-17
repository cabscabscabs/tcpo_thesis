import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress bar background */}
      <div className="relative mb-4">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full mx-5" />
        {/* Progress bar fill */}
        <div 
          className="absolute top-5 left-0 h-1 bg-blue-600 rounded-full mx-5 transition-all duration-500 ease-out"
          style={{ width: `calc(${progress}% - ${(progress / 100) * 40}px)` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isPending = currentStep < step.id;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <div 
              key={step.id} 
              className={`flex flex-col items-center flex-1 relative ${isClickable ? 'cursor-pointer' : ''}`}
              onClick={() => isClickable && onStepClick?.(step.id)}
            >
              {/* Step Circle */}
              <div
                className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm 
                  transition-all duration-300 transform
                  ${isCompleted 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105" 
                    : isCurrent 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-100"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                  }
                  ${isClickable ? 'hover:scale-110 hover:shadow-xl' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-medium transition-colors ${
                    isCurrent 
                      ? "text-blue-600" 
                      : isCompleted 
                      ? "text-gray-900" 
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </p>
                <p className={`text-xs mt-1 hidden md:block max-w-[140px] ${
                  isCurrent ? "text-gray-600" : "text-gray-400"
                }`}>
                  {step.description}
                </p>
              </div>

              {/* Current step indicator dot */}
              {isCurrent && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Title - More prominent */}
      <div className="md:hidden mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {currentStep}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-8 h-1 rounded-full transition-colors ${
                step.id < currentStep 
                  ? "bg-blue-600" 
                  : step.id === currentStep 
                  ? "bg-blue-400" 
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          Step {currentStep} of {steps.length}
        </span>
      </div>
    </div>
  );
}
