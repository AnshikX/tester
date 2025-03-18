
const entities = {}
const entityDetails = {
  "6f2dbbd8_0ee6_474d_8e99_0c0194790184": {
    "exportedAs": "Main",
    "from": "/src/components/Main.jsx",
    "default": true
  },
  "PROJECT_ROUTER": {
    "exportedAs": "router",
    "from": "/src/Routing.jsx",
    "default": true
  }
}



export async function loadEntity(id) {
  const { from, default: isDefault } = entityDetails[id];
  if (!entities[id]) {
    try {
      const module = await import(from);
      const entity = isDefault
        ? module.default
        : module[entityDetails[id]["exportedAs"]];
      entities[id] = entity;
    } catch (error) {
      console.error(`Failed to load ${from}:`, error);
    }
  }
  return entities[id];
}

