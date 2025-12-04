import { formatCHF } from "./core";
import { ResultCardProps } from "./ResultCard";

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
