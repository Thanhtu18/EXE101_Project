import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { propertyService } from '@/services/propertyService';
import { RentalProperty } from '@/types/models';

const formatVnd = (value?: number) => Number(value ?? 0).toLocaleString('vi-VN');

export default function PropertyDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [property, setProperty] = useState<RentalProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!params.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await propertyService.detail(String(params.id));
        setProperty(data);
        await propertyService.incrementView(String(params.id));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [params.id]);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!property) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Khong tim thay phong.</ThemedText>
      </ThemedView>
    );
  }

  const landlord = typeof property.landlordId === 'string' ? null : property.landlordId;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">{property.name}</ThemedText>
      <ThemedText>{property.address}</ThemedText>
      <ThemedText style={styles.price}>{formatVnd(property.price)} VND/thang</ThemedText>
      <ThemedText>Dien tich: {property.area}m2</ThemedText>
      <ThemedText>Trang thai: {property.available ? 'Con phong' : 'Da het phong'}</ThemedText>
      <ThemedText>Chu nha: {property.ownerName || landlord?.name || 'Dang cap nhat'}</ThemedText>
      <ThemedText>So dien thoai: {property.phone || landlord?.phone || 'Dang cap nhat'}</ThemedText>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold">Tien ich</ThemedText>
        {Object.entries(property.amenities || {}).length === 0 ? (
          <ThemedText>Chua co thong tin tien ich.</ThemedText>
        ) : (
          Object.entries(property.amenities || {}).map(([key, value]) => (
            <ThemedText key={key}>
              {value ? '✓' : '○'} {key}
            </ThemedText>
          ))
        )}
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold">Moc dia diem gan day</ThemedText>
        {(property.nearbyLandmarks || []).slice(0, 6).map((landmark) => (
          <ThemedText key={`${landmark.name}-${landmark.distanceText}`}>
            • {landmark.name} ({landmark.distanceText})
          </ThemedText>
        ))}
      </View>

      <Pressable style={styles.bookButton}>
        <ThemedText style={styles.bookText}>Dat lich xem phong (sap cap nhat)</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    gap: 8,
    paddingBottom: 36,
  },
  price: {
    color: '#16a34a',
    fontWeight: '700',
  },
  section: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    backgroundColor: '#fff',
  },
  bookButton: {
    marginTop: 16,
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookText: {
    color: '#fff',
    fontWeight: '700',
  },
});
