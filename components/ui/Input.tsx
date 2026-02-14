import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface InputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const Input = ({ placeholder, value, onChangeText, secureTextEntry, icon, keyboardType = 'default' }: InputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, isFocused && styles.focusedContainer]}>
            {icon && <Ionicons name={icon} size={20} color={isFocused ? '#2563EB' : '#9CA3AF'} style={styles.icon} />}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                keyboardType={keyboardType}
                placeholderTextColor="#9CA3AF"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
            />
            {secureTextEntry && (
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                    <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        height: 50,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#F9FAFB',
    },
    focusedContainer: {
        borderColor: '#2563EB',
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
        fontSize: 16,
        color: '#1F2937',
    },
    icon: {
        marginRight: 5,
    },
    eyeIcon: {
        padding: 5,
    },
});
