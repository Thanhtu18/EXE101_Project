import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { notificationService } from '@/services/notificationService';
import { AppNotification } from '@/types/models';

export default function NotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>([]);

  const loadNotifications = async () => {
    const data = await notificationService.list();
    setItems(data);
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const onMarkAllRead = async () => {
    await notificationService.markAllRead();
    await loadNotifications();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Thong bao</ThemedText>
        <Pressable style={styles.button} onPress={() => void onMarkAllRead()}>
          <ThemedText style={styles.buttonText}>Doc het</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, item.isRead ? undefined : styles.unread]}>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText>{item.message}</ThemedText>
            <ThemedText>{item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '-'}</ThemedText>
          </View>
        )}
        ListEmptyComponent={<ThemedText>Chua co thong bao.</ThemedText>}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
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
  unread: {
    borderColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
  },
});
