import { Button } from "./ui/button";

export const addEditButtons = (data, handleEdit, handleDelete) => {
  return data.map((item, index) => ({
    ...item,
    actions: (
      <div className="flex gap-2">
        <Button
          className="text-blue-500 bg-white border p-2 border-blue-500 hover:bg-blue-500 hover:text-white"
          onClick={() => handleEdit(item, index)}
        >
          Edit
        </Button>
        <Button
          className="text-red-500 bg-white border p-2 border-red-500 hover:bg-red-500 hover:text-white"
          onClick={() => handleDelete(item, index)}
        >
          Delete
        </Button>
      </div>
    ),
  }));
};
