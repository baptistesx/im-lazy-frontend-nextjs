import { useEffect, useRef } from "react";

//@see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (callback: () => void, delay: number): void => {
	const savedCallback = useRef<(...args: unknown[]) => void>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		const tick = (): void => {
			if (savedCallback.current !== undefined) {
				savedCallback.current();
			}
		};
		if (delay !== null) {
			const id = setInterval(tick, delay);

			return () => clearInterval(id);
		}
		return;
	}, [delay]);
};

export default useInterval;
