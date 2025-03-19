
const entities = {}
const entityDetails = {
  "397b8064_741d_40b4_b64f_390ef61c832e": {
    "exportedAs": "Testing",
    "from": "/src/components/Testing.jsx",
    "default": true
  },
  "5dca4cec_fd4d_48e2_afbf_3e2fa234dd1f": {
    "exportedAs": "asaa",
    "from": "/src/components/asaa.jsx",
    "default": true
  },
  "5e9b9ddb_ab4f_4083_9b68_a2a406f142da": {
    "exportedAs": "Main",
    "from": "/src/components/Main.jsx",
    "default": true
  },
  "PROJECT_ROUTER": {
    "exportedAs": "router",
    "from": "/src/Routing.jsx",
    "default": true
  },
  "a77d4a66_7742_43f0_a74c_63fb6413bfd2": {
    "exportedAs": "Aaaa",
    "from": "/src/components/Aaaa.jsx",
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

