import generate_uuid from "../../utils/UuidGenerator";

// Replaces all ID placeholders in the form of ${...} with fresh UUIDs.
export const generateIdFromTemplate = (item) => {
  if (!item || typeof item !== "object") return item;

  let jsonStr = JSON.stringify(item);

  const placeholderMap = {};

  // Replace all occurrences of ${...} with new UUIDs
  jsonStr = jsonStr.replace(/\$\{([^}]+)\}/g, (_, key) => {
    if (!placeholderMap[key]) {
      placeholderMap[key] = generate_uuid();
    }
    return placeholderMap[key];
  });

  return JSON.parse(jsonStr);
};
