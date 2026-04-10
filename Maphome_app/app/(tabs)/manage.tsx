import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/adminService';
import { propertyService } from '@/services/propertyService';
import { RentalProperty } from '@/types/models';

const formatVnd = (value?: number) => Number(value ?? 0).toLocaleString('vi-VN');

export default function ManageScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<RentalProperty[]>([]);
  const role = user?.role;
  const fullName = user?.fullName;
  const username = user?.username;

  useEffect(() => {
    const load = async () => {
      if (role === 'admin') {
        const data = await adminService.properties();
        setItems(data);
      } else if (role === 'landlord') {
        const data = await propertyService.list();
        setItems(data.filter((x) => x.ownerName === fullName || x.ownerName === username));
      }
    };
    void load();
  }, [fullName, role, username]);

  if (user?.role !== 'landlord' && user?.role !== 'admin') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Ban khong co quyen truy cap muc nay.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Quan ly</ThemedText>
      <ThemedText>{user.role === 'admin' ? 'Danh sach tat ca bai dang' : 'Danh sach bai dang cua ban'}</ThemedText>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
            <ThemedText>Trang thai: {item.status || 'pending'}</ThemedText>
            <ThemedText>Gia: {formatVnd(item.price)} VND/thang</ThemedText>
          </View>
        )}
        ListEmptyComponent={<ThemedText>Chua co du lieu quan ly.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    paddingHorizontal: 16,
    gap: 10,
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
});
