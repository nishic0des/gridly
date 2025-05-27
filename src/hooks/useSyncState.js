import { useState, useEffect } from "react";

export function useSyncState() {
	const [syncState, setSyncState] = useState({
		isSyncing: false,
		lastSync: null,
		error: null,
		pendingChanges: false,
	});

	return {
		...syncState,
		startSync: () =>
			setSyncState((prev) => ({ ...prev, isSyncing: true, error: null })),
		completeSync: () =>
			setSyncState((prev) => ({
				...prev,
				isSyncing: false,
				lastSync: new Date(),
				pendingChanges: false,
			})),
		setError: (error) =>
			setSyncState((prev) => ({
				...prev,
				isSyncing: false,
				error: error,
				lastSync: new Date(),
			})),
		setPendingChanges: (pending) =>
			setSyncState((prev) => ({
				...prev,
				pendingChanges: pending,
			})),
	};
}
