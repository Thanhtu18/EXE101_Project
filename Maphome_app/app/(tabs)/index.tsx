import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFavorites } from '@/hooks/useFavorites';
import { useProperties } from '@/contexts/PropertiesContext';

const formatVnd = (value?: number) => Number(value ?? 0).toLocaleString('vi-VN');

export default function HomeScreen() {
  const router = useRouter();
  const { properties, loading, search, refresh } = useProperties();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [keyword, setKeyword] = useState('');

  const title = useMemo(() => {
    const total = properties.length;
    return `${total} phong dang hien thi`;
  }, [properties.length]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">MapHome</ThemedText>
      <ThemedText style={styles.subtitle}>Tim phong nhanh va dat lich xem phong ngay tren di dong</ThemedText>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Tim theo ten hoac dia chi"
          value={keyword}
          onChangeText={setKeyword}
          style={styles.input}
          onSubmitEditing={() => search(keyword)}
        />
        <Pressable style={styles.searchButton} onPress={() => search(keyword)}>
          <ThemedText style={styles.searchButtonText}>Tim</ThemedText>
        </Pressable>
      </View>

      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/property/${item._id}`)}>
              <View style={styles.cardHeader}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <Pressable onPress={() => toggleFavorite(item._id)}>
                  <ThemedText>{isFavorite(item._id) ? '♥' : '♡'}</ThemedText>
                </Pressable>
              </View>
              <ThemedText>{item.address}</ThemedText>
              <ThemedText style={styles.price}>{formatVnd(item.price)} VND/thang</ThemedText>
              <ThemedText>Dien tich: {item.area}m2</ThemedText>
            </Pressable>
          )}
          ListEmptyComponent={<ThemedText>Chua co du lieu phong.</ThemedText>}
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
  subtitle: {
    opacity: 0.7,
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 32,
    gap: 10,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 6,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: '#16a34a',
    fontWeight: '600',
  },
});
