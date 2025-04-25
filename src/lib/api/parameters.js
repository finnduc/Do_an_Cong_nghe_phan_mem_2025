import { authFetch } from "../auth/authWrapper";

export async function fetchCatetories() {
  const data = await authFetch(
    "http://localhost:3000/v1/api/parameter/getCate"
  );

  return data;
}

export async function fetchManufacturers() {
  const data = await authFetch(
    "http://localhost:3000/v1/api/parameter/getManu"
  );

  return data;
}

export async function fetchProducts(page, limit = 8) {
  const payload = {
    page: page,
    limit: limit,
  };
  const query = new URLSearchParams(payload).toString();
  const data = await authFetch(
    `http://localhost:3000/v1/api/parameter/getAll?${query}`
  );

  return data;
}

export async function updateCategory(id, name) {
  options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name }),
  };
  const data = await authFetch(
    "http://localhost:3000/v1/api/parameter/updateCate",
    options
  );

  return data;
}
