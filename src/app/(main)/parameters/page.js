import ParametersUI from "@/components/parameters/ParametersUI";

export default function ParametersPage() {
  return (
    <div className="text-black h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Parameters Management
      </h1>
      <ParametersUI />
    </div>
  );
}
