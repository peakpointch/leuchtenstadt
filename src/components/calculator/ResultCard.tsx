import { CalculationResult } from "./datatypes";
import { PACKAGE_COMPONENTS } from "./packages";

// Helper function to format currency
export const formatCHF = (amount: number) => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export interface ResultCardProps {
  result: Partial<CalculationResult>;
}

/**
 * Component to display the final calculated price and package.
 */
export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { selectedPackage, monthlyPriceCHF, annualPriceCHF } = result;

  const packageColors = {
    UNKNOWN: "text-blue-700",
    STARTER: "text-blue-700",
    SMART: "text-blue-700",
    COMFORT: "text-blue-700",
    PREMIUM: "text-brand-500",
  };

  const isPreview = selectedPackage.name === "UNKNOWN";

  const PackageDescription = PACKAGE_COMPONENTS[selectedPackage.name];

  return (
    <div className="@container p-6 w-full max-w-lg mx-auto bg-white border border-gray-100 rounded-xl shadow-2xl space-y-6">
      <div className="flex flex-col gap-4 @sm:flex-row justify-between @sm:items-end">
        <div className="flex flex-col items-start">
          {/* <span */}
          {/*   className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ring-2 ${ */}
          {/*     packageColors[selectedPackage.name] */}
          {/*   }`} */}
          {/* > */}
          {/*   {selectedPackage.name} */}
          {/* </span> */}
          <span className={`mt-2`}>Ihr empfohlenes Paket</span>
          <h3
            className={`mt-2 text-3xl font-medium ${
              packageColors[selectedPackage.name]
            }`}
          >
            {isPreview ? "???" : selectedPackage.name}
          </h3>
        </div>
        <div className="flex flex-col @sm:items-end">
          <span className="text-base text-gray-500 font-medium">
            Preis pro Monat
          </span>
          <span
            className={`text-3xl font-extrabold ${
              packageColors[selectedPackage.name]
            }`}
          >
            {isPreview ? "CHF ???" : formatCHF(monthlyPriceCHF)}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 space-y-4">
        {/* <div className="flex justify-between items-end"> */}
        {/*   <span className="text-base text-gray-500 font-medium"> */}
        {/*     Jährlicher Preis */}
        {/*   </span> */}
        {/*   <span className="text-xl font-bold text-gray-800"> */}
        {/*     {annualPriceCHF !== undefined ? formatCHF(annualPriceCHF) : 'N/A'} */}
        {/*   </span> */}
        {/* </div> */}
      </div>

      <PackageDescription />

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
