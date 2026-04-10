import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { PropertyMap } from '../../components/maps/PropertyMap';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProperties } from '@/contexts/PropertiesContext';

export default function MapScreen() {
  const router = useRouter();
  const { properties } = useProperties();

  const mapPoints = useMemo(
    () =>
      properties
        .filter((item) => Array.isArray(item.location) && item.location.length >= 2)
        .map((item) => ({
          id: item._id,
          name: item.name,
          address: item.address,
          price: Number(item.price ?? 0),
          area: Number(item.area ?? 0),
          available: Boolean(item.available),
          latitude: Number(item.location[1]),
          longitude: Number(item.location[0]),
        }))
        .filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude)),
    [properties],
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Ban do nha tro</ThemedText>
      <ThemedText style={styles.caption}>
        Nen tang hien tai: {Platform.OS}. Web hien fallback; iOS/Android hien ban do Goong.
      </ThemedText>

      <PropertyMap points={mapPoints} onSelect={(id) => router.push(`/property/${id}`)} />

      {mapPoints.slice(0, 8).map((item) => (
        <Pressable key={item.id} style={styles.locationItem} onPress={() => router.push(`/property/${item.id}`)}>
          <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
          <ThemedText>
            Toa do: {item.latitude}, {item.longitude}
          </ThemedText>
        </Pressable>
      ))}
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
  caption: {
    opacity: 0.7,
  },
  locationItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    gap: 4,
  },
});
