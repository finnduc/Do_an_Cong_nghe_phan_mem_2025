import { authFetch } from "../auth/authWrapper";

export async function generateSQL(question) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  };
  const data = await authFetch(`${process.env.FASTAPI_URL}/question`, options);
  return data;
}

export async function executeSQL(sqlQuery, offset = 0, forceOffset = false) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql: sqlQuery, offset, force_offset: forceOffset }),
  };
  const data = await authFetch(`${process.env.FASTAPI_URL}/execute`, options);
  return data;
}
