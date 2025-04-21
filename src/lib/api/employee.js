const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1/api";

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data?.message || `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
};

export async function fetchEmployees(page, limit = 10, extraParams = {}) {
  const params = { page, limit, ...extraParams };
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );
  const query = new URLSearchParams(cleanedParams).toString();

  try {
    const response = await fetch(`${API_BASE_URL}/employee/getAll?${query}`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Lỗi khi tải danh sách nhân viên:", error);
    throw error;
  }
}

export async function createEmployee(employeeData) {
  try {
    const response = await fetch(`${API_BASE_URL}/employee/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Lỗi khi tạo nhân viên:", error);
    throw error;
  }
}

export async function updateEmployee(employeeData) {
  if (!employeeData.employee_id) {
    throw new Error("Cần có ID nhân viên để cập nhật.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/employee/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    throw error;
  }
}

export async function deleteEmployees(employeeIds) {
  const ids = Array.isArray(employeeIds) ? employeeIds : [employeeIds];
  if (ids.length === 0) {
    throw new Error("Chưa chọn nhân viên để xóa.");
  }

  const params = new URLSearchParams();
  ids.forEach(id => params.append('employee_id', id));

  try {
    const response = await fetch(`${API_BASE_URL}/employee/delete?${params.toString()}`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Lỗi khi xóa nhân viên:", error);
    throw error;
  }
}

export async function searchEmployees(searchTerm, page, limit = 10) {
  const queryParams = new URLSearchParams({ page, limit }).toString();
  const bodyPayload = { search: searchTerm };

  try {
    const response = await fetch(`${API_BASE_URL}/employee/search?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm nhân viên:", error);
    throw error;
  }
}