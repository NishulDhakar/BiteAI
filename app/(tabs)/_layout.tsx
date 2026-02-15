import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
// If not installed, we'll just use a view. I'll stick to View for now to avoid extra deps unless needed.

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 80,
                    left: 30,
                    right: 30,
                    height: 60,
                    paddingBottom: 25,
                    backgroundColor: Colors.neutral.white,
                    borderRadius: 36,
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: Colors.primary[500],
                tabBarInactiveTintColor: Colors.neutral[400],
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center", top: Platform.OS === "ios" ? 18 : 0 }}>
                            <Ionicons name={focused ? "home" : "home-outline"} size={28} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center", top: Platform.OS === "ios" ? 18 : 0 }}>
                            <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={28} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center", top: Platform.OS === "ios" ? 18 : 0 }}>
                            <Ionicons name={focused ? "person" : "person-outline"} size={28} color={color} />
                        </View>
                    ),
                }}
            />

            {/* 
        This is a "Dummy" screen to serve as the floating button since Expo Router Tabs is based on screens. 
        Alternatively, we can use a custom TabBar component, but this is a quick way to insert it.
        Actually, for a purely visual "Add" button that opens a modal or action sheet, 
        using a custom button component in the proper slot is better, OR using a listener.
        
        Let's try to add it as a screen but override the button.
      */}
            <Tabs.Screen
                name="add"
                options={{
                    // We can prevent default navigation action and open a modal instead
                    tabBarButton: (props) => {
                        return (
                            <TouchableOpacity
                                {...(props as any)}
                                style={styles.fab}
                                activeOpacity={0.8}
                                onPress={() => {
                                    console.log("FAB Pressed");
                                }}
                            >
                                <Ionicons name="add" size={32} color={Colors.neutral.white} />
                            </TouchableOpacity>
                        );
                    },
                }}
                // Just point it to index or null as it won't be navigated to normally via the button
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault(); // Prevent standard tab navigation
                    }
                })}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Platform.OS === "ios" ? 36 : 0, // Lift it up slightly relative to tab bar center
        marginRight: 8,
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        top: -10, // Float slightly above
    }
});
