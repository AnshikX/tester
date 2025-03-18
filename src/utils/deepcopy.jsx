export default function deepCopy(config) {
  return JSON.parse(JSON.stringify(config));
}
