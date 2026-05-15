export function serializeSimulationPayload(payload) {
  return JSON.stringify(payload);
}

export function deserializeSimulationPayload(payload) {
  if (typeof payload !== "string") {
    return payload;
  }

  try {
    return JSON.parse(payload);
  } catch {
    return {};
  }
}
