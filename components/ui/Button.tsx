import React, { forwardRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
}

export const Button = forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(({ title, onPress, isLoading, variant = 'primary', disabled }, ref) => {
    const getBackgroundColor = () => {
        if (disabled) return Colors.neutral[200];
        switch (variant) {
            case 'primary': return Colors.primary[500];
            case 'secondary': return Colors.neutral[600];
            case 'outline': return 'transparent';
            default: return Colors.primary[500];
        }
    };

    const getTextColor = () => {
        if (disabled) return Colors.neutral[400];
        switch (variant) {
            case 'primary': return Colors.neutral.white;
            case 'secondary': return Colors.neutral.white;
            case 'outline': return Colors.primary[500];
            default: return Colors.neutral.white;
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

Button.displayName = 'Button';

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 12,
        shadowColor: Colors.neutral.black,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 5,
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: Colors.primary[500],
        shadowColor: 'transparent',
        elevation: 0,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
    },
});
