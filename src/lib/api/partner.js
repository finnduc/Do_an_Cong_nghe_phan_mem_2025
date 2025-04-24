const { error } = require("console");


const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok){
    const errorMessage = data?.message;
    throw new Error(errorMessage);
  }
  return data;
};

export async function fetchPartner(page , limit , extraParams={}){
  const params = {
    page,
    limit,
    ...extraParams,
  }
  const query = new URLSearchParams(params).toString();
  const response = fetch('')

}