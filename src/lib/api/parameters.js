import { authFetch } from "../auth/authWrapper";

export async function fetchCatetories() {
  const data = await authFetch(
    `/v1/api/parameter/getCate`
  );

  return data;
}

export async function fetchManufacturers() {
  const data = await authFetch(
    `/v1/api/parameter/getManu`
  );

  return data;
}

export async function fetchProducts(page, limit=1000 ) {
  const payload = {
    page: page,
    limit: limit,
  };
  const query = new URLSearchParams(payload).toString();
  const data = await authFetch(
    `/v1/api/parameter/getAll?${query}`
  );

  return data;
}

export async function updateCategory(category_id, name) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category_id: category_id, category: name }),
  };
  const data = await authFetch(
    `/v1/api/parameter/updateCate`,
    options
  );
  return data;
}

export async function createCategory(name) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: name }),
  };
  const data = await authFetch(
    `/v1/api/parameter/createCate`,
    options
  );
  return data;
}

export async function deleteCategory(category_id) {
  const options = {
    method: "DELETE", // Đổi thành DELETE
    headers: {
      "Content-Type": "application/json", // Vẫn cần header này vì gửi body JSON
    },
    body: JSON.stringify({ category_id }), // Truyền category_id trong body
  };
  const data = await authFetch(
    `/v1/api/parameter/deleteCate`, // URL giữ nguyên
    options
  );
  return data;
}

export async function createManufacturer(name) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ manufacturer: name }),
  };
  const data = await authFetch(
    `/v1/api/parameter/createManu`,
    options
  );
  return data;
}

export async function updateManufacturer(manufacturer_id, name) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ manufacturer_id, manufacturer: name }),
  };
  const data = await authFetch(
    `/v1/api/parameter/updateManu`,
    options
  );
  return data;
}

export async function deleteManufacturer(manufacturer_id) {
  const options = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ manufacturer_id }),
  };
  const data = await authFetch(
    `/v1/api/parameter/deleteManu`,
    options
  );
  return data;
}

export async function createProduct(productData) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  };
  const data = await authFetch(
    `/v1/api/parameter/create`,
    options
  );
  return data;
}

export async function updateProduct(productData) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  };
  const data = await authFetch(
    `/v1/api/parameter/update`,
    options
  );
  return data;
}

export async function deleteProduct(parameter_id) {
  const options = {
    method: "DELETE",
  };
  const query = new URLSearchParams({ parameter_id }).toString();
  const data = await authFetch(
    `/v1/api/parameter/delete?${query}`,
    options
  );
  return data;
}
