import { Button } from "@/components/ui/Button";
import { db } from "@/config/firebase";
import { Colors } from "@/constants/colors";
import { useAuth, useClerk, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // Start with false so we don't show the dashboard immediately
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // Not signed in, so we don't need to check DB.
      // We can show the landing page immediately.
      setHasCheckedOnboarding(true);
      return;
    }

    if (!user) return; // Wait for user object

    const checkUserOnboarding = async () => {
      try {
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.isOnboardingComplete) {
            router.replace("/(tabs)");
          } else {
            router.replace("/onboarding");
          }
        } else {
          // No doc? New user. Go to onboarding.
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error("Error checking user DB:", error);
        // If we can't check the DB, assume they need onboarding or just send them there to be safe/retry.
        // Also alerting so the user knows something is up if it's a real error.
        // Alert.alert("Error", "Could not verify account setup. Redirecting to onboarding.");
        router.replace("/onboarding");
      }
    };

    checkUserOnboarding();
  }, [isLoaded, isSignedIn, user]);

  // Show loading if we are signed in but haven't checked DB yet.
  // OR if Clerk isn't loaded yet.
  if (!isLoaded || (isSignedIn && !hasCheckedOnboarding)) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  if (isSignedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome back, {user?.firstName}!</Text>
          <Text style={styles.subtitle}>You are all set up.</Text>

          <View style={{ marginTop: 40 }}>
            <Button title="Sign Out" onPress={() => signOut()} variant="outline" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>AI Cal</Text>
          </View>
          <Text style={styles.title}>AI Cal Tracker</Text>
          <Text style={styles.subtitle}>Track your calories with the power of AI</Text>
        </View>

        <View style={styles.buttons}>
          <Link href="/sign-in" asChild>
            <Button title="Sign In" onPress={() => { }} />
          </Link>
          <Link href="/sign-up" asChild>
            <Button title="Create Account" variant="outline" onPress={() => { }} />
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: Colors.neutral.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.neutral[800],
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 26,
  },
  buttons: {
    marginBottom: 40,
    gap: 15,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50
  }
});
