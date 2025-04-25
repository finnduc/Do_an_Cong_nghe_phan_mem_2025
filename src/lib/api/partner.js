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
  const response = await fetch(
    `http://localhost:3000/v1/api/partner/getAll?${query}`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data?.message || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
}

export async function createPartner(PartnerData) {
  const response = await fetch(`http://localhost:3000/v1/api/partner/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(PartnerData),
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data?.message || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
}

export async function updatePartner(PartnerData) {
  const response = await fetch(`http://localhost:3000/v1/api/partner/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(PartnerData),
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data?.message || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
}

export async function deletePartner(PartnerIds) {
  const ids = Array.isArray(PartnerIds) ? PartnerIds : [PartnerIds];
  if (ids.length === 0) {
    throw new Error("Chưa chọn nhân viên để xóa.");
  }
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("partner_id", id));
  const response = await fetch(
    `http://localhost:3000/v1/api/partner/delete?${params.toString()}`,
    {
      method: "GET", 
    }
  );
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data?.message || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
};