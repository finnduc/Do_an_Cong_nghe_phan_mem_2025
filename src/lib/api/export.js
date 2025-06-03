import { authFetch } from "../auth/authWrapper";

export async function fetchExportTransaction(page, limit = 8, extraParams = {}) {
  const payload = {
    page: page,
    limit: limit,
    action: "export",
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
    `/v1/api/transaction/getTransaction?${query}`
  );

  return data;
}