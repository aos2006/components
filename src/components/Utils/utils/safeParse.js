export default function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}
