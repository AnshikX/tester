
const entities = {}
const entityDetails = {
  "4a840f4c_a0e3_455e_9b84_1c7a80697693": {
    "exportedAs": "App",
    "from": "/src/App.jsx",
    "default": true
  },
  "73b67205_bec3_4f5e_851a_cef907d6a501": {
    "exportedAs": "Layout",
    "from": "/src/components/Layout.jsx",
    "default": true
  },
  "fadbdb84_5a31_4a26_b354_3b01953554dd": {
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

