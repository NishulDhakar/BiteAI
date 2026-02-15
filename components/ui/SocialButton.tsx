import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";

interface SocialButtonProps {
    onPress: () => void;
    isLoading?: boolean;
}

export const SocialButton = ({ onPress, isLoading }: SocialButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={isLoading} style={styles.button}>
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator color={Colors.neutral[800]} />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color={Colors.semantic.google} style={styles.icon} />
            <Text style={styles.text}>Continue with Google</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral[800],
  },
});
