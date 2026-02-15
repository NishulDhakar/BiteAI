import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
}

export const Input = ({
  icon,
  secureTextEntry = false,
  style,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldSecure = useMemo(() => {
    if (!secureTextEntry) return false;
    return !isPasswordVisible;
  }, [secureTextEntry, isPasswordVisible]);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused
            ? Colors.primary[500]
            : Colors.neutral[200],
        },
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={
            isFocused
              ? Colors.primary[500]
              : Colors.neutral[400]
          }
          style={styles.icon}
        />
      )}

      <TextInput
        style={[
          styles.input,
          { marginLeft: icon ? 10 : 0 },
          style,
        ]}
        placeholderTextColor={Colors.neutral[400]}
        secureTextEntry={shouldSecure}
        autoCorrect={false}
        spellCheck={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {secureTextEntry && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            setIsPasswordVisible((prev) => !prev)
          }
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color={Colors.neutral[400]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: Colors.neutral[50],
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: Colors.neutral[800],
  },
  icon: {
    marginRight: 4,
  },
  eyeIcon: {
    padding: 6,
  },
});
