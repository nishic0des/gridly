"use client";
import { useUser as useClerkUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useUser() {
	const { user: clerkUser, isLoaded } = useClerkUser();
	const { getToken } = useAuth();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!isLoaded) return;
		if (!clerkUser) {
			setUser(null);
			setLoading(false);
			return;
		}
		const syncUser = async () => {
			try {
				const token = await getToken();
				console.log("Token:", token);
				const response = await fetch("/api/users/sync", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (!response.ok) {
					const text = await response.text();
					throw new Error("Error syncing user: " + text);
				}
				const data = await response.json();
				setUser(data);
			} catch (error) {
				console.error("Failed to sync user:", error);
			} finally {
				setLoading(false);
			}
		};

		syncUser();
	}, [clerkUser, isLoaded, getToken]);

	return { user, loading };
}
