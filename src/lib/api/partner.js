const API_BASE_URL = "http://localhost:3000/api/v1/partner";

export const getPartner = async () => {
  const response = await fetch(API_BASE_URL);
  const data = await response.json();
  return data;
};

export const getPartnerById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const data = await response.json();
  return data;
};

export const createPartner = async (partner) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(partner),
  });
  const data = await response.json();
  return data;
};

export const updatePartner = async (id, partner) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(partner),
  });
  const data = await response.json();
  return data;
};

export const deletePartner = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};

export const fetchPartner = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const data = await response.json();
  return data;
};
