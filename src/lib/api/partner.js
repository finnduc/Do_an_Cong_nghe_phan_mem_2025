import { authFetch } from "../auth/authWrapper";

export async function fetchPartner(limit, page, extraParams = {}) {
  const params = {
    limit,
    page,
    ...extraParams,
  };
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );
  const query = new URLSearchParams(cleanedParams).toString();
  const data = await authFetch(
    `/v1/api/partner/getAll?${query}`,
    {
      method: "GET",
    }
  );
  return data;
}

export async function createPartner(PartnerData) {
  const data = await authFetch(`/v1/api/partner/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(PartnerData),
  });
  return data;
}

export async function updatePartner(PartnerData) {
  const data = await authFetch(`/v1/api/partner/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(PartnerData),
  });
  return data;
}

export async function deletePartner(PartnerIds) {
  // 1. Xử lý PartnerIds:
  const ids = Array.isArray(PartnerIds) ? PartnerIds : [PartnerIds];
  if (ids.length === 0) {
    throw new Error("Chưa chọn đối tác để xóa.");
  }

  // 2. Tạo query parameters:
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("partner_id", id)); // Đúng key "partner_id"

  // 3. Thiết lập options với phương thức DELETE:
  const options = {
    method: "DELETE", // Đúng phương thức
  };

  // 4. Gọi API:
  const data = await authFetch(
    `/v1/api/partner/delete?${params.toString()}`, // URL với query string đúng
    options
  );

  return data;
}
export async function searchPartners(searchTerm, page, limit = 11) {
    const queryParams = new URLSearchParams({ page, limit }).toString();
    
    const data = await authFetch(
        `/v1/api/partner/search?${queryParams}`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ search: searchTerm }), // Gửi search term trong body
        }
    );
    return data;
}
