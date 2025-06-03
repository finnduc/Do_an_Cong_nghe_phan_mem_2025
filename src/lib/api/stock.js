import { authFetch } from "../auth/authWrapper";
import { convertToMySQLDateTime } from "../utils";

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
    `/v1/api/stock/getStock?${query}`
  );

  return data;
}

export async function createTransaction(transactionData) {
  transactionData = {
    ...transactionData,
    time: convertToMySQLDateTime(transactionData.time),
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  };

  const { action } = transactionData;
  const data = await authFetch(
    `/v1/api/stock/${action}`,
    options
  );
  return data;
}


export async function updateExportPrice(stock_id, export_price) {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stock_id, price_stock: export_price }),
  };
  const data = await authFetch(
    `/v1/api/stock/updatePriceExport`,
    option
  );
  return data;
}
