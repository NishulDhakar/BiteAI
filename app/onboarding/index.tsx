import { Button } from "@/components/ui/Button";
import { db } from "@/config/firebase";
import { Colors } from "@/constants/colors";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

type Gender = "Male" | "Female";
type Goal = "Gain Weight" | "Lose Weight" | "Maintain";
type WorkoutFrequency = "2-3 Days" | "3-4 Days" | "5-6 Days";

export default function Onboarding() {
    const { user } = useUser();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    // Form State
    const [gender, setGender] = useState<Gender | null>(null);
    const [goal, setGoal] = useState<Goal | null>(null);
    const [workoutFrequency, setWorkoutFrequency] = useState<WorkoutFrequency | null>(null);
    const [birthday, setBirthday] = useState({ day: "", month: "", year: "" });
    const [height, setHeight] = useState(""); // Feet
    const [weight, setWeight] = useState(""); // Kg
    const [isLoading, setIsLoading] = useState(false);

    const progress = (step / totalSteps) * 100;

    const nextStep = () => {
        if (step === 1 && !gender) return Alert.alert("Required", "Please select your gender.");
        if (step === 2 && !goal) return Alert.alert("Required", "Please select your goal.");
        if (step === 3 && !workoutFrequency) return Alert.alert("Required", "Please select your workout frequency.");
        if (step === 4) {
            if (!birthday.day || !birthday.month || !birthday.year) {
                return Alert.alert("Required", "Please enter your complete birthdate.");
            }
            // Basic validation
            const day = parseInt(birthday.day);
            const month = parseInt(birthday.month);
            const year = parseInt(birthday.year);
            if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1920 || year > new Date().getFullYear()) {
                return Alert.alert("Invalid Date", "Please enter a valid date.");
            }
        }
        if (step === 5) {
            if (!height || !weight) return Alert.alert("Required", "Please enter your height and weight.");
            finishOnboarding();
            return;
        }

        setStep((prev) => prev + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep((prev) => prev - 1);
    };

    const finishOnboarding = async () => {
        if (!user) return;
        setIsLoading(true);

        const onboardingData = {
            gender,
            goal,
            workoutFrequency,
            birthday: `${birthday.year}-${birthday.month.padStart(2, '0')}-${birthday.day.padStart(2, '0')}`, // ISO formatish
            height: parseFloat(height),
            weight: parseFloat(weight),
            isOnboardingComplete: true,
            updatedAt: new Date().toISOString(),
        };

        try {
            // 1. Save to AsyncStorage
            await AsyncStorage.setItem("onboardingData", JSON.stringify(onboardingData));

            // 2. Save to Firestore
            const userRef = doc(db, "users", user.id);
            await setDoc(userRef, onboardingData, { merge: true });

            // 3. Navigate to AI Generator
            router.replace("/onboarding/ai-generator");
        } catch (error) {
            console.error("Error saving onboarding data:", error);
            Alert.alert("Error", "Failed to save your profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself!</Text>
            <Text style={styles.stepSubtitle}>To give you a better experience we need to know your gender.</Text>

            <View style={styles.selectionContainer}>
                {["Male", "Female"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[styles.optionCard, gender === item && styles.optionCardSelected]}
                        onPress={() => setGender(item as Gender)}
                    >
                        <View style={[styles.iconCircle, gender === item && styles.iconCircleSelected]}>
                            <Ionicons name={item === "Male" ? "male" : "female"} size={24} color={gender === item ? Colors.neutral.white : Colors.neutral[600]} />
                        </View>
                        <Text style={[styles.optionText, gender === item && styles.optionTextSelected]}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What is your main goal?</Text>
            <Text style={styles.stepSubtitle}>This helps us calculate your calories.</Text>

            <View style={styles.selectionContainer}>
                {[
                    { label: "Lose Weight", icon: "trending-down" },
                    { label: "Maintain", icon: "remove-circle-outline" },
                    { label: "Gain Weight", icon: "trending-up" },
                ].map((item) => (
                    <TouchableOpacity
                        key={item.label}
                        style={[styles.optionCard, goal === item.label && styles.optionCardSelected]}
                        onPress={() => setGoal(item.label as Goal)}
                    >
                        <View style={[styles.iconCircle, goal === item.label && styles.iconCircleSelected]}>
                            <Ionicons name={item.icon as any} size={24} color={goal === item.label ? Colors.neutral.white : Colors.neutral[600]} />
                        </View>
                        <Text style={[styles.optionText, goal === item.label && styles.optionTextSelected]}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your workout activity?</Text>
            <Text style={styles.stepSubtitle}>How many days a week do you train?</Text>

            <View style={styles.selectionContainer}>
                {["2-3 Days", "3-4 Days", "5-6 Days"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[styles.optionCard, workoutFrequency === item && styles.optionCardSelected]}
                        onPress={() => setWorkoutFrequency(item as WorkoutFrequency)}
                    >
                        <View style={[styles.iconCircle, workoutFrequency === item && styles.iconCircleSelected]}>
                            <Ionicons name="fitness" size={24} color={workoutFrequency === item ? Colors.neutral.white : Colors.neutral[600]} />
                        </View>
                        <Text style={[styles.optionText, workoutFrequency === item && styles.optionTextSelected]}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderStep4 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>When were you born?</Text>
            <Text style={styles.stepSubtitle}>We use this to calculate your metabolic rate.</Text>

            <View style={styles.dateInputContainer}>
                <View style={styles.dateInputWrapper}>
                    <Text style={styles.inputLabel}>Day</Text>
                    <TextInput
                        style={styles.dateInput}
                        placeholder="DD"
                        keyboardType="numeric"
                        maxLength={2}
                        value={birthday.day}
                        onChangeText={(t) => setBirthday({ ...birthday, day: t })}
                    />
                </View>
                <View style={styles.dateInputWrapper}>
                    <Text style={styles.inputLabel}>Month</Text>
                    <TextInput
                        style={styles.dateInput}
                        placeholder="MM"
                        keyboardType="numeric"
                        maxLength={2}
                        value={birthday.month}
                        onChangeText={(t) => setBirthday({ ...birthday, month: t })}
                    />
                </View>
                <View style={[styles.dateInputWrapper, { flex: 1.5 }]}>
                    <Text style={styles.inputLabel}>Year</Text>
                    <TextInput
                        style={styles.dateInput}
                        placeholder="YYYY"
                        keyboardType="numeric"
                        maxLength={4}
                        value={birthday.year}
                        onChangeText={(t) => setBirthday({ ...birthday, year: t })}
                    />
                </View>
            </View>
        </View>
    );

    const renderStep5 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your body stats</Text>
            <Text style={styles.stepSubtitle}>Just a few more details to get started.</Text>

            <View style={styles.statsContainer}>
                <View style={styles.statRow}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="resize" size={24} color={Colors.neutral[600]} />
                    </View>
                    <View style={styles.statInputWrapper}>
                        <Text style={styles.inputLabel}>Height (Feet)</Text>
                        <TextInput
                            style={styles.statInput}
                            placeholder="5.9"
                            keyboardType="numeric"
                            value={height}
                            onChangeText={setHeight}
                        />
                    </View>
                </View>

                <View style={styles.statRow}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="scale" size={24} color={Colors.neutral[600]} />
                    </View>
                    <View style={styles.statInputWrapper}>
                        <Text style={styles.inputLabel}>Weight (Kg)</Text>
                        <TextInput
                            style={styles.statInput}
                            placeholder="70"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                        />
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>Step {step} of {totalSteps}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
            </ScrollView>

            <View style={styles.footer}>
                {step > 1 && (
                    <TouchableOpacity style={styles.backButton} onPress={prevStep} disabled={isLoading}>
                        <Ionicons name="arrow-back" size={24} color={Colors.neutral[600]} />
                    </TouchableOpacity>
                )}

                <View style={{ flex: 1, marginLeft: step > 1 ? 16 : 0 }}>
                    <Button
                        title={step === totalSteps ? "Finish" : "Next"}
                        onPress={nextStep}
                        isLoading={isLoading}
                    />
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    progressContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: Colors.neutral[200],
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: Colors.primary[500],
        borderRadius: 4,
    },
    progressText: {
        marginTop: 8,
        textAlign: "right",
        color: Colors.neutral[500],
        fontSize: 12,
        fontWeight: "600",
    },
    stepContainer: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: Colors.neutral[900],
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 16,
        color: Colors.neutral[500],
        marginBottom: 32,
        lineHeight: 24,
    },
    selectionContainer: {
        gap: 16,
    },
    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.neutral[50],
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.neutral[200],
    },
    optionCardSelected: {
        backgroundColor: Colors.primary[500],
        borderColor: Colors.primary[500],
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.neutral.white,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    iconCircleSelected: {
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    optionText: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.neutral[800],
    },
    optionTextSelected: {
        color: Colors.neutral.white,
    },
    footer: {
        flexDirection: "row",
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: Colors.neutral[100],
        alignItems: 'center',
    },
    backButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.neutral[100],
    },
    // Date Input Styles
    dateInputContainer: {
        flexDirection: "row",
        gap: 12,
    },
    dateInputWrapper: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.neutral[600],
        marginBottom: 8,
    },
    dateInput: {
        backgroundColor: Colors.neutral[50],
        borderWidth: 1,
        borderColor: Colors.neutral[200],
        borderRadius: 16,
        padding: 16,
        fontSize: 18,
        fontWeight: "600",
        color: Colors.neutral[900],
        textAlign: "center",
    },
    // Stats Styles
    statsContainer: {
        gap: 20,
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    statInputWrapper: {
        flex: 1,
    },
    statInput: {
        backgroundColor: Colors.neutral[50],
        borderWidth: 1,
        borderColor: Colors.neutral[200],
        borderRadius: 16,
        padding: 16,
        fontSize: 18,
        fontWeight: "600",
        color: Colors.neutral[900],
    },
});
