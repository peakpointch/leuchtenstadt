import * as React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import {
  CalculationResult,
  LegalForm,
  MwstStatus,
  UserInput,
  formSchema,
} from "./datatypes";
import { calculateFullPrice } from "./calculator";
import { PACKAGE_CONFIG } from "./constants";
import { formatCHF, ResultCard } from "./ResultCard";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type InputKey = keyof UserInput;

export interface CalcProps {}

// --- MULTI-STEP COMPONENTS ---

interface FormStepProps {
  form: UseFormReturn<z.infer<typeof formSchema>, any, any>;
  handleButtonClick: () => void;
}

const InputFormStep: React.FC<FormStepProps> = ({
  form,
  handleButtonClick,
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

interface ConfirmationStepProps {
  form: UseFormReturn<z.infer<typeof formSchema>, any, any>;
  result: CalculationResult;
  onBack: () => void;
}

const ClosingStep: React.FC<ConfirmationStepProps> = ({
  form,
  result,
  onBack,
}) => (
  <div className="h-full flex flex-col justify-between space-y-8">
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-gray-800">
        Berechnen Sie jetzt Ihre{" "}
        <em className="italic text-brand-500">Treuhand-Offerte</em>
      </h2>
      <div className="text-gray-700 space-y-8">
        <p>Gemäss Ihren Angaben ist unsere unverbindliche Offerte:</p>
        <div className="text-center text-3xl font-bold text-blue-700 bg-brand-100 border border-solid border-brand-300 rounded-sm p-4">
          <span className="">{formatCHF(result.monthlyPriceCHF)}</span>
        </div>
        <p>
          Zufrieden mit dem Ergebnis? Fordern Sie jetzt Ihre persönliche und
          unverbindliche Offerte an.
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

    <ButtonGroup className="w-full justify-between">
      <ButtonGroup>
        <Button variant="outline" onClick={onBack}>
          zurück
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="default" onClick={onBack}>
          Jetzt unverbindliche Offerte anfragen!
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </div>
);

// --- MAIN APPLICATION COMPONENT ---

export const Calculator: React.FC = () => {
  const [result, setResult] = React.useState<CalculationResult | undefined>(
    undefined
  );
  const [step, setStep] = React.useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //@ts-ignore
      bookingsPerMonth: "",
      //@ts-ignore
      employees: "",
      //@ts-ignore
      mwstStatus: "",
      //@ts-ignore
      legalForm: "",
      companyName: "",
      phone: "",
      email: "",
    },
  });

  const fields = form.watch();

  const handleButtonClick = React.useCallback(() => {
    if (Object.values(form.formState.errors).some(Boolean)) {
      return;
    }
    const values = form.getValues();
    console.log("VALUES ON CLICK:", values);
    setResult(calculateFullPrice(values));
    setStep(2);
  }, [fields]);

  const handleBack = React.useCallback(() => {
    setStep(1);
  }, []);

  return (
    <div className="w-full bg-white grid md:grid-cols-2 gap-10">
      {/* --- Left Column: Dynamic Step Content --- */}
      <form
        id="calculator"
        className="space-y-8 transition-all duration-500 ease-in-out"
        data-italic-style="custom"
      >
        {step === 1 && (
          <InputFormStep form={form} handleButtonClick={handleButtonClick} />
        )}
        {step === 2 && result && (
          <ClosingStep form={form} onBack={handleBack} result={result} />
        )}
      </form>

      {/* --- Right Column: Results Card (Always Visible) --- */}
      <div
        className={`p-8 sm:p-10 flex flex-col justify-center rounded-xl transition-all duration-300 ${
          result?.selectedPackage?.name === "PREMIUM"
            ? "bg-brand-200"
            : "bg-blue-800"
        }`}
      >
        <ResultCard
          result={
            step === 2
              ? result
              : {
                  selectedPackage: PACKAGE_CONFIG.UNKNOWN,
                }
          }
        />
      </div>
    </div>
  );
};
