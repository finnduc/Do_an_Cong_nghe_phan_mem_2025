export async function fetchHistories(page, limit = 6, extraParams = {}) {
  const payload = {
    page: page,
    limit: limit,
    ...extraParams,
  };

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v != null)
  );

  const query = new URLSearchParams(cleanedPayload).toString();

  const response = await fetch(
    `http://localhost:3000/v1/api/transaction/getTransaction?${query}`
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail);
  return data;
}
