import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, isReady, isAuthenticated, logout } = useAuth();

  if (isReady && !isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Tai khoan</ThemedText>

      <View style={styles.card}>
        <ThemedText type="defaultSemiBold">{user?.fullName || user?.username}</ThemedText>
        <ThemedText>{user?.email}</ThemedText>
        <ThemedText>Vai tro: {user?.role}</ThemedText>
      </View>

      <Pressable style={styles.actionButton} onPress={() => router.push('/notifications')}>
        <ThemedText style={styles.actionText}>Thong bao cua toi</ThemedText>
      </Pressable>

      {(user?.role === 'landlord' || user?.role === 'admin') && (
        <Pressable style={styles.actionButton} onPress={() => router.push('/(tabs)/manage')}>
          <ThemedText style={styles.actionText}>Mo man hinh quan ly</ThemedText>
        </Pressable>
      )}

      <Pressable style={styles.logoutButton} onPress={() => void logout()}>
        <ThemedText style={styles.logoutText}>Dang xuat</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    paddingHorizontal: 16,
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    gap: 6,
    backgroundColor: '#fff',
  },
  actionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#0284c7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ef4444',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
