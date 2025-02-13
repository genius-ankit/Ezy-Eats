import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  image: string;
  onPress: () => void;
}

export default function MenuItem({ name, price, description, image, onPress }: MenuItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>₹{price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
}); 