import "colors";

export function timeLogger(...message) {
  console.log(`[${new Date().toLocaleString()}]`.cyan, ...message);
}
