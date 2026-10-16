/** Next template id in the rotation, or null when the rotation is empty. */
export function nextTemplateId(rotation: number[], nextIndex: number): number | null {
  if (rotation.length === 0) return null;
  return rotation[((nextIndex % rotation.length) + rotation.length) % rotation.length];
}

/**
 * New `nextIndex` after finishing a workout. The rotation continues from
 * whichever rotation workout was actually done; workouts outside the
 * rotation (cardio, core, empty) leave it unchanged.
 */
export function afterComplete(rotation: number[], nextIndex: number, templateId: number | null): number {
  if (templateId == null || rotation.length === 0) return nextIndex;
  const current = ((nextIndex % rotation.length) + rotation.length) % rotation.length;
  // Prefer the expected slot when a template appears more than once.
  if (rotation[current] === templateId) return (current + 1) % rotation.length;
  const at = rotation.indexOf(templateId);
  return at === -1 ? nextIndex : (at + 1) % rotation.length;
}

/** New `nextIndex` after skipping the next workout. */
export function afterSkip(rotation: number[], nextIndex: number): number {
  if (rotation.length === 0) return 0;
  return (((nextIndex % rotation.length) + rotation.length) % rotation.length + 1) % rotation.length;
}
