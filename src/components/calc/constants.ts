import { PackageName, PricingPackage } from "./datatypes";

export const PACKAGE_CONFIG: Record<PackageName, PricingPackage> = {
  STARTER: {
    name: "STARTER",
    basePrice: 250,
    booksIncludedMonthly: 0, // Formula: 250 + (books * 6) -> all books are charged
    pricePerExtraBook: 6.0,
    employeesIncluded: 0, // Formula: 250 + (employees * 49.50) -> all employees are charged
    pricePerExtraEmployee: 49.5,
  },
  SMART: {
    name: "SMART",
    basePrice: 500,
    booksIncludedMonthly: 25, // CHF 5.98 (ab 26.)
    pricePerExtraBook: 5.98,
    employeesIncluded: 2, // CHF 37.25 (ab 3.)
    pricePerExtraEmployee: 37.25,
  },
  COMFORT: {
    name: "COMFORT",
    basePrice: 800,
    booksIncludedMonthly: 50, // CHF 5.00 (ab 51.)
    pricePerExtraBook: 5.0,
    employeesIncluded: 6, // CHF 62.25 (ab 7.)
    pricePerExtraEmployee: 62.25,
  },
  PREMIUM: {
    name: "PREMIUM",
    basePrice: 1300,
    booksIncludedMonthly: 100, // CHF 5.00 (ab 101.)
    pricePerExtraBook: 5.0,
    employeesIncluded: 10, // CHF 75.00 (ab 11.)
    pricePerExtraEmployee: 75.0,
  },
};
