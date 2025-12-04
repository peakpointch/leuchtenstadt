import * as z from "zod";

export enum MwstStatus {
  NONE = "Keine Mehrwertsteuer",
  BALANCE = "Saldo Abrechnungsverfahren",
  EFFECTIVE = "Effektive Abrechnungsmethode",
  UNKNOWN = "Ich weiss es nicht",
  ALL_METHODS = "Alle Methoden (Internal for Package Config)",
}

export enum LegalForm {
  AG = "AG (Aktiengesellschaft)",
  GMBH = "GMBH (Gesellschaft mit beschränkter Haftung)",
  SOLE_PROPRIETORSHIP = "Einzelfirma",
}

export type PackageName =
  | "STARTER"
  | "SMART"
  | "COMFORT"
  | "PREMIUM"
  | "UNKNOWN";

export const formSchema = z.object({
  bookingsPerMonth: z
    .number()
    .min(0, "Bitte geben Sie die Anzahl Buchungen pro Monat an."),
  employees: z.number().min(0, "Bitte geben Sie die Anzahl Mitarbeiter an."),
  mwstStatus: z.enum(MwstStatus),
  legalForm: z.enum(LegalForm),
  companyName: z.string().min(1, "Bitte geben Sie Ihren Firmennamen an."),
  phone: z.string().min(1, "Bitte geben Sie Ihre Telefonnummer an."),
  email: z.email(),
});

/**
 * Interface representing the user input collected from the form.
 * Corresponds to Section 2 of the documentation.
 */
export type UserInput = z.infer<typeof formSchema>;

/**
 * Interface representing the structure of a defined service package.
 * Corresponds to Section 1 & 6 of the documentation.
 */
export interface PricingPackage {
  name: PackageName;
  basePrice: number; // Basispreis
  booksIncludedMonthly: number; // Bookings included in base price (per month)
  pricePerExtraBook: number; // CHF/Buchung (variable cost)
  employeesIncluded: number; // Employees included in base price
  pricePerExtraEmployee: number; // CHF/Mitarbeiter (variable cost)
}

/**
 * Interface for the final calculated result.
 */
export interface CalculationResult {
  selectedPackage: PricingPackage;
  monthlyPriceCHF: number;
  annualPriceCHF: number;
  // Helper fields
  annualBookings: number;
  extraBookings: number;
  extraEmployees: number;
  // Breakdown
  basePriceComponent: number;
  bookingSurcharge: number;
  employeeSurcharge: number;
}
