import { calculateFullPrice } from "./calculator";
import { MwstStatus, LegalForm, PackageName, UserInput } from "./datatypes";

/**
 * =============================================
 * Jest unit tests: Offer calculator testing
 * =============================================
 */

describe("Package Determination Logic (determinePackage)", () => {
  // Helper function to test only the package determination based on inputs
  const determinePackageHelper = (input: UserInput): PackageName => {
    return calculateFullPrice(input).selectedPackage.name;
  };

  // 4.4 PREMIUM Tests
  it("should select PREMIUM when annual bookings exceed 1200", () => {
    // 101 bookings/month * 12 = 1212 (PREMIUM trigger)
    const input: UserInput = {
      buchungenProMonat: 101,
      anzahlMitarbeitende: 1,
      mehrwertsteuerStatus: MwstStatus.BALANCE,
      rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
    };
    expect(determinePackageHelper(input)).toBe("PREMIUM");
  });

  it("should select PREMIUM when employees exceed 10", () => {
    const input: UserInput = {
      buchungenProMonat: 10,
      anzahlMitarbeitende: 11,
      mehrwertsteuerStatus: MwstStatus.BALANCE,
      rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
    };
    expect(determinePackageHelper(input)).toBe("PREMIUM");
  });

  // 4.3 COMFORT Tests
  it("should select COMFORT when bookings are 601-1200 and employees <= 10", () => {
    // 80 bookings/month * 12 = 960 (COMFORT trigger via bookings)
    const input: UserInput = {
      buchungenProMonat: 80,
      anzahlMitarbeitende: 8,
      mehrwertsteuerStatus: MwstStatus.BALANCE,
      rechtsform: LegalForm.GMBH,
    };
    expect(determinePackageHelper(input)).toBe("COMFORT");
  });

  it("should select COMFORT when employees are 7-10 and bookings <= 1200", () => {
    const input: UserInput = {
      buchungenProMonat: 20,
      anzahlMitarbeitende: 7,
      mehrwertsteuerStatus: MwstStatus.BALANCE,
      rechtsform: LegalForm.GMBH,
    };
    expect(determinePackageHelper(input)).toBe("COMFORT");
  });

  // 4.2 SMART Tests
  it("should select SMART when bookings are 301-600 and employees <= 6", () => {
    // 35 bookings/month * 12 = 420 (SMART trigger via bookings)
    const input: UserInput = {
      buchungenProMonat: 35,
      anzahlMitarbeitende: 4,
      mehrwertsteuerStatus: MwstStatus.BALANCE,
      rechtsform: LegalForm.GMBH,
    };
    expect(determinePackageHelper(input)).toBe("SMART");
  });

  it("should select SMART when employees are 3-6 and bookings <= 600", () => {
    const input: UserInput = {
      buchungenProMonat: 10,
      anzahlMitarbeitende: 4,
      mehrwertsteuerStatus: MwstStatus.BALANCE,
      rechtsform: LegalForm.GMBH,
    };
    expect(determinePackageHelper(input)).toBe("SMART");
  });

  it('should select SMART when MWST is "Effektive Abrechnungsmethode" and criteria are within SMART limits or below', () => {
    // STARTER range criteria (books/employees) but MWST forces SMART
    const input: UserInput = {
      buchungenProMonat: 10,
      anzahlMitarbeitende: 1,
      mehrwertsteuerStatus: MwstStatus.EFFECTIVE,
      rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
    };
    expect(determinePackageHelper(input)).toBe("SMART");
  });

  it('should select SMART when MWST is "Ich weiss es nicht" and criteria are within SMART limits or below', () => {
    // STARTER range criteria (books/employees) but MWST forces SMART
    const input: UserInput = {
      buchungenProMonat: 10,
      anzahlMitarbeitende: 1,
      mehrwertsteuerStatus: MwstStatus.UNKNOWN,
      rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
    };
    expect(determinePackageHelper(input)).toBe("SMART");
  });

  // 4.1 STARTER Tests
  it("should select STARTER when MWST is BALANCE and <= 300 books and <= 2 employees", () => {
    const input: UserInput = {
      buchungenProMonat: 20,
      anzahlMitarbeitende: 1,
      mehrwertsteuerStatus: MwstStatus.BALANCE,
      rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
    };
    expect(determinePackageHelper(input)).toBe("STARTER");
  });

  // 4.1 STARTER Tests
  it("should select STARTER when MWST is NONE and <= 300 books and <= 2 employees", () => {
    const input: UserInput = {
      buchungenProMonat: 20,
      anzahlMitarbeitende: 1,
      mehrwertsteuerStatus: MwstStatus.NONE,
      rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
    };
    expect(determinePackageHelper(input)).toBe("STARTER");
  });
});

describe("Price Calculation Logic (calculateFullPrice)", () => {
  // STARTER Example: 20 Buchungen/Monat, 1 Mitarbeiter → 419.50 CHF
  it("should correctly calculate STARTER price (Example 1)", () => {
    const input: UserInput = {
      buchungenProMonat: 20,
      anzahlMitarbeitende: 1,
      mehrwertsteuerStatus: MwstStatus.BALANCE,
      rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
    };
    const result = calculateFullPrice(input);
    expect(result.selectedPackage.name).toBe("STARTER");
    expect(result.monthlyPriceCHF).toBe(419.5); // 250 + (20 * 6.00) + (1 * 49.50)
  });

  // SMART Example: 40 Buchungen/Monat, 4 Mitarbeiter → 664.20 CHF
  it("should correctly calculate SMART price (Example 2)", () => {
    const input: UserInput = {
      buchungenProMonat: 40,
      anzahlMitarbeitende: 4,
      mehrwertsteuerStatus: MwstStatus.EFFECTIVE,
      rechtsform: LegalForm.GMBH,
    };
    const result = calculateFullPrice(input);
    expect(result.selectedPackage.name).toBe("SMART");
    expect(result.monthlyPriceCHF).toBe(664.2); // 500 + (15 * 5.98) + (2 * 37.25)
  });

  // COMFORT Example: 80 Buchungen/Monat, 8 Mitarbeiter → 1074.50 CHF
  it("should correctly calculate COMFORT price (Example 3)", () => {
    const input: UserInput = {
      buchungenProMonat: 80,
      anzahlMitarbeitende: 8,
      mehrwertsteuerStatus: MwstStatus.EFFECTIVE,
      rechtsform: LegalForm.AG,
    };
    const result = calculateFullPrice(input);
    expect(result.selectedPackage.name).toBe("COMFORT");
    expect(result.monthlyPriceCHF).toBe(1074.5); // 800 + (30 * 5.00) + (2 * 62.25)
  });

  // PREMIUM Example: 150 Buchungen/Monat, 15 Mitarbeiter → 1925.00 CHF
  it("should correctly calculate PREMIUM price (Example 4)", () => {
    const input: UserInput = {
      buchungenProMonat: 150,
      anzahlMitarbeitende: 15,
      mehrwertsteuerStatus: MwstStatus.EFFECTIVE,
      rechtsform: LegalForm.AG,
    };
    const result = calculateFullPrice(input);
    expect(result.selectedPackage.name).toBe("PREMIUM");
    expect(result.monthlyPriceCHF).toBe(1925.0); // 1300 + (50 * 5.00) + (5 * 75.00)
  });

  // EDGE CASE: PREMIUM via Bookings
  it("should calculate PREMIUM correctly when triggered by high bookings (101 B/1 E)", () => {
    const input: UserInput = {
      buchungenProMonat: 101,
      anzahlMitarbeitende: 1,
      mehrwertsteuerStatus: MwstStatus.BALANCE,
      rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
    };
    const result = calculateFullPrice(input);
    expect(result.selectedPackage.name).toBe("PREMIUM");
    expect(result.monthlyPriceCHF).toBe(1305.0); // 1300 + (1 * 5.00) + (0 * 75.00)
  });

  // EDGE CASE: SMART triggered by MWST
  it("should calculate SMART correctly when triggered by effective MWST status (10 B/1 E)", () => {
    const input: UserInput = {
      buchungenProMonat: 10,
      anzahlMitarbeitende: 1,
      mehrwertsteuerStatus: MwstStatus.EFFECTIVE,
      rechtsform: LegalForm.SOLE_PROPRIETORSHIP,
    };
    const result = calculateFullPrice(input);
    expect(result.selectedPackage.name).toBe("SMART");
    expect(result.monthlyPriceCHF).toBe(500.0); // 500 + (0 * 5.98) + (0 * 37.25)
  });
});
