import { db } from "@/config/firebase";
import { useUser } from "@clerk/clerk-expo";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";

export const UserSyncProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const syncUser = async () => {
            if (!isLoaded || !user) return;

            try {
                const userRef = doc(db, "users", user.id);
                const userSnap = await getDoc(userRef);

                const userData = {
                    uid: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    displayName: user.fullName || user.username,
                    photoURL: user.imageUrl,
                    lastLoginAt: new Date().toISOString(),
                    // Only set createdAt if it doesn't exist (handled by merge, but good to be explicit for new docs)
                };

                if (userSnap.exists()) {
                    // Update existing user
                    await setDoc(userRef, {
                        ...userData,
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                } else {
                    // Create new user
                    await setDoc(userRef, {
                        ...userData,
                        createdAt: new Date().toISOString()
                    });
                }

                console.log("User synced to Firestore:", user.id);

            } catch (error) {
                console.error("Error syncing user to Firestore:", error);
            }
        };

        syncUser();
    }, [user, isLoaded]);

    return <>{children}</>;
};
