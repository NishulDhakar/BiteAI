import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useWarmUpBrowser } from "./useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const signInWithGoogle = useCallback(async () => {
        try {
            setIsLoading(true);
            const { createdSessionId, setActive, signUp, signIn } = await startOAuthFlow();

            if (createdSessionId) {
                // Activate the session
                await setActive!({ session: createdSessionId });

                router.replace("/");
            } else {
                // Implement logic for incomplete flows (e.g. MFA) if needed
                console.log("Session not created immediately", { signUp, signIn });
            }
        } catch (err: any) {
            console.error("OAuth error", err);
            // Clean up error message
            const msg = err?.errors?.[0]?.message || "Failed to sign in with Google";
            Alert.alert("Error", msg);
        } finally {
            setIsLoading(false);
        }
    }, [router, startOAuthFlow]);

    return { signInWithGoogle, isLoading };
};
