import ParametersUI from "@/components/parameters/ParametersUI";
import { fetchCatetories, fetchManufacturers } from "@/lib/api/parameters";

export default async function ParametersPage() {
  const categories = await fetchCatetories();
  const manufacturers = await fetchManufacturers();
  return (
    <div className="text-black h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Parameters Management
      </h1>
      <ParametersUI categories={categories?.metadata} manufacturers={manufacturers?.metadata}/>
    </div>
  );
}
