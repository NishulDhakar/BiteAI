import { syncUserToFirestore } from "@/utils/syncUserToFirestore";
import { useUser } from "@clerk/clerk-expo";
import { PropsWithChildren, useEffect, useRef } from "react";

export function UserSyncProvider({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn, user } = useUser();
  const syncingRef = useRef(false);
  const lastSyncedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    if (syncingRef.current || lastSyncedIdRef.current === user.id) return;

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
    if (!email) return;

    const performSync = async () => {
      try {
        syncingRef.current = true;
        await syncUserToFirestore(user);
        lastSyncedIdRef.current = user.id;
      } catch (error) {
        // Silent fail to avoid UI disruption
      } finally {
        syncingRef.current = false;
      }
    };

    performSync();
  }, [isLoaded, isSignedIn, user]);

  return children;
}
