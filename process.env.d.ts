declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_ENDPOINT: string;
			NODE_ENV: "development" | "production";
			NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
			NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
