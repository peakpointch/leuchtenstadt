import { Controller, UseFormReturn } from "react-hook-form";
import { CalculationResult, FormSchema } from "./datatypes";
import { formatCHF } from "./core";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";

export interface ClosingStepProps {
  form: UseFormReturn<FormSchema, any, any>;
  result: CalculationResult;
  onBack: () => void;
}

export const ClosingStep: React.FC<ClosingStepProps> = ({
  form,
  result,
  onBack,
}) => (
  <div className="text-md h-full flex flex-col justify-between space-y-8">
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold">
        Berechnen Sie jetzt Ihre{" "}
        <em className="italic text-brand-500">Treuhand-Offerte</em>
      </h2>
      <div className="space-y-8">
        <p>Gemäss Ihren Angaben ist unsere unverbindliche Offerte:</p>
        <div className="text-center text-3xl font-bold text-blue-700 bg-brand-200 border border-solid border-brand-300 rounded-sm p-4 overflow-hidden">
          <span>
            {formatCHF(result.monthlyPriceCHF)}
            <span className="text-sm font-normal text-gray-600"> /Monat</span>
          </span>
        </div>
        <p className="">
          Zufrieden mit dem Ergebnis? Fordern Sie jetzt Ihre{" "}
          <strong>persönliche und unverbindliche Offerte</strong> an.
        </p>
      </div>
    </div>

    <div className="space-y-6">
      <Controller
        name="companyName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Der Name Ihrer Firma</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Firmenname"
              min={0}
              autoComplete="off"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="phone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Telefonnummer</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="tel"
              placeholder="079 123 45 67"
              min={0}
              autoComplete="off"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>E-Mail Adresse</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              placeholder="Ihre beste E-Mail Adresse"
              min={0}
              autoComplete="off"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* <Input label="Firmenname" placeholder="Ihr Firmenname" /> */}
      {/* <Input type="phone" label="Telefonnummer" placeholder="079 123 45 67" /> */}
      {/* <Input */}
      {/*   type="email" */}
      {/*   label="E-Mail Adresse" */}
      {/*   placeholder="Ihre beste E-Mail Adresse" */}
      {/* /> */}
    </div>

    <ButtonGroup className="w-full flex-wrap md:flex-nowrap justify-between">
      <ButtonGroup>
        <Button variant="outline" onClick={onBack}>
          zurück
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button type="submit" variant="secondary">
          Jetzt unverbindliche Offerte anfragen!
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </div>
);

export default ClosingStep;
