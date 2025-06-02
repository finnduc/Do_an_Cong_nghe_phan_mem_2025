import { Button } from "./ui/button";

export const addEditButtons = (data, handleEdit, handleDelete, disableDelete = false) => {
  return data.map((item, index) => {
    const editButton = (
      <Button
        className="text-blue-500 bg-white border p-2 border-blue-500 hover:bg-blue-500 hover:text-white"
        onClick={() => handleEdit(item, index)}
      >
        Edit
      </Button>
    );

    const deleteButton = !disableDelete ? (
      <Button
        className="text-red-500 bg-white border p-2 border-red-500 hover:bg-red-500 hover:text-white"
        onClick={() => handleDelete(item, index)}
      >
        Delete
      </Button>
    ) : null;

    return {
      ...item,
      actions: (
        <div className="flex gap-2">
          {editButton}
          {deleteButton}
        </div>
      ),
    };
  });
};
