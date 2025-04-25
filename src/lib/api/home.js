export async function Total_Product() {
  const response = await fetch(
    "http://localhost:3000/v1/api/stock/getTotalStock"
  );
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data?.message || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
}

export async function Transaction_Today() {
  const response = await fetch(
    "http://localhost:3000/v1/api/transaction/today-count"
  );
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data?.message || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
}

export async function Dead_Stock() {
  const response = await fetch(
    "http://localhost:3000/v1/api/stock/getTotal3Months"
  );
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data?.message || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
}

export async function Slow_Stock() {
  const response = await fetch("http://localhost:3000/v1/api/stock/Slow-Stock");
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data?.message || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
}

export async function Chart() {
  const response = await fetch(
    "http://localhost:3000/v1/api/transaction/12LastMonth"
  );
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data?.message || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
}
