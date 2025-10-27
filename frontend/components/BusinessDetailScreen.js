// components/BusinessDetailScreen.js
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  FlatList 
} from 'react-native';
import { useAuth } from './AuthContext'; // Para saber quién está logueado

export default function BusinessDetailScreen({ route, navigation }) {
  const { user } = useAuth(); // Obtenemos nuestro usuario simulado
  
  // Obtenemos los datos del negocio que HomeScreen nos pasó
  const { businessData } = route.params;

  // --- ¡LA LÓGICA CLAVE! ---
  // Checamos si el 'user' actual es el dueño de este negocio
  const isOwner = user && businessData.ownerId === user.uid;

  // Función para renderizar cada producto
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      {/* (Aquí podrías poner la imagen del producto) */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDesc}>{item.desc}</Text>
      </View>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Image source={{ uri: businessData.mainImageUrl }} style={styles.mainImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{businessData.name}</Text>
          <Text style={styles.category}>{businessData.category}</Text>
          <Text style={styles.address}>{businessData.address}</Text>
          {/* (Aquí puedes agregar más detalles del negocio: horario, tel, etc.) */}
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Productos y Servicios</Text>

          {/* --- ¡BOTÓN CONDICIONAL! --- */}
          {/* Solo si eres el dueño, muestras el botón de "Añadir" */}
          {isOwner && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddProduct', { businessId: businessData.id })}
            >
              <Text style={styles.addButtonText}>+ Añadir Producto/Servicio</Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={businessData.products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Para que no haya scroll anidado
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Este negocio aún no tiene productos registrados.</Text>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  mainImage: { width: '100%', height: 250 },
  infoContainer: { padding: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  category: { fontSize: 16, color: '#e9967a', fontWeight: '500', marginTop: 4 },
  address: { fontSize: 16, color: '#666', marginTop: 10 },
  productsContainer: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  addButton: {
    backgroundColor: '#e9967a', // Tu color principal
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  productInfo: { flex: 1, marginRight: 10 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#444' },
  productDesc: { fontSize: 14, color: '#777', marginTop: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#e9967a' },
  emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', padding: 20 }
});