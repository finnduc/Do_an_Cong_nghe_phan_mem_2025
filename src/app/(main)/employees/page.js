import EmployeeUI from "../../../components/employees/TableEmployee";
import { fetchEmployees } from "../../../lib/api/employee";
import CreateEmployeeForm from "../../../components/employees/CreateEmployee";

export default async function EmployeePage() {
  let initialData = [];
  let totalPages = 1;
  let totalRecords = 0;
  let error = null;
  const limit = 9;

  try {
    const response = await fetchEmployees(1, limit);
    if (response && response.metadata) {
      initialData = response.metadata.data || [];
      totalPages = response.metadata.totalPage || 1;
      totalRecords = response.metadata.total || 0;
    } else {
      throw new Error(
        "Failed to fetch initial employee data or invalid format."
      );
    }
  } catch (err) {
    console.error("Error fetching initial employees:", err);
    error = err.message || "Could not load employee data.";
  }

  return (
    <div className="flex flex-col bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Employee Management
      </h1>
      {error && (
        <div className="text-red-500 p-4 bg-red-100 border border-red-400 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 shadow-md">
          <CreateEmployeeForm />
        </div>
        <div className="flex-grow overflow-hidden">
          {!error && (
            <EmployeeUI
              initialData={initialData}
              initialTotalPages={totalPages}
              initialTotalRecords={totalRecords}
            />
          )}
        </div>
      </div>
    </div>
  );
}
