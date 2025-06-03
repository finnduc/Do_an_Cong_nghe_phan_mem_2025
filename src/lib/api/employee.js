import { authFetch } from "../auth/authWrapper";

export async function fetchEmployees(page, limit = 10, extraParams = {}) {
  const params = { page, limit, ...extraParams };
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );
  const query = new URLSearchParams(cleanedParams).toString();
  const data = await authFetch(
    `/v1/api/employee/getAll?${query}`,
    { method: "GET" }
  );
  return data;
}

export async function createEmployee(employeeData) {
  const data = await authFetch(`/v1/api/employee/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });
  return data;
}

export async function updateEmployee(employeeData) {
  if (!employeeData.employee_id) {
    throw new Error("Cần có ID nhân viên để cập nhật.");
  }
  const data = await authFetch(`/v1/api/employee/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });
  return data;
}

export async function deleteEmployees(employeeIds) {
  const ids = Array.isArray(employeeIds) ? employeeIds : [employeeIds];
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("employee_id", id));
  const options = {
    method: "DELETE", 
  };
  const data = await authFetch(
    `/v1/api/employee/delete?${params.toString()}`,
    options
  );

  return data; 
}

export async function searchEmployees(searchTerm, page, limit = 10) {
  const queryParams = new URLSearchParams({ page, limit }).toString();
  const data = await authFetch(
    `/v1/api/employee/search?${queryParams}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: searchTerm }),
    }
  );
  return data;
}

export async function GetAllUser(page, limit = 10) {
  const params = { page, limit };
  const query = new URLSearchParams(params).toString();
  const data = await authFetch(
    `/v1/api/user/getAll?${query}`,
    { method: "GET" }
  );
  return data;
}
