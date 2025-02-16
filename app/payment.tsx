import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/context/CartContext';

const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    icon: 'account-balance' as const,
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: 'credit-card' as const,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: 'payments' as const,
  },
];

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const params = useLocalSearchParams<{ 
    total: string;
    orderType: 'now' | 'scheduled';
    scheduledTime?: string;
  }>();
  const total = params.total ? parseFloat(params.total) : 0;
  const { clearCart } = useCart();

  // Format scheduled time for display
  const getFormattedTime = () => {
    if (params.scheduledTime) {
      const date = new Date(params.scheduledTime);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return null;
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    try {
      // Process payment logic here
      
      // Clear cart after successful payment
      clearCart();
      
      Alert.alert(
        'Success',
        'Order placed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Order Type Section */}
      <View style={styles.orderInfoSection}>
        <View style={styles.orderTypeRow}>
          <MaterialIcons 
            name={params.orderType === 'scheduled' ? 'schedule' : 'shopping-cart'} 
            size={24} 
            color="#2E8B57" 
          />
          <Text style={styles.orderTypeText}>
            {params.orderType === 'scheduled' ? 'Scheduled Order' : 'Immediate Order'}
          </Text>
        </View>
        
        {params.orderType === 'scheduled' && getFormattedTime() && (
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Pickup Time:</Text>
            <Text style={styles.timeValue}>{getFormattedTime()}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {PAYMENT_METHODS.map((method) => (
          <Pressable
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedMethod === method.id && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <MaterialIcons 
              name={method.icon} 
              size={24} 
              color={selectedMethod === method.id ? '#2E8B57' : '#666'} 
            />
            <Text style={[
              styles.methodText,
              selectedMethod === method.id && styles.selectedMethodText
            ]}>
              {method.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalText}>Total Amount:</Text>
        <Text style={styles.amount}>${total.toFixed(2)}</Text>
      </View>

      <Pressable
        style={[styles.payButton, !selectedMethod && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={!selectedMethod}
      >
        <Text style={styles.payButtonText}>Pay Now</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedMethod: {
    borderColor: '#2E8B57',
    backgroundColor: '#f0fff0',
  },
  methodText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  selectedMethodText: {
    color: '#2E8B57',
    fontWeight: '500',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  payButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  orderInfoSection: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  orderTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTypeText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
  },
  timeValue: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8B57',
  },
}); 