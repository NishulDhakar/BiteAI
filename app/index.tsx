import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { useAuth, useClerk } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  if (isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome! You are signed in.</Text>
        <View style={{ padding: 20 }}>
          <Button title="Sign Out" onPress={() => signOut()} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>AI Cal</Text>
          </View>
          <Text style={styles.title}>AI Cal Tracker</Text>
          <Text style={styles.subtitle}>Track your calories with the power of AI</Text>
        </View>

        <View style={styles.buttons}>
          <Link href="/sign-in" asChild>
            <Button title="Sign In" onPress={() => { }} />
          </Link>
          <Link href="/sign-up" asChild>
            <Button title="Create Account" variant="outline" onPress={() => { }} />
          </Link>
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
    padding: 30,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: Colors.neutral.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.neutral[800],
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 26,
  },
  buttons: {
    marginBottom: 40,
    gap: 15,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50
  }
});
