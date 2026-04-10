import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { login, isAuthenticated, isReady } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isReady && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const onSubmit = async () => {
    setSubmitting(true);
    setError('');
    const result = await login(usernameOrEmail.trim(), password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message || 'Dang nhap that bai');
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Dang nhap MapHome</ThemedText>
      <ThemedText style={styles.caption}>Dang nhap de xem phong, dat lich va quan ly tin dang</ThemedText>

      <View style={styles.form}>
        <TextInput
          placeholder="Username hoac Email"
          autoCapitalize="none"
          value={usernameOrEmail}
          onChangeText={setUsernameOrEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Mat khau"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {!!error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Pressable disabled={submitting} onPress={onSubmit} style={styles.button}>
          <ThemedText style={styles.buttonText}>{submitting ? 'Dang xu ly...' : 'Dang nhap'}</ThemedText>
        </Pressable>
      </View>

      <Link href="/register" style={styles.link}>
        Chua co tai khoan? Dang ky ngay
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  caption: {
    opacity: 0.75,
  },
  form: {
    gap: 10,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  error: {
    color: '#dc2626',
  },
  button: {
    marginTop: 2,
    borderRadius: 10,
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  link: {
    marginTop: 8,
    color: '#0369a1',
  },
});
