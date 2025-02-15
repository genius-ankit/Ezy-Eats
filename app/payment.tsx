import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
  const { total, clearCart } = useCart();

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    // Here you would normally process the payment
    // For now, we'll just show a success message
    alert('Order placed successfully!');
    clearCart();
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Select Payment Method</Text>
        
        {PAYMENT_METHODS.map((method) => (
          <Pressable
            key={method.id}
            style={[
              styles.methodCard,
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
              styles.methodName,
              selectedMethod === method.id && styles.selectedMethodText
            ]}>
              {method.name}
            </Text>
            {selectedMethod === method.id && (
              <MaterialIcons name="check-circle" size={24} color="#2E8B57" />
            )}
          </Pressable>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Amount to Pay:</Text>
          <Text style={styles.totalAmount}>${total}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={[
            styles.payButton,
            !selectedMethod && styles.payButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
  },
  selectedMethod: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E8B57',
    borderWidth: 1,
  },
  methodName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedMethodText: {
    color: '#2E8B57',
    fontWeight: '600',
  },
  totalContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 12,
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
}); 