
const entities = {}
const entityDetails = {
  "2ca2043f_1564_453d_84e7_8815f6dc2366": {
    "exportedAs": "Main",
    "from": "/src/components/Main.jsx",
    "default": true
  },
  "bd8ed63d_1345_4b47_8de8_d6892d4c6f00": {
    "exportedAs": "Layout",
    "from": "/src/components/Layout.jsx",
    "default": true
  },
  "e56eabc1_6b5c_42e8_89de_b5b97a402f40": {
    "exportedAs": "App",
    "from": "/src/App.jsx",
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

