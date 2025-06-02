import { authFetch } from "../auth/authWrapper";

export async function fetchImportTransaction({ page, limit = 9, ...extraParams }) {
  const payload = {
    page,
    limit,
    action: "import",
    ...extraParams,
  };

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v != null && v !== "")
  );

  const query = new URLSearchParams(cleanedPayload).toString();

  const data = await authFetch(
    `http://localhost:3000/v1/api/transaction/getTransaction?${query}`
  );

  return data;
}
    