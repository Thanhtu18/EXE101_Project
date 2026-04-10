import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const { register, isAuthenticated, isReady } = useAuth();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isReady && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const onSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Mat khau xac nhan khong khop');
      return;
    }

    setSubmitting(true);
    setError('');

    const result = await register({
      username,
      fullName,
      phone,
      email,
      password,
      confirmPassword,
      role: 'user',
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.message || 'Dang ky that bai');
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Tao tai khoan</ThemedText>
      <View style={styles.form}>
        <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
        <TextInput placeholder="Ho va ten" value={fullName} onChangeText={setFullName} style={styles.input} />
        <TextInput placeholder="So dien thoai" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Mat khau" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
        <TextInput placeholder="Xac nhan mat khau" value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} secureTextEntry />

        {!!error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Pressable disabled={submitting} onPress={onSubmit} style={styles.button}>
          <ThemedText style={styles.buttonText}>{submitting ? 'Dang xu ly...' : 'Dang ky'}</ThemedText>
        </Pressable>
      </View>

      <Link href="/login" style={styles.link}>
        Da co tai khoan? Dang nhap
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    gap: 12,
  },
  form: {
    gap: 10,
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
