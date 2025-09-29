// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Tourn } from '$lib/schemas/tourn';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      tourn: Tourn;
    }
    // interface PageState {}
    // interface Platform {}
  }
  T;
}

export {};
