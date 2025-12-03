import * as React from "react";
import {
  CalculationResult,
  LegalForm,
  MwstStatus,
  UserInput,
} from "./datatypes";
import { calculateFullPrice } from "./calculator";
import { PACKAGE_CONFIG } from "./constants";
import { ResultCard } from "./ResultCard";
import { NumberInput, SelectInput } from "./inputFields";

// Default state matching the minimal requirements for calculation
const initialUserInput: UserInput = {
  buchungenProMonat: 0, // Example: 20/month * 12 = 240/year (STARTER range)
  anzahlMitarbeitende: 0, // Example: 1 (STARTER range)
  mehrwertsteuerStatus: MwstStatus.BALANCE,
  rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
};

export interface CalcProps {}

/**
 * Main Application Component (equivalent to the user's `Calculator` component).
 */
export const Calculator: React.FC<CalcProps> = () => {
  const [input, setInput] = React.useState<UserInput>(initialUserInput);
  const [result, setResult] = React.useState<CalculationResult>();

  const handleButtonClick = React.useCallback(() => {
    // Ensure minimum values are met before calculation
    const safeInput: UserInput = {
      ...input,
      buchungenProMonat: Math.max(0, input.buchungenProMonat),
      anzahlMitarbeitende: Math.max(0, input.anzahlMitarbeitende),
    };
    setResult(calculateFullPrice(safeInput));
  }, [result, input]);

  const handleInputChange = React.useCallback(
    <K extends keyof UserInput>(key: K, value: UserInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Options mapping for select inputs
  const mwstOptions = React.useMemo(
    () => ({
      [MwstStatus.NONE]: MwstStatus.NONE,
      [MwstStatus.BALANCE]: MwstStatus.BALANCE,
      [MwstStatus.EFFECTIVE]: MwstStatus.EFFECTIVE,
      [MwstStatus.UNKNOWN]: MwstStatus.UNKNOWN,
    }),
    []
  );

  const legalFormOptions = React.useMemo(
    () => ({
      [LegalForm.SOLE_PROPRIETORSHIP]: LegalForm.SOLE_PROPRIETORSHIP,
      [LegalForm.GMBH]: LegalForm.GMBH,
      [LegalForm.AG]: LegalForm.AG,
    }),
    []
  );

  return (
    <div className="w-full bg-white grid md:grid-cols-2 gap-10">
      {/* --- Left Column: Input Form --- */}
      <div className="space-y-8" data-italic-style="custom">
        <h2 className="text-4xl font-extrabold">
          Berechnen Sie jetzt Ihre <em>Treuhand-Offerte</em>
        </h2>
        <p className="text-gray-500">
          Passen Sie die Werte an, um Ihr empfohlenes Paket und den monatlichen
          Preis zu sehen.
        </p>

        <div className="space-y-6">
          <NumberInput
            label="Wie viele Buchungen pro Monat haben Sie?"
            placeholder="Zahl eingeben"
            value={input.buchungenProMonat}
            onChange={(val) => handleInputChange("buchungenProMonat", val)}
            min={0}
          />

          <NumberInput
            label="Wie viele Personen erhalten einen Lohn?"
            placeholder="Zahl eingeben"
            value={input.anzahlMitarbeitende}
            onChange={(val) => handleInputChange("anzahlMitarbeitende", val)}
            min={0}
          />

          <SelectInput
            label="Sind Sie für die Mehrwertsteuer angemeldet?"
            value={input.mehrwertsteuerStatus}
            options={mwstOptions}
            onChange={(val) =>
              handleInputChange("mehrwertsteuerStatus", val as MwstStatus)
            }
          />

          <SelectInput
            label="Welche Rechtsform hat Ihr Unternehmen?"
            value={input.rechtsform}
            options={legalFormOptions}
            onChange={(val) =>
              handleInputChange("rechtsform", val as LegalForm)
            }
          />
        </div>
        <button
          onClick={handleButtonClick}
          className="bg-brand-500 text-white px-8 py-3 rounded-sm cursor-pointer hover:bg-dark-900 transition-all"
        >
          Jetzt berechnen
        </button>
      </div>

      {/* --- Right Column: Results --- */}
      <div
        className={`p-8 sm:p-10 flex flex-col justify-center rounded-xl transition-all duration-300 ${
          result?.selectedPackage?.name === "PREMIUM"
            ? "bg-brand-600"
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
