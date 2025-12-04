import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import {
  CalculationResult,
  LegalForm,
  MwstStatus,
  FormSchema,
  formSchema,
  UserInput,
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
import { submitFormData } from "./form";
import { success } from "zod";

export interface CalcProps {}

// --- MULTI-STEP COMPONENTS ---

interface FormStepProps {
  form: UseFormReturn<FormSchema, any, any>;
  handleCalculate: () => void;
}

const InputFormStep: React.FC<FormStepProps> = ({
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

interface ConfirmationStepProps {
  form: UseFormReturn<FormSchema, any, any>;
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
          <span>
            {formatCHF(result.monthlyPriceCHF)}
            <span className="text-sm font-normal text-gray-600"> /Monat</span>
          </span>
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
        <Button type="submit" variant="default">
          Jetzt unverbindliche Offerte anfragen!
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </div>
);

export const FormSuccess: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between space-y-8">
      <div className="space-y-8">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Berechnen Sie jetzt Ihre{" "}
          <em className="italic text-brand-500">Treuhand-Offerte</em>
        </h2>
        <div className="text-gray-700 space-y-8">
          <div className="text-center font-medium text-blue-700 bg-blue-50 border border-solid border-blue-300 rounded-sm p-4">
            Vielen Dank, wir haben Ihre Anfrage erhalten!
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---

export interface CalculatorProps {
  visibility: boolean;
}

export const Calculator = ({ visibility }: CalculatorProps) => {
  const [result, setResult] = React.useState<CalculationResult | undefined>(
    undefined
  );
  const [step, setStep] = React.useState(1);

  const form = useForm<FormSchema>({
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

  const onSubmit = async (data: FormSchema) => {
    const isValid = await form.trigger();

    if (!isValid) return;

    const wfSubmission = {
      name: "Calculator",
      pageId: "692afc2a8ba6149cbeaa64bc",
      elementId: "9544fa48-c438-cf4d-5206-ae5df0ba6b4b",
      source: "https://leuchtenstadt-treuhand.webflow.io/treuhandrechner",
      test: false,
      fields: data,
      dolphin: false,
    };

    // For anyone wondering: NO, this is NOT an api key. It's a public webflow site id.
    const success = await submitFormData(
      "6905f8c5e25bdb3293105e75",
      wfSubmission
    );

    if (success) {
      // Render success state
      setStep(3);
    }
  };

  const step1Fields: Array<keyof FormSchema> = [
    "bookingsPerMonth",
    "employees",
    "mwstStatus",
    "legalForm",
  ];

  const handleCalculate = React.useCallback(async () => {
    const isValid = await form.trigger(step1Fields);

    if (!isValid) return;

    const fields = form.getValues();

    const userInput: UserInput = {
      ...(fields as any as UserInput),
      bookingsPerMonth: parseInt(fields.bookingsPerMonth),
      employees: parseInt(fields.employees),
    };

    setResult(calculateFullPrice(userInput));
    setStep(2);
  }, [form.trigger, form.getValues]);

  const handleBack = React.useCallback(() => {
    setStep(1);
  }, []);

  return visibility ? (
    <div className="w-full bg-white grid md:grid-cols-2 gap-10">
      {/* --- Left Column: Dynamic Step Content --- */}
      <form
        id="calculator"
        onSubmit={form.handleSubmit(async (data) => onSubmit(data))}
        className="space-y-8 transition-all duration-500 ease-in-out"
        data-italic-style="custom"
      >
        {step === 1 && (
          <InputFormStep form={form} handleCalculate={handleCalculate} />
        )}
        {step === 2 && result && (
          <ClosingStep form={form} onBack={handleBack} result={result} />
        )}
        {step === 3 && result && <FormSuccess />}
      </form>

      {/* --- Right Column: Results Card (Always Visible) --- */}
      <div
        className={`p-8 sm:p-10 flex flex-col justify-center rounded-xl transition-all duration-300 ${
          result?.selectedPackage?.name === "PREMIUM"
            ? "bg-brand-500"
            : "bg-blue-800"
        }`}
      >
        <ResultCard
          result={
            step !== 1
              ? result
              : {
                  selectedPackage: PACKAGE_CONFIG.UNKNOWN,
                }
          }
        />
      </div>
    </div>
  ) : (
    <></>
  );
};
