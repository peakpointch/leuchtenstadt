import React from "react";
import { PackageName } from "./datatypes";
import { Check } from "lucide-react";

interface DescItemProps {
  children: React.ReactNode;
}

const DescItem: React.FC<DescItemProps> = ({ children }: DescItemProps) => {
  return (
    <li className="relative mb-2 pl-7 text-gray-800">
      <Check className="absolute left-0 top-0.5 w-5 h-5 text-blue-500"></Check>
      {children}
    </li>
  );
};

export const StarterDescription: React.FC = () => {
  return (
    <ul className="list-none p-0">
      <DescItem>
        Finanzbuchhaltung
        <span className="block text-sm text-gray-500">
          bis 300 Buchungen/Jahr
        </span>
      </DescItem>
      <DescItem>
        MWST-Abrechnung
        <span className="block text-sm text-gray-500">
          halbjährlich oder keine Pflicht
        </span>
      </DescItem>
      <DescItem>Jahresabschluss</DescItem>
      <DescItem>Steuererklärung</DescItem>
      <DescItem>
        Lohnbuchhaltung
        <span className="block text-sm text-gray-500">
          für bis zu 2 Mitarbeitende
        </span>
      </DescItem>
    </ul>
  );
};

export const SmartDescription: React.FC = () => {
  return (
    <ul className="list-none p-0">
      <DescItem>
        Finanzbuchhaltung
        <span className="block text-sm text-gray-500">
          bis 600 Buchungen/Jahr
        </span>
      </DescItem>
      <DescItem>
        MWST-Abrechnung
        <span className="block text-sm text-gray-500">quartalsweise</span>
      </DescItem>
      <DescItem>Jahresabschluss</DescItem>
      <DescItem>Steuererklärung</DescItem>
      <DescItem>
        Lohnbuchhaltung
        <span className="block text-sm text-gray-500">
          für bis zu 6 Mitarbeitende
        </span>
      </DescItem>
      <DescItem>E-Mail-Support</DescItem>
      <DescItem>Einfache Rückfragen</DescItem>
    </ul>
  );
};

export const ComfortDescription: React.FC = () => {
  return (
    <ul className="list-none p-0">
      <DescItem>
        Finanzbuchhaltung
        <span className="block text-sm text-gray-500">
          bis 600 Buchungen/Jahr
        </span>
      </DescItem>
      <DescItem>
        MWST-Abrechnung
        <span className="block text-sm text-gray-500">quartalsweise</span>
      </DescItem>
      <DescItem>Jahresabschluss</DescItem>
      <DescItem>Steuererklärung</DescItem>
      <DescItem>
        Lohnbuchhaltung
        <span className="block text-sm text-gray-500">
          für bis zu 10 Mitarbeitende
        </span>
      </DescItem>
      <DescItem>E-Mail-Support</DescItem>
      <DescItem>Einfache Rückfragen</DescItem>
      <DescItem>Digitale Belegverarbeitung</DescItem>
      <DescItem>
        Digitale Belegverarbeitung
        <span className="block text-sm text-gray-500">
          2 Std. / Monat inkl.
        </span>
      </DescItem>
    </ul>
  );
};

const PremiumDescription: React.FC = () => {
  return (
    <ul className="list-none p-0">
      <DescItem>
        Finanzbuchhaltung
        <span className="block text-sm text-gray-500">unlimitiert</span>
      </DescItem>
      <DescItem>
        MWST-Abrechnung
        <span className="block text-sm text-gray-500">quartalsweise</span>
      </DescItem>
      <DescItem>Jahresabschluss</DescItem>
      <DescItem>Steuererklärung</DescItem>
      <DescItem>
        Lohnbuchhaltung
        <span className="block text-sm text-gray-500">ab 10 Mitarbeitende</span>
      </DescItem>
      <DescItem>E-Mail-Support</DescItem>
      <DescItem>Einfache Rückfragen</DescItem>
      <DescItem>Digitale Belegverarbeitung</DescItem>
      <DescItem>
        Digitale Belegverarbeitung
        <span className="block text-sm text-gray-500">
          4 Std. / Monat inkl.
        </span>
      </DescItem>
    </ul>
  );
};

export const PACKAGE_COMPONENTS: Record<PackageName, React.FC> = {
  STARTER: StarterDescription,
  SMART: SmartDescription,
  COMFORT: ComfortDescription,
  PREMIUM: PremiumDescription,
};
