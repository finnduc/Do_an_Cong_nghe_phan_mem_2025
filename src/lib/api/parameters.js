export async function fetchCatetories() {
  const response = await fetch(
    "http://localhost:3000/v1/api/parameter/getCate"
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail);
  return data;
}

export async function fetchManufacturers() {
  const response = await fetch(
    "http://localhost:3000/v1/api/parameter/getManu"
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail);
  return data;
}

export async function updateCategory(id, name) {
  const response = await fetch(
    "http://localhost:3000/v1/api/parameter/updateCate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail);
  return data;
}
