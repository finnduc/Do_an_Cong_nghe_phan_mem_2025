export async function fetchHistories(page) {
    const payload = {
        page: page
      };
    const query = new URLSearchParams(payload).toString();
    const response = await fetch(`/api/your-endpoint?${query}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail);
    return data;
}