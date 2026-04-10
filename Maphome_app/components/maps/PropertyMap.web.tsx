import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type MapPoint = {
  id: string;
  name: string;
  address: string;
  price: number;
  area: number;
  available: boolean;
  latitude: number;
  longitude: number;
};

export function PropertyMap({ points }: { points: MapPoint[]; onSelect: (id: string) => void }) {
  return (
    <View style={styles.placeholderMap}>
      <ThemedText style={styles.placeholderTitle}>Map Preview (Web Fallback)</ThemedText>
      <ThemedText>So diem: {points.length}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderMap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f1f5f9',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
});
