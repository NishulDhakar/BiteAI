import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SocialButton } from '@/components/ui/SocialButton';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function SignUp() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();
    const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();

    const [username, setUsername] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle Sign Up
    const onSignUpPress = async () => {
        if (!isLoaded) return;
        setIsLoading(true);

        try {
            await signUp.create({
                username,
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            Alert.alert('Error', err.errors[0].message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Verification
    const onPressVerify = async () => {
        if (!isLoaded) return;
        setIsLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                // User sync handled by UserSyncProvider
                router.replace('/');
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (err: any) {
            Alert.alert('Error', err.errors[0].message);
        } finally {
            setIsLoading(false);
        }
    };

    const onGoogleSignUp = async () => {
        await signInWithGoogle();
    }


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to start tracking your calories</Text>
                    </View>

                    {!pendingVerification ? (
                        <>
                            <View style={styles.form}>
                                <Input
                                    placeholder="Username"
                                    value={username}
                                    onChangeText={setUsername}
                                    icon="person-outline"
                                />
                                <Input
                                    placeholder="Email"
                                    value={emailAddress}
                                    onChangeText={setEmailAddress}
                                    keyboardType="email-address"
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

                            <SocialButton onPress={onGoogleSignUp} isLoading={isGoogleLoading} />

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <Link href="/sign-in" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.link}>Sign In</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </>
                    ) : (
                        <View style={styles.form}>
                            <Text style={styles.verificationText}>
                                We've sent a verification code to {emailAddress}. Please enter it below.
                            </Text>
                            <Input
                                placeholder="Verification Code"
                                value={code}
                                onChangeText={setCode}
                                keyboardType="numeric"
                                icon="key-outline"
                            />
                            <Button title="Verify Email" onPress={onPressVerify} isLoading={isLoading} />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingTop: 40,
        paddingBottom: 20,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        lineHeight: 24,
    },
    form: {
        marginBottom: 20,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 15,
    },
    link: {
        color: '#2563EB',
        fontWeight: '600',
        fontSize: 15,
    },
    verificationText: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 22,
    },
});
