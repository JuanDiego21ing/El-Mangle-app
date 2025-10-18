import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

const MOCK_PRODUCTS = {
  '1': [
    { id: 'p1', name: 'Taco al Pastor', price: 25.00, imageUrl: 'https://placehold.co/300x200/f8c291/FFFFFF?text=Pastor' },
    { id: 'p2', name: 'Gringa de Sirloin', price: 65.00, imageUrl: 'https://placehold.co/300x200/e55039/FFFFFF?text=Gringa' },
    { id: 'p3', name: 'Agua de Horchata', price: 30.00, imageUrl: 'https://placehold.co/300x200/ffffff/333333?text=Agua' },
  ],
  '2': [
    { id: 'p4', name: 'Espresso Americano', price: 45.00, imageUrl: 'https://placehold.co/300x200/4a4a4a/FFFFFF?text=Café' },
    { id: 'p5', name: 'Croissant de Mantequilla', price: 50.00, imageUrl: 'https://placehold.co/300x200/f39c12/FFFFFF?text=Pan' },
  ],
  '3': [], 
};

export default function BusinessDetailScreen({ route }) {
  // Recibimos los parámetros pasados desde HomeScreen
  const { businessId, businessData } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de productos para este negocio específico
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS[businessId] || []);
      setLoading(false);
    }, 500);
  }, [businessId]);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: businessData.mainImageUrl }} style={styles.detailImage} />
      <View style={styles.detailContentContainer}>
        <Text style={styles.detailTitle}>{businessData.name}</Text>
        <Text style={styles.detailAddress}>{businessData.address}</Text>
        <Text style={styles.detailCategory}>{businessData.category}</Text>
        
        <View style={styles.separator} />

        <Text style={styles.productsTitle}>Productos y Servicios</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#333" />
        ) : (
          products.length > 0 ? (
            products.map(product => (
              <View key={product.id} style={styles.productCard}>
                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noProductsText}>Este negocio no tiene productos registrados.</Text>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:10,
    flex: 1,
    backgroundColor: '#faebd7',
  },
  detailImage: {
    width: '100%',
    height: 250,
  },
  detailContentContainer: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  detailAddress: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  detailCategory: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  productsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
      marginLeft: 15,
      flex: 1,
  },
  productName: {
      fontSize: 16,
      fontWeight: '600',
  },
  productPrice: {
      fontSize: 15,
      color: '#4CAF50',
      marginTop: 4,
  },
  noProductsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  }
});