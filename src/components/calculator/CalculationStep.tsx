import { Controller, UseFormReturn } from "react-hook-form";
import { FormSchema } from "./datatypes";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";

export interface CalculationStepProps {
  form: UseFormReturn<FormSchema, any, any>;
  handleCalculate: () => void;
}

export const CalculationStep: React.FC<CalculationStepProps> = ({
  form,
  handleCalculate: handleButtonClick,
}) => (
  <>
    <h2 className="text-4xl font-extrabold text-gray-800">
      Berechnen Sie jetzt Ihre{" "}
      <em className="italic text-brand-500">Treuhand-Offerte</em>
    </h2>
    <p className="text-gray-500">
      Passen Sie die Werte an, um Ihr empfohlenes Paket und den monatlichen
      Preis zu sehen.
    </p>

    <div className="space-y-6">
      <Controller
        name="bookingsPerMonth"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Wie viele Buchungen pro Monat haben Sie?
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              placeholder="Zahl eingeben"
              min={0}
              autoComplete="off"
              aria-invalid={fieldState.invalid}
              onInput={(e) => {
                field.onChange(e);
                form.clearErrors(field.name);
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="employees"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Wie viele Personen erhalten einen Lohn?
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              placeholder="Zahl eingeben"
              min={0}
              autoComplete="off"
              aria-invalid={fieldState.invalid}
              onInput={(e) => {
                field.onChange(e);
                form.clearErrors(field.name);
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="mwstStatus"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Sind Sie für die Mehrwertsteuer angemeldet?
            </FieldLabel>
            <NativeSelect
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              onInput={(e) => {
                field.onChange(e);
                form.clearErrors(field.name);
              }}
            >
              <NativeSelectOption value="">Bitte anwählen</NativeSelectOption>
              <NativeSelectOption value={MwstStatus.NONE}>
                {MwstStatus.NONE}
              </NativeSelectOption>
              <NativeSelectOption value={MwstStatus.BALANCE}>
                {MwstStatus.BALANCE}
              </NativeSelectOption>
              <NativeSelectOption value={MwstStatus.EFFECTIVE}>
                {MwstStatus.EFFECTIVE}
              </NativeSelectOption>
              <NativeSelectOption value={MwstStatus.UNKNOWN}>
                {MwstStatus.UNKNOWN}
              </NativeSelectOption>
            </NativeSelect>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="legalForm"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Welche Rechtsform hat Ihr Unternehmen?
            </FieldLabel>
            <NativeSelect
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              onInput={(e) => {
                field.onChange(e);
                form.clearErrors(field.name);
              }}
            >
              <NativeSelectOption value="">Bitte anwählen</NativeSelectOption>
              <NativeSelectOption value={LegalForm.AG}>
                {LegalForm.AG}
              </NativeSelectOption>
              <NativeSelectOption value={LegalForm.GMBH}>
                {LegalForm.GMBH}
              </NativeSelectOption>
              <NativeSelectOption value={LegalForm.SOLE_PROPRIETORSHIP}>
                {LegalForm.SOLE_PROPRIETORSHIP}
              </NativeSelectOption>
            </NativeSelect>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* <SelectInput */}
      {/*   label="Sind Sie für die Mehrwertsteuer angemeldet?" */}
      {/*   value={input.mehrwertsteuerStatus} */}
      {/*   options={mwstOptions} */}
      {/*   onChange={(val) => */}
      {/*     handleInputChange("mehrwertsteuerStatus", val as MwstStatus) */}
      {/*   } */}
      {/*   isInvalid={validationErrors.has("mehrwertsteuerStatus")} */}
      {/* /> */}
      {/**/}
      {/* <SelectInput */}
      {/*   label="Welche Rechtsform hat Ihr Unternehmen?" */}
      {/*   value={input.rechtsform} */}
      {/*   options={legalFormOptions} */}
      {/*   onChange={(val) => handleInputChange("rechtsform", val as LegalForm)} */}
      {/*   isInvalid={validationErrors.has("rechtsform")} */}
      {/* /> */}
    </div>
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="default" type="button" onClick={handleButtonClick}>
          Jetzt berechnen
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </>
);

export default CalculationStep;
