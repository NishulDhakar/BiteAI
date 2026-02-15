import { db } from "@/config/firebase";
import type { UserResource } from "@clerk/types";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

function buildDisplayName(user: UserResource): string {
  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();

  if (firstName || lastName) {
    return `${firstName ?? ""} ${lastName ?? ""}`.trim();
  }

  return user.username?.trim() || "User";
}

export async function syncUserToFirestore(user: UserResource) {
  const userRef = doc(db, "users", user.id);
  const userDoc = await getDoc(userRef);
  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    null;

  const payload = {
    clerkId: user.id,
    email: primaryEmail,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    username: user.username || null,
    displayName: buildDisplayName(user),
    imageUrl: user.imageUrl || null,
    updatedAt: serverTimestamp(),
  };

  if (userDoc.exists()) {
    await setDoc(userRef, payload, { merge: true });
    return;
  }

  await setDoc(
    userRef,
    {
      ...payload,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}
