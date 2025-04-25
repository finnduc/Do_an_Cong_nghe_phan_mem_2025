import { authFetch } from "../auth/authWrapper";

export async function fetchStock(page, limit = 8, extraParams = {}) {
  const payload = {
    page: page,
    limit: limit,
    ...extraParams,
  };

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([_, v]) =>
        v !== null &&
        v !== undefined &&
        v !== "" &&
        v !== Infinity &&
        v !== -Infinity
    )
  );
  console.log(cleanedPayload);

  const query = new URLSearchParams(cleanedPayload).toString();

  const data = await authFetch(
    `http://localhost:3000/v1/api/stock/getStock?${query}`
  );

  return data;
}
