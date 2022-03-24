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
			if (savedCallback.current !== undefined) {
				savedCallback.current();
			}
		};
		if (delay !== null) {
			const id = setTimeout(tick, delay);

			return () => clearTimeout(id);
		}
		return;
	}, [delay]);
};

export default useTimeout;
