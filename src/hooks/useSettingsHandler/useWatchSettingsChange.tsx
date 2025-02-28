import { useEffect } from "react";

import { SettingsChangeEventName } from "src/assets/constants";

export const useWatchSettingsChange = (
	handler: (event: CustomEvent) => void
): void => {
	useEffect(() => {
		window.addEventListener(SettingsChangeEventName, handler);
		return () => {
			window.removeEventListener(SettingsChangeEventName, handler);
		};
	}, []);
};
