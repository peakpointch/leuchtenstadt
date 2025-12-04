import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  formSchema,
  CalculationResult,
  FormSchema,
  UserInput,
} from "./datatypes";
import { calculateFullPrice } from "./core";
import { PACKAGE_CONFIG } from "./constants";
import { createSubmissionHash, submitFormData } from "./form";
import CalculationStep from "./CalculationStep";
import ClosingStep from "./ClosingStep";
import FormSuccess from "./FormSuccess";
import PackageCard from "./PackageCard";

export interface CalculatorProps {
  visibility?: boolean;
}

export const Calculator = ({ visibility }: CalculatorProps) => {
  visibility = visibility === undefined ? true : visibility;

  const [result, setResult] = React.useState<CalculationResult | undefined>(
    undefined
  );
  const [step, setStep] = React.useState(1);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingsPerMonth: "",
      employees: "",
      mwstStatus: "",
      legalForm: "",
      companyName: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    const isValid = await form.trigger();

    if (!isValid) return;

    const submissionId = createSubmissionHash(data, Date.now());

    const wfSubmission = {
      name: "Calculator",
      pageId: "692afc2a8ba6149cbeaa64bc",
      elementId: "9544fa48-c438-cf4d-5206-ae5df0ba6b4b",
      source: "https://leuchtenstadt-treuhand.webflow.io/treuhandrechner",
      test: false,
      fields: {
        ...data,
        lead_id: submissionId,
      },
      dolphin: false,
    };

    // For anyone wondering: NO, this is NOT an api key. It's a public webflow site id.
    const success = await submitFormData(
      "6905f8c5e25bdb3293105e75",
      wfSubmission
    );

    if (success) {
      // Render success state
      setStep(3);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "form_submitted",
        form_name: "calculator_offer_request",
        lead_id: submissionId,
        lead_email: data.email,
        lead_bookings_monthly: data.bookingsPerMonth,
        lead_bookings_annual: result.annualBookings,
        lead_value_monthly: result.monthlyPriceCHF,
        lead_value_annual: result.annualPriceCHF,
      });
    }
  };

  const calcStepFields: Array<keyof FormSchema> = [
    "bookingsPerMonth",
    "employees",
    "mwstStatus",
    "legalForm",
  ];

  const handleCalculate = React.useCallback(async () => {
    const isValid = await form.trigger(calcStepFields);

    if (!isValid) return;

    const fields = form.getValues();

    const userInput: UserInput = {
      ...(fields as any as UserInput),
      bookingsPerMonth: parseInt(fields.bookingsPerMonth),
      employees: parseInt(fields.employees),
    };

    setResult(calculateFullPrice(userInput));
    setStep(2);
  }, [form.trigger, form.getValues]);

  const handleBack = React.useCallback(() => {
    setStep(1);
  }, []);

  return visibility ? (
    <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-10">
      {/* --- Left Column: Dynamic Step Content --- */}
      <form
        id="calculator"
        onSubmit={form.handleSubmit(async (data) => onSubmit(data))}
        className="space-y-8 transition-all duration-500 ease-in-out"
        data-italic-style="custom"
      >
        {step === 1 && (
          <CalculationStep form={form} handleCalculate={handleCalculate} />
        )}
        {step === 2 && result && (
          <ClosingStep form={form} onBack={handleBack} result={result} />
        )}
        {step === 3 && result && <FormSuccess />}
      </form>

      {/* --- Right Column: Results Card (Always Visible) --- */}
      <div
        className={`p-4 sm:p-8 md:p-10 flex flex-col justify-center rounded-xl transition-all duration-300 ${
          result?.selectedPackage?.name === "PREMIUM"
            ? "bg-brand-500"
            : "bg-blue-700"
        }`}
      >
        <PackageCard
          result={
            step !== 1
              ? result
              : {
                  selectedPackage: PACKAGE_CONFIG.UNKNOWN,
                }
          }
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Calculator;
