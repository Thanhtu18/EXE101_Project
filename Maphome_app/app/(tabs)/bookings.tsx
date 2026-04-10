import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types/models';

export default function BookingsScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = user?.role === 'user' ? await bookingService.myBookings() : await bookingService.allBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const onCancel = async (id: string) => {
    await bookingService.cancelBooking(id);
    await loadBookings();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Lich hen xem phong</ThemedText>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <ThemedText type="defaultSemiBold">{item.propertyId?.name || 'Dat lich xem phong'}</ThemedText>
              <ThemedText>Trang thai: {item.status || 'pending'}</ThemedText>
              <ThemedText>Ngay tao: {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '-'}</ThemedText>
              {user?.role === 'user' && item.status === 'pending' ? (
                <Pressable style={styles.cancelButton} onPress={() => void onCancel(item._id)}>
                  <ThemedText style={styles.cancelText}>Huy lich</ThemedText>
                </Pressable>
              ) : null}
            </View>
          )}
          ListEmptyComponent={<ThemedText>Chua co lich hen nao.</ThemedText>}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    paddingHorizontal: 16,
    gap: 12,
  },
  list: {
    gap: 10,
    paddingBottom: 36,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    gap: 6,
    backgroundColor: '#fff',
  },
  cancelButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
  },
});
