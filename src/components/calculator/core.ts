import { PACKAGE_CONFIG } from "./constants";
import {
  CalculationResult,
  MwstStatus,
  PackageName,
  PricingPackage,
  UserInput,
} from "./datatypes";

/**
 * Determines the correct service package based on user input.
 * Implements the "höchstes zutreffendes Paket" principle (Section 4).
 *
 * @param input The user form input.
 * @returns The name of the determined package.
 */
export function determinePackage(input: UserInput): PackageName {
  const {
    bookingsPerMonth: buchungenProMonat,
    employees: anzahlMitarbeitende,
    mwstStatus: mehrwertsteuerStatus,
  } = input;
  const calc_buchungen_jahr = buchungenProMonat * 12;

  let determinedPackage: PackageName = "STARTER";

  // 4.4 PREMIUM: Conditions (EINES muss erfüllt sein)
  if (calc_buchungen_jahr > 1200 || anzahlMitarbeitende > 10) {
    return "PREMIUM";
  }

  // 4.3 COMFORT: Conditions (EINE Gruppe muss erfüllt sein)
  // Note: The logic for "höchstes zutreffendes Paket" means we check from highest to lowest.
  // However, the conditions must be precise based on the documentation's ranges.

  // Group 1-Ausgelöst durch Buchungen: 601-1'200 bookings AND Mitarbeitende <= 10
  if (
    calc_buchungen_jahr > 600 &&
    calc_buchungen_jahr <= 1200 &&
    anzahlMitarbeitende <= 10
  ) {
    determinedPackage = "COMFORT";
  }

  // Group 2-Ausgelöst durch Mitarbeiter: 7-10 employees AND Buchungen/Jahr <= 1'200
  if (
    anzahlMitarbeitende > 6 &&
    anzahlMitarbeitende <= 10 &&
    calc_buchungen_jahr <= 1200
  ) {
    determinedPackage = "COMFORT";
  }

  // If COMFORT was determined, we stop here and return it.
  if (determinedPackage === "COMFORT") {
    return "COMFORT";
  }

  // 4.2 SMART: Conditions (EINE Gruppe muss erfüllt sein)
  // Note: If COMFORT was triggered, we wouldn't reach this section.

  // Group 1-Ausgelöst durch Buchungen: 301-600 bookings AND Mitarbeitende <= 6
  if (
    calc_buchungen_jahr > 300 &&
    calc_buchungen_jahr <= 600 &&
    anzahlMitarbeitende <= 6
  ) {
    determinedPackage = "SMART";
  }

  // Group 2- Ausgelöst durch Mitarbeiter: 3-6 employees AND Buchungen/Jahr <= 600
  if (
    anzahlMitarbeitende > 2 &&
    anzahlMitarbeitende <= 6 &&
    calc_buchungen_jahr <= 600
  ) {
    determinedPackage = "SMART";
  }

  // Group 3-Ausgelöst durch MWST-Art: MWST = "Effektive Abrechnungsmethode" AND Bookings <= 600 AND Employees <= 6
  if (
    mehrwertsteuerStatus === MwstStatus.EFFECTIVE &&
    calc_buchungen_jahr <= 600 &&
    anzahlMitarbeitende <= 6
  ) {
    determinedPackage = "SMART";
  }

  // Group 4-Ausgelöst durch MWST-Unsicherheit: MWST = "Ich weiss es nicht" AND Bookings <= 600 AND Employees <= 6
  if (
    mehrwertsteuerStatus === MwstStatus.UNKNOWN &&
    calc_buchungen_jahr <= 600 &&
    anzahlMitarbeitende <= 6
  ) {
    determinedPackage = "SMART";
  }

  // If SMART was determined, we stop here and return it.
  if (determinedPackage === "SMART") {
    return "SMART";
  }

  // 4.1 STARTER: Conditions (ALLE müssen erfüllt sein)
  // We only need to check the conditions that *prevent* STARTER, as it's the default.
  // MWST conditions for STARTER: MWST is NOT "Effektive Abrechnungsmethode" AND NOT "Ich weiss es nicht".
  // MWST conditions based on Section 1 Table: "Keine / Saldo"

  const isStarterMwst =
    mehrwertsteuerStatus !== MwstStatus.EFFECTIVE &&
    mehrwertsteuerStatus !== MwstStatus.UNKNOWN;

  const isStarterCriteriaMet =
    calc_buchungen_jahr <= 300 && anzahlMitarbeitende <= 2 && isStarterMwst;

  // If we passed all higher checks, and STARTER criteria are met, it remains STARTER.
  // If STARTER criteria are *not* met, but SMART/COMFORT/PREMIUM were not triggered (e.g., mismatching MWST + employee criteria),
  // the "höchstes zutreffendes Paket" principle implies STARTER is the baseline, but the MWST logic is tricky.
  // Following the structure: if the inputs meet STARTER's limits AND MWST rule, it's STARTER.
  // Since we've already checked and excluded SMART/COMFORT/PREMIUM, if the inputs fall below all those thresholds,
  // they are likely in the STARTER range (Bookings <= 300, Employees <= 2).

  // Re-evaluating based on "höchstes zutreffendes Paket":
  // The previous checks handled all up-scaling cases (PREMIUM, COMFORT, SMART).
  // If we reach this point, none of the upgrade conditions were met, so the package is STARTER by default.

  // Final check for STARTER based on limits (Bookings <= 300 AND Employees <= 2)
  if (calc_buchungen_jahr <= 300 && anzahlMitarbeitende <= 2) {
    return "STARTER";
  }

  // This handles scenarios that fall between SMART and STARTER's explicit MWST overrides.
  // For safety, we return the highest package found, which is currently `determinedPackage`.
  return determinedPackage;
}

/**
 * Calculates the monthly and annual price for the determined package and input.
 * Implements the Priceberechnungsformeln (Section 5 & 6).
 *
 * @param input The user form input.
 * @param pkg The selected pricing package configuration.
 * @returns The detailed calculation result.
 */
export function calculatePrice(
  input: UserInput,
  pkg: PricingPackage
): CalculationResult {
  const {
    bookingsPerMonth: buchungenProMonat,
    employees: anzahlMitarbeitende,
  } = input;

  // --- 1. Calculate Surcharges ---

  // Variable surcharge for bookings
  const extraBookings = Math.max(
    0,
    buchungenProMonat - pkg.booksIncludedMonthly
  );
  const bookingSurcharge = extraBookings * pkg.pricePerExtraBook;

  // Variable surcharge for employees
  const extraEmployees = Math.max(
    0,
    anzahlMitarbeitende - pkg.employeesIncluded
  );
  const employeeSurcharge = extraEmployees * pkg.pricePerExtraEmployee;

  // --- 2. Calculate Total Price ---
  const monthlyPrice = pkg.basePrice + bookingSurcharge + employeeSurcharge;
  const annualPrice = monthlyPrice * 12;

  // --- 3. Format and Return Result ---
  return {
    selectedPackage: pkg,
    monthlyPriceCHF: parseFloat(monthlyPrice.toFixed(2)),
    annualPriceCHF: parseFloat(annualPrice.toFixed(2)),
    annualBookings: buchungenProMonat * 12,
    extraBookings,
    extraEmployees,
    basePriceComponent: pkg.basePrice,
    bookingSurcharge: parseFloat(bookingSurcharge.toFixed(2)),
    employeeSurcharge: parseFloat(employeeSurcharge.toFixed(2)),
  };
}

/**
 * Main function to run the full calculation.
 * @param input The user form input.
 * @returns The full calculation result.
 */
export function calculateFullPrice(input: UserInput): CalculationResult {
  // 1. Determine the package
  const packageName = determinePackage(input);
  const selectedPackage = PACKAGE_CONFIG[packageName];

  // 2. Calculate the price
  return calculatePrice(input, selectedPackage);
}

// Helper function to format currency
export const formatCHF = (amount: number) => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
