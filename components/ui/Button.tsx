import { forwardRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
}

export const Button = forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(({ title, onPress, isLoading, variant = 'primary', disabled }, ref) => {
    const getBackgroundColor = () => {
        if (disabled) return '#E5E7EB';
        switch (variant) {
            case 'primary': return '#2563EB'; // Blue-600
            case 'secondary': return '#4B5563'; // Gray-600
            case 'outline': return 'transparent';
            default: return '#2563EB';
        }
    };

    const getTextColor = () => {
        if (disabled) return '#9CA3AF';
        switch (variant) {
            case 'primary': return '#FFFFFF';
            case 'secondary': return '#FFFFFF';
            case 'outline': return '#2563EB';
            default: return '#FFFFFF';
        }
    };

    return (
        <TouchableOpacity
            ref={ref}
            onPress={onPress}
            disabled={disabled || isLoading}
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outlineButton,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: '#2563EB',
        shadowColor: 'transparent',
        elevation: 0,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
