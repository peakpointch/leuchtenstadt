import * as React from "react";
import {
  CalculationResult,
  LegalForm,
  MwstStatus,
  UserInput,
} from "./datatypes";
import { calculateFullPrice } from "./calculator";
import { PACKAGE_CONFIG } from "./constants";
import { formatCHF, ResultCard } from "./ResultCard";
import { Input, SelectInput } from "./inputFields";
import Button from "../Button";

// Default state matching the minimal requirements for calculation
const initialUserInput: UserInput = {
  buchungenProMonat: null,
  anzahlMitarbeitende: null,
  mehrwertsteuerStatus: null,
  rechtsform: null,
};

type InputKey = keyof UserInput;

export interface CalcProps {}

// --- MULTI-STEP COMPONENTS ---

interface FormStepProps {
  input: UserInput;
  validationErrors: Set<InputKey>;
  handleInputChange: (key: InputKey, value: any) => void;
  handleButtonClick: () => void;
  mwstOptions: { [key: string]: string };
  legalFormOptions: { [key: string]: string };
}

const InputFormStep: React.FC<FormStepProps> = ({
  input,
  validationErrors,
  handleInputChange,
  handleButtonClick,
  mwstOptions,
  legalFormOptions,
}) => (
  <>
    <h2 className="text-4xl font-extrabold text-gray-800">
      Berechnen Sie jetzt Ihre{" "}
      <em className="italic text-brand-500">Treuhand-Offerte</em>
    </h2>
    <p className="text-gray-500">
      Passen Sie die Werte an, um Ihr empfohlenes Paket und den monatlichen
      Preis zu sehen.
    </p>

    <div className="space-y-6">
      <Input
        type="number"
        label="Wie viele Buchungen pro Monat haben Sie?"
        placeholder="Zahl eingeben"
        value={input.buchungenProMonat}
        onChange={(val) => handleInputChange("buchungenProMonat", val)}
        min={0}
        isInvalid={validationErrors.has("buchungenProMonat")}
      />

      <Input
        type="number"
        label="Wie viele Personen erhalten einen Lohn?"
        placeholder="Zahl eingeben"
        value={input.anzahlMitarbeitende}
        onChange={(val) => handleInputChange("anzahlMitarbeitende", val)}
        min={0}
        isInvalid={validationErrors.has("anzahlMitarbeitende")}
      />

      <SelectInput
        label="Sind Sie für die Mehrwertsteuer angemeldet?"
        value={input.mehrwertsteuerStatus}
        options={mwstOptions}
        onChange={(val) =>
          handleInputChange("mehrwertsteuerStatus", val as MwstStatus)
        }
        isInvalid={validationErrors.has("mehrwertsteuerStatus")}
      />

      <SelectInput
        label="Welche Rechtsform hat Ihr Unternehmen?"
        value={input.rechtsform}
        options={legalFormOptions}
        onChange={(val) => handleInputChange("rechtsform", val as LegalForm)}
        isInvalid={validationErrors.has("rechtsform")}
      />
    </div>
    <Button onClick={handleButtonClick}>Jetzt berechnen</Button>
  </>
);

interface ConfirmationStepProps {
  onBack: () => void;
  result: CalculationResult;
}

const ClosingStep: React.FC<ConfirmationStepProps> = ({ onBack, result }) => (
  <div className="h-full flex flex-col justify-between space-y-8">
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-gray-800">
        Berechnen Sie jetzt Ihre{" "}
        <em className="italic text-brand-500">Treuhand-Offerte</em>
      </h2>
      <div className="text-gray-700 space-y-8">
        <p>Gemäss Ihren Angaben ist unsere unverbindliche Offerte:</p>
        <div className="text-center text-3xl font-bold text-blue-700 bg-brand-100 border border-solid border-brand-300 rounded-sm p-4">
          <span className="">{formatCHF(result.monthlyPriceCHF)}</span>
        </div>
        <p>
          Zufrieden mit dem Ergebnis? Fordern Sie jetzt Ihre persönliche und
          unverbindliche Offerte an.
        </p>
      </div>
    </div>

    <div className="space-y-6">
      <Input label="Firmenname" placeholder="Ihr Firmenname" />
      <Input type="phone" label="Telefonnummer" placeholder="079 123 45 67" />
      <Input
        type="email"
        label="E-Mail Adresse"
        placeholder="Ihre beste E-Mail Adresse"
      />
    </div>

    <div className="flex flex-row justify-between">
      <Button variant="tertiary" onClick={onBack}>
        zurück
      </Button>
      <Button variant="primary" onClick={onBack}>
        Jetzt unverbindliche Offerte anfragen!
      </Button>
    </div>
  </div>
);

// --- MAIN APPLICATION COMPONENT ---

export const Calculator: React.FC = () => {
  const [input, setInput] = React.useState<UserInput>(initialUserInput);
  const [result, setResult] = React.useState<CalculationResult | undefined>(
    undefined
  );
  const [validationErrors, setValidationErrors] = React.useState<Set<InputKey>>(
    new Set()
  );
  // NEW: State to manage the step (1: Input Form, 2: Confirmation)
  const [step, setStep] = React.useState(1);

  const handleInputChange = React.useCallback(
    <K extends keyof UserInput>(key: K, value: UserInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));

      // Error clearing logic: remove the current key from the errors set
      setValidationErrors((prevErrors) => {
        if (prevErrors.has(key)) {
          const newErrors = new Set(prevErrors);
          newErrors.delete(key);
          return newErrors;
        }
        return prevErrors;
      });
    },
    []
  );

  const handleButtonClick = React.useCallback(() => {
    const errors = new Set<InputKey>();

    // 1. Validation Check
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const value = input[key];

        // Use a strict validation check: null, undefined, or the "unset" string
        if (value === null || value === undefined || value === "unset") {
          errors.add(key as InputKey);
        }
      }
    }

    // 2. Update Error State
    setValidationErrors(errors);

    // 3. Stop if Errors Exist
    if (errors.size > 0) {
      return;
    }

    // 4. Calculate Result
    const safeInput: UserInput = {
      ...input,
      buchungenProMonat: Math.max(0, input.buchungenProMonat || 0),
      anzahlMitarbeitende: Math.max(0, input.anzahlMitarbeitende || 0),
    };

    // The result from the mock calculator needs to include all input data for the confirmation step
    const finalResult = {
      ...calculateFullPrice(safeInput),
      annualBookings: safeInput.buchungenProMonat, // Mocking these fields for display
      extraEmployees: safeInput.anzahlMitarbeitende,
      mehrwertsteuerStatus: safeInput.mehrwertsteuerStatus,
      rechtsform: safeInput.rechtsform,
    } as CalculationResult;

    setResult(finalResult);

    // 5. Advance Step
    setStep(2);
  }, [input]); // Dependency on `input` is correct

  const handleBack = React.useCallback(() => {
    setStep(1);
  }, []);

  // Options mapping for select inputs
  const mwstOptions = React.useMemo(
    () => ({
      unset: "Bitte anwählen",
      [MwstStatus.NONE]: MwstStatus.NONE,
      [MwstStatus.BALANCE]: MwstStatus.BALANCE,
      [MwstStatus.EFFECTIVE]: MwstStatus.EFFECTIVE,
      [MwstStatus.UNKNOWN]: MwstStatus.UNKNOWN,
    }),
    []
  );

  const legalFormOptions = React.useMemo(
    () => ({
      unset: "Bitte anwählen",
      [LegalForm.SOLE_PROPRIETORSHIP]: LegalForm.SOLE_PROPRIETORSHIP,
      [LegalForm.GMBH]: LegalForm.GMBH,
      [LegalForm.AG]: LegalForm.AG,
    }),
    []
  );

  // Common props for the form steps
  const formProps = {
    input,
    validationErrors,
    handleInputChange,
    handleButtonClick,
    mwstOptions,
    legalFormOptions,
  };

  return (
    <div className="w-full bg-white grid md:grid-cols-2 gap-10">
      {/* --- Left Column: Dynamic Step Content --- */}
      <div
        className="space-y-8 transition-all duration-500 ease-in-out"
        data-italic-style="custom"
      >
        {step === 1 && <InputFormStep {...formProps} />}
        {step === 2 && result && (
          <ClosingStep onBack={handleBack} result={result} />
        )}
      </div>

      {/* --- Right Column: Results Card (Always Visible) --- */}
      <div
        className={`p-8 sm:p-10 flex flex-col justify-center rounded-xl transition-all duration-300 ${
          result?.selectedPackage?.name === "PREMIUM"
            ? "bg-indigo-700"
            : "bg-blue-800"
        }`}
      >
        <ResultCard
          result={
            result || {
              selectedPackage: PACKAGE_CONFIG.UNKNOWN,
            }
          }
        />
      </div>
    </div>
  );
};
