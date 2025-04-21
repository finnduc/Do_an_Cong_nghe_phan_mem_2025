import { Button } from "./ui/button";

export const addEditButtons = (data, handleEdit, handleDelete) => {
    
  return data.map((item, index) => ({
    ...item,
    edit: (
      <div className="flex gap-2">
        <Button
          className="text-blue-500 bg-white border-[1px] border-blue-500 hover:bg-blue-500 hover:text-white "
          onClick={() => handleEdit(item, index)}
        >
          Edit
        </Button>
        <Button
          className="text-red-500 bg-white border-[1px] border-red-500 hover:bg-red-500 hover:text-white "
          onClick={() => handleDelete(item, index)}
        >
          Delete
        </Button>
      </div>
    ),
  }));
};