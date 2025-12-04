import { formatCHF } from "./core";
import { CalculationResult } from "./datatypes";
import { PACKAGE_COMPONENTS } from "./packages";

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

      {/* <PackagePrice result={result} /> */}
    </div>
  );
};
