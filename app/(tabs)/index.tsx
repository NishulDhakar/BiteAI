import { Colors } from "@/constants/colors";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const { user } = useUser();
    const { signOut } = useClerk();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, {user?.firstName}!</Text>
                <Text style={styles.subtitle}>Here is your daily summary.</Text>
            </View>

            <View style={styles.content}>
                <Text>Dashboard widgets will go here.</Text>

                <TouchableOpacity onPress={() => signOut()} style={{ marginTop: 20 }}>
                    <Text style={{ color: Colors.primary[500] }}>Sign Out (Temp)</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.neutral[50],
    },
    header: {
        padding: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: "800",
        color: Colors.neutral[900],
    },
    subtitle: {
        fontSize: 16,
        color: Colors.neutral[500],
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 24,
    },
});
