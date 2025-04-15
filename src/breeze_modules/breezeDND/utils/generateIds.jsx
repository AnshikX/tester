import generate_uuid from "../../utils/UuidGenerator";

export const generateId = (item) => {
  item.id = generate_uuid();
  item.children?.forEach((child) => {
    generateId(child);
  });
};
