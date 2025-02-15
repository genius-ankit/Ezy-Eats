import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Modal, TouchableOpacity } from 'react-native';
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

// Add time slots
const TIME_SLOTS = [
  { id: 'now', label: 'Now' },
  { id: 'schedule', label: 'Schedule for Later' }
];

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const { total, clearCart } = useCart();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('now');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Get available time slots (every 30 mins for next 7 days)
  const getTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const start = new Date(now.setMinutes(now.getMinutes() + 30));
    const end = new Date();
    end.setDate(end.getDate() + 7);

    for (let time = start; time <= end; time.setMinutes(time.getMinutes() + 30)) {
      slots.push(new Date(time));
    }
    return slots;
  };

  const handleSelectTime = (date: Date) => {
    setScheduledDate(date);
    setShowPicker(false);
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    const orderDetails = {
      paymentMethod: selectedMethod,
      scheduledTime: selectedTimeSlot === 'schedule' ? scheduledDate.toISOString() : 'now',
    };

    // Here you would normally process the payment and schedule
    alert(selectedTimeSlot === 'schedule' 
      ? `Order scheduled for ${scheduledDate.toLocaleString()}`
      : 'Order placed for immediate delivery!');
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

        {/* Scheduling Section */}
        <Text style={[styles.title, { marginTop: 24 }]}>Delivery Time</Text>
        <View style={styles.timeSlotContainer}>
          {TIME_SLOTS.map((slot) => (
            <Pressable
              key={slot.id}
              style={[
                styles.timeSlotCard,
                selectedTimeSlot === slot.id && styles.selectedTimeSlot
              ]}
              onPress={() => setSelectedTimeSlot(slot.id)}
            >
              <MaterialIcons 
                name={slot.id === 'now' ? 'access-time' : 'schedule'} 
                size={24} 
                color={selectedTimeSlot === slot.id ? '#2E8B57' : '#666'} 
              />
              <Text style={[
                styles.timeSlotText,
                selectedTimeSlot === slot.id && styles.selectedTimeSlotText
              ]}>
                {slot.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Schedule Picker */}
        {selectedTimeSlot === 'schedule' && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleLabel}>Select Date and Time:</Text>
            <Pressable 
              style={styles.datePickerButton}
              onPress={() => setShowPicker(true)}
            >
              <MaterialIcons name="event" size={24} color="#2E8B57" />
              <Text style={styles.dateText}>
                {scheduledDate.toLocaleString()}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Time Picker Modal */}
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Delivery Time</Text>
              <ScrollView style={styles.timeList}>
                {getTimeSlots().map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.timeOption}
                    onPress={() => handleSelectTime(time)}
                  >
                    <Text style={styles.timeOptionText}>
                      {time.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

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
          <Text style={styles.payButtonText}>
            {selectedTimeSlot === 'schedule' ? 'Schedule Order' : 'Pay Now'}
          </Text>
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
  timeSlotContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  timeSlotCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    gap: 12,
  },
  selectedTimeSlot: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E8B57',
    borderWidth: 1,
  },
  timeSlotText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTimeSlotText: {
    color: '#2E8B57',
    fontWeight: '600',
  },
  scheduleContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  scheduleLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  timeList: {
    maxHeight: 400,
  },
  timeOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
}); 