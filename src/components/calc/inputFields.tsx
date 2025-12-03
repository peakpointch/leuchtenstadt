export interface InputFieldProps {
  label: string;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
  min: number;
  placeholder?: string;
  isInvalid: boolean;
}

/**
 * Component for number inputs (Buchungen and Mitarbeiter).
 */
export const NumberInput: React.FC<InputFieldProps> = ({
  label,
  value,
  unit,
  onChange,
  min,
  placeholder,
  isInvalid,
}) => (
  <div className="flex flex-col space-y-2">
    <label className=" font-medium text-gray-700">{label}</label>
    <div className="relative flex items-center">
      <input
        type="number"
        min={min}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 ${
          isInvalid ? "border-red-500" : ""
        }`}
      />
      <span className="absolute pr-9 right-0 top-0 bottom-0 flex items-center text-gray-500 text-sm select-none pointer-events-none">
        {unit}
      </span>
    </div>
    {isInvalid && (
      <p className="text-xs text-red-500">Dieses Feld ist erforderlich.</p>
    )}
  </div>
);

interface SelectFieldProps {
  label: string;
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
  isInvalid: boolean;
}

/**
 * Component for select inputs (MWST and Legal Form).
 */
export const SelectInput: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
  isInvalid,
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:border-blue-500 focus:ring-blue-500 transition duration-150 appearance-none pr-10 ${
        isInvalid ? "border-red-500" : ""
      }`}
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
    {isInvalid && (
      <p className="text-xs text-red-500">Dieses Feld ist erforderlich.</p>
    )}
  </div>
);
