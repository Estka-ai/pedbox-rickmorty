export const authEvents = new EventTarget();

export const UNAUTHORIZED_EVENT = 'unauthorized';

export function emitUnauthorized() {
  authEvents.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}
