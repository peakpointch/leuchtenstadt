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

// Define custom error messages for required fields in Step 1
const requiredMessage = "Dieses Feld ist erforderlich für die Berechnung.";

export const formSchema = z.object({
  // Step 1 Fields - Using .nonempty() for strings/selects or .min() for numbers
  bookingsPerMonth: z.string().nonempty({ message: requiredMessage }),

  employees: z.string().nonempty({ message: requiredMessage }),

  mwstStatus: z.string().nonempty({ message: requiredMessage }),

  legalForm: z.string().nonempty({ message: requiredMessage }),

  companyName: z
    .string()
    .min(3, { message: "Company name must be at least 3 characters long." }),

  email: z.email({ message: "Please enter a valid email address." }), // Zod's .email() accepts a message

  phone: z
    .string()
    .nonempty({ message: "A contact phone number is required." }),
});

/**
 * Interface representing the user input collected from the form.
 * Corresponds to Section 2 of the documentation.
 */
export type FormSchema = z.infer<typeof formSchema>;

export interface UserInput {
  bookingsPerMonth: number;
  employees: number;
  mwstStatus: MwstStatus;
  legalForm: LegalForm;
  companyName: string;
  email: string;
  phone: string;
}

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
