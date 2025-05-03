import { GetAllUser } from "../../../lib/api/employee";

export default async function TestPage() {
  let fetchedUsers = null;
  let usernames = [];
  let errorMessage = null;

  try {
    const apiResponse = await GetAllUser(1, 100);
    fetchedUsers = apiResponse?.metadata?.data;

    if (Array.isArray(fetchedUsers)) {
      usernames = fetchedUsers.map((user) => user.username);
    } else {
      console.log("API response data is not an array or is missing.");
    }

    console.log("Fetched usernames:", usernames);
  } catch (error) {
    console.error("Error fetching users:", error);
    errorMessage = error.message || "An error occurred while fetching users.";
  }

  return (
    <div>
      <h1>Test Get All Users</h1>
      {errorMessage && <p style={{ color: "red" }}>Error: {errorMessage}</p>}

      <h2>Usernames (JSON):</h2>
      <pre>{JSON.stringify(usernames, null, 2)}</pre>

      <h2>Usernames (List):</h2>
      {usernames.length > 0 ? (
        <ul>
          {usernames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      ) : (
        !errorMessage && <p>No usernames found.</p>
      )}
    </div>
  );
}
