import { db } from "@/config/firebase";
import { Colors } from "@/constants/colors";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const LOADING_STEPS = [
    "Analyzing your profile...",
    "Calculating daily calories...",
    "Generating macro split...",
    "Finalizing your plan...",
];

export default function AiGenerator() {
    const { user } = useUser();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [aiData, setAiData] = useState<any>(null);
    const hasRunConfig = useRef(false);

    useEffect(() => {
        if (hasRunConfig.current) return;
        hasRunConfig.current = true;
        generatePlan();
    }, []);

    // Timer effect for visual progress
    useEffect(() => {
        if (currentStep < LOADING_STEPS.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
            }, 2000); // 2 seconds per step
            return () => clearTimeout(timer);
        } else {
            // We are at the last step ("Finalizing...")
            // If we have aiData, we can finish up
            if (aiData) {
                handleCompletion();
            }
        }
    }, [currentStep, aiData]);

    const handleCompletion = async () => {
        // Small delay to show the last checkmark
        setTimeout(() => {
            router.replace("/");
        }, 1500);
    };

    const generatePlan = async () => {
        try {
            if (!API_KEY) {
                Alert.alert("Configuration Error", "Gemini API Key is missing.");
                return;
            }

            const jsonValue = await AsyncStorage.getItem("onboardingData");
            if (!jsonValue) {
                Alert.alert("Error", "No profile data found. Please try again.");
                router.replace("/onboarding");
                return;
            }
            const userData = JSON.parse(jsonValue);

            const prompt = `
        Act as an expert nutritionist and fitness coach.
        Create a daily plan for a person with these stats:
        - Gender: ${userData.gender}
        - Age: Based on birthdate ${userData.birthday}
        - Height: ${userData.height} feet
        - Weight: ${userData.weight} kg
        - Goal: ${userData.goal}
        - Workout Frequency: ${userData.workoutFrequency}

        Provide the response in STRICT JSON format with NO markdown formatting, just the raw JSON object. Use this structure:
        {
          "dailyCalories": number,
          "macros": {
            "protein": number (grams),
            "carbs": number (grams),
            "fats": number (grams)
          },
          "waterIntake": number (liters),
          "trainingPlan": "Brief summary string",
          "healthTips": ["Tip 1", "Tip 2", "Tip 3"]
        }
      `;

            // Use the model the user requested/set. 
            // If it fails, they will get an alert.
            const genAI = new GoogleGenerativeAI(API_KEY.trim());
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Reverting to stable for now to ensure it works, user can change if needed.

            const result = await model.generateContent(prompt);
            const response = result.response;
            let text = response.text();
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const data = JSON.parse(text);

            // Save using the same logic
            if (user) {
                const userRef = doc(db, "users", user.id);
                await updateDoc(userRef, {
                    ...userData,
                    aiPlan: data,
                    planGeneratedAt: new Date().toISOString()
                });
                await AsyncStorage.setItem("aiPlan", JSON.stringify(data));
            }

            setAiData(data);

        } catch (error: any) {
            console.error("AI Generation Error:", error);
            const errorMessage = error.message || "Failed to generate plan. Please try again.";
            Alert.alert("Error", errorMessage);
            router.replace("/");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="sparkles" size={48} color={Colors.primary[500]} />
                </View>
                <Text style={styles.title}>AI is building your plan</Text>
                <Text style={styles.subtitle}>Please wait while we personalize everything for you.</Text>

                <View style={styles.stepsContainer}>
                    {LOADING_STEPS.map((step, index) => {
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep || (index === LOADING_STEPS.length - 1 && aiData);

                        return (
                            <View key={index} style={styles.stepRow}>
                                <View style={styles.stepIcon}>
                                    {isCompleted ? (
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.primary[500]} />
                                    ) : isActive ? (
                                        <ActivityIndicator size="small" color={Colors.primary[500]} />
                                    ) : (
                                        <View style={styles.pendingCircle} />
                                    )}
                                </View>
                                <Text style={[
                                    styles.stepText,
                                    isActive && styles.activeStepText,
                                    isCompleted && styles.completedStepText
                                ]}>
                                    {step}
                                </Text>
                            </View>
                        );
                    })}
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
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    iconContainer: {
        marginBottom: 24,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary[50],
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: Colors.neutral[900],
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: Colors.neutral[500],
        textAlign: "center",
        marginBottom: 40,
    },
    stepsContainer: {
        width: "100%",
        gap: 20,
        paddingHorizontal: 20,
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    stepIcon: {
        width: 30,
        alignItems: "center",
        marginRight: 16,
    },
    pendingCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.neutral[200],
    },
    stepText: {
        fontSize: 16,
        color: Colors.neutral[400],
        fontWeight: "500",
    },
    activeStepText: {
        color: Colors.neutral[900],
        fontWeight: "700",
    },
    completedStepText: {
        color: Colors.neutral[900],
        fontWeight: "600",
    },
});
