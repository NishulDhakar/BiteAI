import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SocialButton } from "@/components/ui/SocialButton";
import { Colors } from "@/constants/colors";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Please fill full name, email and password.");
      return;
    }

    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ").trim() || undefined;

    setIsLoading(true);

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || "Unable to create account.";
      Alert.alert("Sign up failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    if (!code.trim()) {
      Alert.alert("Missing code", "Please enter your verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (completeSignUp.status === "complete") {
        if (setActive) {
          await setActive({ session: completeSignUp.createdSessionId });
          router.replace("/onboarding");
        }
      } else {
        Alert.alert("Verification pending", "Please finish the remaining verification steps.");
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || "Invalid verification code.";
      Alert.alert("Verification failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glowTopRight} />
      <View style={styles.glowBottomLeft} />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.brandBlock}>
            <View style={styles.logoWrap}>
              <Image source={require("@/assets/images/icon.png")} style={styles.logo} resizeMode="cover" />
            </View>
            <Text style={styles.appName}>AI Calories Tracker</Text>
            <Text style={styles.appCaption}>Create your account and personalize your health journey.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{pendingVerification ? "Verify your email" : "Create account"}</Text>
            <Text style={styles.subtitle}>
              {pendingVerification
                ? `We sent a code to ${email}.`
                : "Use your email and password to get started."}
            </Text>

            {!pendingVerification ? (
              <>
                <View style={styles.form}>
                  <Input
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    icon="person-outline"
                    autoCapitalize="words"
                  />
                  <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon="mail-outline"
                  />
                  <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    icon="lock-closed-outline"
                  />

                  <Button title="Sign Up" onPress={onSignUpPress} isLoading={isLoading} />
                </View>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                <SocialButton onPress={signInWithGoogle} isLoading={isGoogleLoading} />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account?</Text>
                  <Link href="/sign-in" asChild>
                    <TouchableOpacity>
                      <Text style={styles.link}>Sign in</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </>
            ) : (
              <View style={styles.form}>
                <Input
                  placeholder="6-digit verification code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="numeric"
                  icon="key-outline"
                />
                <Button title="Verify Email" onPress={onPressVerify} isLoading={isLoading} />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.screenBlueAlt,
  },
  keyboardContainer: {
    flex: 1,
  },
  glowTopRight: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.brand.glowBlueAlt,
  },
  glowBottomLeft: {
    position: "absolute",
    bottom: -90,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.brand.glowMintAlt,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoWrap: {
    width: 84,
    height: 84,
    borderRadius: 24,
    padding: 6,
    backgroundColor: Colors.neutral.white,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 8,
    marginBottom: 12,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.neutral[900],
    marginBottom: 6,
  },
  appCaption: {
    fontSize: 14,
    color: Colors.neutral[600],
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.neutral[900],
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.neutral[500],
    marginBottom: 20,
  },
  form: {
    marginBottom: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral[200],
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.neutral[400],
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    gap: 8,
  },
  footerText: {
    color: Colors.neutral[500],
    fontSize: 14,
  },
  link: {
    color: Colors.primary[500],
    fontWeight: "700",
    fontSize: 14,
  },
});
