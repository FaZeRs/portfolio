import { cn } from "@acme/ui";
import { type HTMLMotionProps, motion } from "framer-motion";
import { Check } from "lucide-react";
import { ComponentProps, createContext, useContext, useMemo } from "react";

type Step = {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

type StepperContextValue = {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isStepComplete: (stepIndex: number) => boolean;
  canNavigateToStep: (stepIndex: number) => boolean;
};

const StepperContext = createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("Stepper components must be used within a StepperProvider");
  }
  return context;
}

type StepperProviderProps = {
  children: React.ReactNode;
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  completedSteps?: number[];
  allowNavigateToCompleted?: boolean;
};

function StepperProvider({
  children,
  steps,
  currentStep,
  onStepChange,
  completedSteps = [],
  allowNavigateToCompleted = true,
}: StepperProviderProps) {
  const value = useMemo(
    () => ({
      steps,
      currentStep,
      setCurrentStep: onStepChange,
      isStepComplete: (stepIndex: number) => completedSteps.includes(stepIndex),
      canNavigateToStep: (stepIndex: number) => {
        if (stepIndex === currentStep) {
          return false;
        }
        if (allowNavigateToCompleted && completedSteps.includes(stepIndex)) {
          return true;
        }
        // Can always go to current or previous steps
        return stepIndex < currentStep;
      },
    }),
    [steps, currentStep, onStepChange, completedSteps, allowNavigateToCompleted]
  );

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  );
}

type StepperProps = ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
};

function Stepper({
  className,
  orientation = "horizontal",
  ...props
}: StepperProps) {
  return (
    <div
      className={cn(
        "relative",
        orientation === "horizontal"
          ? "flex items-center justify-between"
          : "flex flex-col gap-2",
        className
      )}
      data-orientation={orientation}
      data-slot="stepper"
      {...props}
    />
  );
}

function getStepCircleClasses(
  isActive: boolean,
  isComplete: boolean,
  isPast: boolean,
  canNavigate: boolean
): string {
  if (isActive) {
    return "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25";
  }
  if (isComplete || isPast) {
    return "border-primary bg-primary text-primary-foreground";
  }
  const baseClasses =
    "border-muted-foreground/25 bg-background text-muted-foreground";
  if (canNavigate) {
    return `${baseClasses} hover:border-primary/60 hover:bg-primary/10`;
  }
  return baseClasses;
}

function StepCircleContent({
  isComplete,
  isPast,
  isActive,
  icon,
  index,
}: {
  isComplete: boolean;
  isPast: boolean;
  isActive: boolean;
  icon?: React.ReactNode;
  index: number;
}) {
  if ((isComplete || isPast) && !isActive) {
    return <Check className="h-6 w-6" strokeWidth={2.5} />;
  }
  if (icon) {
    return <span className="[&_svg]:h-6 [&_svg]:w-6">{icon}</span>;
  }
  return <span className="font-semibold text-lg">{index + 1}</span>;
}

function StepperList({
  className,
  ...props
}: ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  const {
    steps,
    currentStep,
    isStepComplete,
    canNavigateToStep,
    setCurrentStep,
  } = useStepperContext();

  return (
    <div
      className={cn("relative flex w-full items-start", className)}
      data-slot="stepper-list"
      {...props}
    >
      {/* Background connector line - spans full width behind circles */}
      <div className="absolute top-7 right-0 left-0 h-[2px] bg-border" />

      {/* Progress line overlay */}
      <motion.div
        animate={{
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
        }}
        className="absolute top-7 left-0 h-[2px] bg-primary"
        initial={false}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />

      {/* Steps */}
      <div className="relative z-10 flex w-full justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = isStepComplete(index);
          const isPast = index < currentStep;
          const canNavigate = canNavigateToStep(index);

          return (
            <button
              className={cn(
                "group flex flex-col items-center gap-3",
                canNavigate && "cursor-pointer"
              )}
              disabled={!canNavigate}
              key={step.id}
              onClick={() => canNavigate && setCurrentStep(index)}
              type="button"
            >
              {/* Circle */}
              <div
                className={cn(
                  "relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300",
                  getStepCircleClasses(
                    isActive,
                    isComplete,
                    isPast,
                    canNavigate
                  )
                )}
              >
                <StepCircleContent
                  icon={step.icon}
                  index={index}
                  isActive={isActive}
                  isComplete={isComplete}
                  isPast={isPast}
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "whitespace-nowrap font-medium text-sm transition-colors",
                  isActive || isComplete || isPast
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type StepperContentProps = HTMLMotionProps<"div"> & {
  stepId: string;
};

function StepperContent({
  className,
  stepId,
  children,
  ...props
}: StepperContentProps) {
  const { steps, currentStep } = useStepperContext();
  const stepIndex = steps.findIndex((s) => s.id === stepId);
  const isActive = stepIndex === currentStep;

  if (!isActive) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className={cn("mt-8", className)}
      data-slot="stepper-content"
      exit={{ opacity: 0, x: -20 }}
      initial={{ opacity: 0, x: 20 }}
      key={stepId}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StepperNavigationProps = ComponentProps<"div"> & {
  onNext?: () => void | Promise<void>;
  onPrevious?: () => void;
  onComplete?: () => void | Promise<void>;
  nextLabel?: string;
  previousLabel?: string;
  completeLabel?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  showPrevious?: boolean;
};

function StepperNavigation({
  className,
  onNext,
  onPrevious,
  onComplete,
  nextLabel = "Continue",
  previousLabel = "Back",
  completeLabel = "Complete",
  isNextDisabled = false,
  isLoading = false,
  showPrevious = true,
  ...props
}: StepperNavigationProps) {
  const { steps, currentStep, setCurrentStep } = useStepperContext();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      setCurrentStep(Math.max(0, currentStep - 1));
    }
  };

  const handleNext = async () => {
    if (isLastStep && onComplete) {
      await onComplete();
    } else if (onNext) {
      await onNext();
    } else {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    }
  };

  const getButtonLabel = () => {
    if (isLoading) {
      return (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <title>Loading spinner</title>
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          Processing...
        </span>
      );
    }
    return isLastStep ? completeLabel : nextLabel;
  };

  return (
    <div
      className={cn("mt-8 flex items-center justify-between", className)}
      data-slot="stepper-navigation"
      {...props}
    >
      <div>
        {showPrevious && !isFirstStep && (
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-6 font-medium text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            disabled={isLoading}
            onClick={handlePrevious}
            type="button"
          >
            {previousLabel}
          </button>
        )}
      </div>
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 font-medium text-primary-foreground text-sm shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        disabled={isNextDisabled || isLoading}
        onClick={handleNext}
        type="button"
      >
        {getButtonLabel()}
      </button>
    </div>
  );
}

export {
  Stepper,
  StepperContent,
  StepperList,
  StepperNavigation,
  StepperProvider,
  useStepperContext,
};

export type { Step, StepperContextValue };
