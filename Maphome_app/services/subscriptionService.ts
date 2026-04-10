import { api } from '@/services/api';
import { SubscriptionPlan } from '@/types/models';

export const subscriptionService = {
  async plans() {
    const response = await api.get<SubscriptionPlan[]>('/api/subscriptions/plans');
    return response.data;
  },
  async mySubscription() {
    const response = await api.get('/api/subscriptions/me');
    return response.data;
  },
  async subscribe(planId: string, billingCycle: 'monthly' | 'yearly') {
    const response = await api.post('/api/subscriptions/subscribe', { planId, billingCycle });
    return response.data;
  },
};
