import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SocialButtonProps {
    onPress: () => void;
    isLoading?: boolean;
}

export const SocialButton = ({ onPress, isLoading }: SocialButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading}
            style={styles.button}
        >
            <View style={styles.content}>
                {/* Placeholder Google Icon or use an image asset */}
                <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/300/300221.png" }}
                    style={styles.icon}
                />
                <Text style={styles.text}>Continue with Google</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
});
