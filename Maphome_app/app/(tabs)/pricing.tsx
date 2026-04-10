import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { subscriptionService } from '@/services/subscriptionService';
import { SubscriptionPlan } from '@/types/models';

const formatVnd = (value?: number) => Number(value ?? 0).toLocaleString('vi-VN');

export default function PricingScreen() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const load = async () => {
      const data = await subscriptionService.plans();
      setPlans(data);
    };
    void load();
  }, []);

  const onSubscribe = async (planId: string) => {
    try {
      const result = await subscriptionService.subscribe(planId, cycle);
      Alert.alert('Thanh cong', result.message || 'Da dang ky goi thanh cong');
    } catch {
      Alert.alert('Thong bao', 'Can dang nhap va hoan tat thanh toan de kich hoat goi.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Bang gia</ThemedText>

      <View style={styles.cycleRow}>
        <Pressable style={[styles.cycleButton, cycle === 'monthly' && styles.cycleActive]} onPress={() => setCycle('monthly')}>
          <ThemedText style={cycle === 'monthly' ? styles.cycleTextActive : undefined}>Thang</ThemedText>
        </Pressable>
        <Pressable style={[styles.cycleButton, cycle === 'yearly' && styles.cycleActive]} onPress={() => setCycle('yearly')}>
          <ThemedText style={cycle === 'yearly' ? styles.cycleTextActive : undefined}>Nam</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={plans}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
            <ThemedText style={styles.price}>
              {formatVnd(cycle === 'monthly' ? item.monthlyPrice : item.yearlyPrice)} VND/{cycle === 'monthly' ? 'thang' : 'nam'}
            </ThemedText>
            <ThemedText>{item.description || 'Goi dich vu danh cho nha tro MapHome'}</ThemedText>
            <Pressable style={styles.button} onPress={() => void onSubscribe(item._id)}>
              <ThemedText style={styles.buttonText}>Dang ky goi</ThemedText>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<ThemedText>Dang cap nhat cac goi dich vu...</ThemedText>}
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
  cycleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cycleButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cycleActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  cycleTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  list: {
    paddingBottom: 36,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    gap: 6,
    backgroundColor: '#fff',
  },
  price: {
    color: '#16a34a',
    fontWeight: '700',
  },
  button: {
    marginTop: 6,
    borderRadius: 8,
    backgroundColor: '#0ea5e9',
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
