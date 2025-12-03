import * as React from "react";
import {
  CalculationResult,
  LegalForm,
  MwstStatus,
  UserInput,
} from "./datatypes";
import { calculateFullPrice } from "./calculator";

export interface CalcProps {}

// Helper function to format currency
const formatCHF = (amount: number) => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// --- MODULAR COMPONENTS ---

interface InputFieldProps {
  label: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
  min: number;
}

/**
 * Component for number inputs (Buchungen and Mitarbeiter).
 */
const NumberInput: React.FC<InputFieldProps> = ({
  label,
  value,
  unit,
  onChange,
  min,
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative flex items-center">
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        className="w-full p-3 pr-16 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
      />
      <span className="absolute right-0 top-0 bottom-0 flex items-center pr-3 text-gray-500 text-sm">
        {unit}
      </span>
    </div>
  </div>
);

interface SelectFieldProps {
  label: string;
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
}

/**
 * Component for select inputs (MWST and Legal Form).
 */
const SelectInput: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 appearance-none pr-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
        backgroundSize: "1.5em 1.5em",
      }}
    >
      {Object.entries(options).map(([key, display]) => (
        <option key={key} value={key}>
          {display}
        </option>
      ))}
    </select>
  </div>
);

interface ResultCardProps {
  result: CalculationResult;
}

/**
 * Component to display the final calculated price and package.
 */
const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { selectedPackage, monthlyPriceCHF, annualPriceCHF } = result;

  const packageColors = {
    STARTER: "bg-green-500/10 text-green-700 ring-green-500",
    SMART: "bg-blue-500/10 text-blue-700 ring-blue-500",
    COMFORT: "bg-purple-500/10 text-purple-700 ring-purple-500",
    PREMIUM: "bg-red-500/10 text-red-700 ring-red-500",
  };

  const packageDescription = {
    STARTER: "Basis-Paket für kleine Unternehmen und einfache MWST-Fälle.",
    SMART: "Ideal für wachsende Firmen oder komplexe MWST-Anforderungen.",
    COMFORT:
      "Umfangreiches Paket für mittelgrosse Unternehmen mit mehr Buchungen und Mitarbeitenden.",
    PREMIUM: "Top-Paket für grosse Unternehmen mit hohen Volumina.",
  };

  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-2xl space-y-6">
      <div className="flex flex-col items-start">
        <span
          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ring-2 ${
            packageColors[selectedPackage.name]
          }`}
        >
          {selectedPackage.name}
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
          Ihr empfohlenes Paket
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {packageDescription[selectedPackage.name]}
        </p>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-base text-gray-500 font-medium">
            Monatlicher Preis
          </span>
          <span className="text-3xl font-extrabold text-indigo-600">
            {formatCHF(monthlyPriceCHF)}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-base text-gray-500 font-medium">
            Jährlicher Preis
          </span>
          <span className="text-xl font-bold text-gray-800">
            {formatCHF(annualPriceCHF)}
          </span>
        </div>
      </div>

      {/* <PriceBreakdown result={result} /> */}
    </div>
  );
};

/**
 * Component to display the detailed price breakdown.
 */
const PriceBreakdown: React.FC<ResultCardProps> = ({ result }) => {
  const {
    selectedPackage,
    basePriceComponent,
    bookingSurcharge,
    employeeSurcharge,
    extraBookings,
    extraEmployees,
  } = result;

  return (
    <div className="mt-6 pt-4 border-t border-gray-100 text-sm">
      <h3 className="font-semibold text-gray-700 mb-3">Preiszusammenfassung</h3>
      <ul className="space-y-2 text-gray-600">
        <li className="flex justify-between">
          <span>Basispreis ({selectedPackage.name})</span>
          <span className="font-medium">{formatCHF(basePriceComponent)}</span>
        </li>
        {bookingSurcharge > 0 && (
          <li className="flex justify-between text-yellow-700">
            <span>Zuschlag Buchungen ({extraBookings} zusätzlich)</span>
            <span className="font-medium">{formatCHF(bookingSurcharge)}</span>
          </li>
        )}
        {employeeSurcharge > 0 && (
          <li className="flex justify-between text-yellow-700">
            <span>Zuschlag Mitarbeitende ({extraEmployees} zusätzlich)</span>
            <span className="font-medium">{formatCHF(employeeSurcharge)}</span>
          </li>
        )}
        <li className="flex justify-between font-bold border-t pt-2 mt-2 border-gray-200 text-gray-800">
          <span>Gesamtpreis Monatlich</span>
          <span>
            {formatCHF(
              basePriceComponent + bookingSurcharge + employeeSurcharge
            )}
          </span>
        </li>
      </ul>
    </div>
  );
};

// Default state matching the minimal requirements for calculation
const initialUserInput: UserInput = {
  buchungenProMonat: 20, // Example: 20/month * 12 = 240/year (STARTER range)
  anzahlMitarbeitende: 1, // Example: 1 (STARTER range)
  mehrwertsteuerStatus: MwstStatus.BALANCE,
  rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
};

/**
 * Main Application Component (equivalent to the user's `Calculator` component).
 */
export const Calculator = () => {
  const [input, setInput] = React.useState<UserInput>(initialUserInput);

  // Memoize the calculation for performance
  const result = React.useMemo(() => {
    // Ensure minimum values are met before calculation
    const safeInput: UserInput = {
      ...input,
      buchungenProMonat: Math.max(0, input.buchungenProMonat),
      anzahlMitarbeitende: Math.max(0, input.anzahlMitarbeitende),
    };
    return calculateFullPrice(safeInput);
  }, [input]);

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* --- Left Column: Input Form --- */}
        <div className="p-8 sm:p-10 space-y-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Leistungs- und Preisrechner
          </h1>
          <p className="text-gray-500">
            Passen Sie die Werte an, um Ihr empfohlenes Paket und den
            monatlichen Preis zu sehen.
          </p>

          <div className="space-y-6">
            <NumberInput
              label="Monatliche Buchungen (Zahlungsein- und -ausgänge)"
              value={input.buchungenProMonat}
              unit="Buchungen/Monat"
              onChange={(val) => handleInputChange("buchungenProMonat", val)}
              min={0}
            />

            <NumberInput
              label="Anzahl Mitarbeitende (mit Lohn)"
              value={input.anzahlMitarbeitende}
              unit="Personen"
              onChange={(val) => handleInputChange("anzahlMitarbeitende", val)}
              min={0}
            />

            <SelectInput
              label="Mehrwertsteuer Status"
              value={input.mehrwertsteuerStatus}
              options={mwstOptions}
              onChange={(val) =>
                handleInputChange("mehrwertsteuerStatus", val as MwstStatus)
              }
            />

            <SelectInput
              label="Rechtsform"
              value={input.rechtsform}
              options={legalFormOptions}
              onChange={(val) =>
                handleInputChange("rechtsform", val as LegalForm)
              }
            />
          </div>
        </div>

        {/* --- Right Column: Results --- */}
        <div
          className={`p-8 sm:p-10 flex flex-col justify-center transition-all duration-300 ${
            result.selectedPackage.name === "STARTER"
              ? "bg-green-50"
              : result.selectedPackage.name === "SMART"
              ? "bg-blue-50"
              : result.selectedPackage.name === "COMFORT"
              ? "bg-purple-50"
              : "bg-red-50"
          }`}
        >
          <ResultCard result={result} />
        </div>
      </div>
    </div>
  );
};
