import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

// Add this type for valid coupon codes
type ValidCouponCodes = 'FIRST10' | 'SAVE20' | 'SPECIAL25';

// Update the VALID_COUPONS definition
const VALID_COUPONS: Record<ValidCouponCodes, number> = {
  'FIRST10': 10,
  'SAVE20': 20,
  'SPECIAL25': 25
};

export default function CartScreen() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [orderType, setOrderType] = useState<'now' | 'scheduled'>('now');
  const [showInstructions, setShowInstructions] = useState(false);

  const getAvailableTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const start = new Date(now.setMinutes(now.getMinutes() + 30));
    const end = new Date(now);
    end.setHours(end.getHours() + 5);

    for (let time = start; time <= end; time.setMinutes(time.getMinutes() + 30)) {
      slots.push(new Date(time));
    }
    return slots;
  };

  const [availableSlots] = useState(getAvailableTimeSlots());

  const applyCoupon = () => {
    const code = couponCode.toUpperCase() as ValidCouponCodes;
    const discount = VALID_COUPONS[code];
    if (discount) {
      setAppliedDiscount(discount);
    } else {
      alert('Invalid coupon code');
    }
  };

  const finalTotal = (parseFloat(total) * (100 - appliedDiscount) / 100).toFixed(2);

  const handleCheckout = () => {
    const checkoutTotal = parseFloat(finalTotal); // Convert string to number
    router.push({
      pathname: '/payment',
      params: {
        total: checkoutTotal,
        orderType,
        scheduledTime: orderType === 'scheduled' ? selectedTime.toISOString() : undefined
      }
    });
  };

  const InstructionsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showInstructions}
      onRequestClose={() => setShowInstructions(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Schedule Order Feature</Text>
          
          <View style={styles.instructionItem}>
            <MaterialIcons name="schedule" size={24} color="#2E8B57" />
            <Text style={styles.instructionText}>
              Plan your order pickup time in advance
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <MaterialIcons name="event" size={24} color="#2E8B57" />
            <Text style={styles.instructionText}>
              Choose pickup times up to 5 hours in advance
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <MaterialIcons name="notifications" size={24} color="#2E8B57" />
            <Text style={styles.instructionText}>
              Get notified when your order is ready for pickup
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <MaterialIcons name="info" size={24} color="#2E8B57" />
            <Text style={styles.instructionText}>
              Perfect for lunch breaks and busy schedules
            </Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={() => setShowInstructions(false)}
          >
            <Text style={styles.closeButtonText}>Got it!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="shopping-cart" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Pressable style={styles.continueButton} onPress={() => router.back()}>
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.itemsContainer}>
        {items.map(item => (
          <View key={item.id} style={styles.cartItem}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            )}
            <View style={styles.itemInfo}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.isVeg !== undefined && (
                  <MaterialIcons 
                    name="circle" 
                    size={16} 
                    color={item.isVeg ? '#2E8B57' : '#FF4444'} 
                  />
                )}
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              
              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <MaterialIcons name="delete" size={20} color="#FF4444" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        {/* Order Type Selection */}
        <View style={styles.orderTypeSection}>
          <Text style={styles.sectionTitle}>Order Type</Text>
          <View style={styles.orderTypeButtons}>
            <Pressable
              style={[styles.typeButton, orderType === 'now' && styles.selectedType]}
              onPress={() => setOrderType('now')}
            >
              <Text style={[styles.typeText, orderType === 'now' && styles.selectedTypeText]}>
                Order Now
              </Text>
            </Pressable>
            <Pressable
              style={[styles.typeButton, orderType === 'scheduled' && styles.selectedType]}
              onPress={() => setOrderType('scheduled')}
            >
              <Text style={[styles.typeText, orderType === 'scheduled' && styles.selectedTypeText]}>
                Schedule Order
              </Text>
            </Pressable>
          </View>
        </View>

        {orderType === 'scheduled' && (
          <View style={styles.timePickerSection}>
            <Text style={styles.timePickerLabel}>Select Pickup Time:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsContainer}>
              {availableSlots.map((slot, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime.getTime() === slot.getTime() && styles.selectedTimeSlot
                  ]}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime.getTime() === slot.getTime() && styles.selectedTimeSlotText
                  ]}>
                    {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Coupon Section */}
        <View style={styles.couponSection}>
          <TextInput
            style={styles.couponInput}
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
          />
          <Pressable style={styles.applyButton} onPress={applyCoupon}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </Pressable>
        </View>

        {/* Add Schedule Order Section */}
        <View style={styles.scheduleSection}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleSectionTitle}>Schedule Order</Text>
            <Pressable
              onPress={() => setShowInstructions(true)}
              style={styles.helpButton}
            >
              <MaterialIcons name="help-outline" size={24} color="#2E8B57" />
            </Pressable>
          </View>
          
          <Text style={styles.scheduleDescription}>
            Choose when you'd like to pick up your order
          </Text>
          
          {/* Your existing time slot selection UI */}
        </View>
      </ScrollView>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${total}</Text>
        </View>
        {appliedDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.discountValue}>-{appliedDiscount}%</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${finalTotal}</Text>
        </View>
        
        <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Payment</Text>
        </Pressable>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) setSelectedTime(date);
          }}
        />
      )}

      <InstructionsModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#2E8B57',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#FF4444',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderTypeSection: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  orderTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#2E8B57',
  },
  typeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedTypeText: {
    fontWeight: 'bold',
  },
  timePickerSection: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginTop: 12,
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  slotsContainer: {
    marginTop: 8,
  },
  timeSlot: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  couponSection: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginTop: 20,
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  summarySection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  checkoutButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 12,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 16,
    color: '#2E8B57',
    fontWeight: '500',
  },
  scheduleSection: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scheduleSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scheduleDescription: {
    color: '#666',
    marginBottom: 16,
  },
  helpButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  instructionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 