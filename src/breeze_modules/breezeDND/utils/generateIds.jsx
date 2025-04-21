import generate_uuid from "../../utils/UuidGenerator";

export const generateId = (item) => {
  if (!item || typeof item !== "object") return;

  item.id = generate_uuid();

  // For MAP
  if (item.elementType === "MAP" && item.bodyConfig?.statements) {
    item.bodyConfig.statements.forEach((statement) => {
      generateId(statement);
      if (statement.value) generateId(statement.value);
    });
  }

  // For CONDITIONAL
  if (item.elementType === "CONDITIONAL") {
    generateId(item.trueCase);
    generateId(item.falseCase);
  }

  // For children
  if (Array.isArray(item.children)) {
    item.children.forEach((child) => generateId(child));
  }
};
