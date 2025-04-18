export async function generateSQL(question) {
    const response = await fetch("http://localhost:8000/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);
      return data;
}

export async function executeSQL(sqlQuery) {
    const response = await fetch("http://localhost:8000/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql: sqlQuery }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail);
  return data;
}