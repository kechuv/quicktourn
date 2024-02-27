// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			newTournModal: boolean
		}
		// interface Platform {}
	}

	type SetRequired<T, TReq extends keyof T = keyof T> = T & { [Prop in TReq]-?: T[Prop] }
	type OptionalExcept<T, TOpt extends keyof T = keyof T> = SetRequired<Partial<T>, TOpt>

	type SetOptional<T, TReq extends keyof T = keyof T> = Omit<T, TReq> & { [Prop in Treq]+?: T[Prop] }
	type RequiredExcept<T, TReq extends keyof T = keyof T> = SetOptional<Required<T>, TReq>
}

export {};
