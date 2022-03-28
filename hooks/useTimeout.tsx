import { useEffect, useRef } from "react";

//@see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useTimeout = (callback: () => void, delay: number): void => {
	const savedCallback = useRef<(...args: unknown[]) => void>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the timeout.
	useEffect(() => {
		const tick = (): void => {
			console.log("in tiick");
			if (savedCallback.current !== undefined) {
				savedCallback.current();
			}
		};
		if (delay !== null) {
			console.log("setting timeout", delay);
			const id = setTimeout(tick, delay);

			return () => {
				console.log("clearing timeout", delay);
				clearTimeout(id);
			};
		}
		return;
	}, [delay]);
};

export default useTimeout;
