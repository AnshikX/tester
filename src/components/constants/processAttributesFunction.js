export const getValue = (conf) => {
  if (conf.type === "OBJECT") {
    const obj = {};
    Object.entries(conf.properties).forEach(([key, value]) => {
      obj[key] = getValue(value);
    });
    return obj;
  } else if (conf.type === "ARRAY") {
    return conf.values.map((val) => getValue(val));
  } else if (conf.type === "STRING") {
    return conf.value?.value || conf.value || "";
  } else if (conf.type === "NUMBER") {
    return Number(conf.value);
  } else if (conf.type === "UNDEFINED") {
    return undefined;
  } else if (conf.type === "BOOLEAN") {
    return conf.value && conf.value != "FALSE";
  } else if (conf.type === "NULL") {
    return null;
  } else if (conf.type === "CUSTOM") {
    return conf;
  } else {
    console.log(conf);
  }
};
