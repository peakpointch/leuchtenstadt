export const FormSuccess: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between space-y-8">
      <div className="space-y-8">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Berechnen Sie jetzt Ihre{" "}
          <em className="italic text-brand-500">Treuhand-Offerte</em>
        </h2>
        <div className="text-gray-700 space-y-8">
          <div className="text-center font-medium text-green-800 bg-green-50 border border-solid border-green-300 rounded-sm p-4">
            Vielen Dank, wir haben Ihre Anfrage erhalten!
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSuccess;
