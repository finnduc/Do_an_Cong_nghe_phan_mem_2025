import { authFetch } from "../auth/authWrapper";

export async function Total_Product() {
  const response = await authFetch(
    "http://localhost:3000/v1/api/stock/getTotalStock"
  );
  return response;
}

export async function Transaction_Today() {
  const response = await authFetch(
    "http://localhost:3000/v1/api/transaction/today-count"
  );
  return response;
}

export async function Dead_Stock() {
  const response = await authFetch(
    "http://localhost:3000/v1/api/stock/getTotal3Months"
  );
  return response;
}

export async function Slow_Stock() {
  const response = await authFetch("http://localhost:3000/v1/api/stock/Slow-Stock");
  return response;
}

export async function Chart() {
  const response = await authFetch(
    "http://localhost:3000/v1/api/transaction/12LastMonth"
  );
  return response;
}
