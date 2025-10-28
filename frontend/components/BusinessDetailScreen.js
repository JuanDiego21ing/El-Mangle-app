import React, { useState, useEffect } from 'react'; // <-- 1. Importa useState/useEffect
import { 
  StyleSheet, Text, View, SafeAreaView, ScrollView, 
  Image, TouchableOpacity, FlatList, ActivityIndicator 
} from 'react-native';
import { useAuth } from './AuthContext';

// --- INICIO DE LA MODIFICACIÓN (Imports de Firebase) ---
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
// --- FIN DE LA MODIFICACIÓN ---

export default function BusinessDetailScreen({ route, navigation }) {
  const { user } = useAuth();
  
  // Obtenemos el ID del negocio de los parámetros
  const { businessId } = route.params;

  // --- INICIO DE LA MODIFICACIÓN (Estado en tiempo real) ---
  const [loading, setLoading] = useState(true);
  // Usamos el 'businessData' que nos pasó HomeScreen como estado inicial
  const [businessData, setBusinessData] = useState(route.params.businessData || null);

  // Este 'useEffect' se conecta a Firestore y escucha cambios
  useEffect(() => {
    setLoading(true);
    // Apunta al documento exacto del negocio
    const docRef = doc(db, "businesses", businessId);

    // 'onSnapshot' es el oyente en tiempo real
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setBusinessData({ ...doc.data(), id: doc.id }); // Actualiza el estado con los nuevos datos
      } else {
        console.log("No se encontró el documento!");
        navigation.goBack(); // Vuelve si el negocio fue borrado
      }
      setLoading(false);
    });

    // Limpia el oyente cuando el usuario sale de la pantalla
    return () => unsubscribe();
  }, [businessId]); // Se re-ejecuta si el businessId cambia
  
  // --- FIN DE LA MODIFICACIÓN ---

  // (El renderProduct se queda igual)
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productDesc}>{item.descripcion}</Text>
      </View>
      <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
    </View>
  );

  // Mostramos un 'cargando' mientras el oyente se conecta
  if (loading || !businessData) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color="#e9967a" />
      </SafeAreaView>
    );
  }

  // --- INICIO DE LA MODIFICACIÓN (Lógica condicional) ---
  // Ahora la lógica de 'isOwner' se calcula con el estado en tiempo real
  const isOwner = user && businessData.ownerId === user.uid;
  // --- FIN DE LA MODIFICACIÓN ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Image source={{ uri: businessData.mainImageUrl }} style={styles.mainImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{businessData.nombre}</Text>
          <Text style={styles.category}>{businessData.category}</Text>
          <Text style={styles.address}>{businessData.address}</Text>
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Productos y Servicios</Text>

          {isOwner && (
            <TouchableOpacity 
              style={styles.addButton}
              // Pasamos el ID real al formulario de añadir producto
              onPress={() => navigation.navigate('AddProduct', { businessId: businessData.id })}
            >
              <Text style={styles.addButtonText}>+ Añadir Producto/Servicio</Text>
            </TouchableOpacity>
          )}

          <FlatList
            // Usamos el array 'products' del estado en tiempo real
            data={businessData.products} 
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Este negocio aún no tiene productos registrados.</Text>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// (Tus estilos se quedan casi igual, solo añadimos 'center')
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  center: { justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '100%', height: 250 },
  infoContainer: { padding: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  category: { fontSize: 16, color: '#e9967a', fontWeight: '500', marginTop: 4 },
  address: { fontSize: 16, color: '#666', marginTop: 10 },
  productsContainer: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  addButton: {
    backgroundColor: '#e9967a',
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
  productDesc: { fontSize: 14, color: '#777', marginTop: 4 }, // Cambié 'productDesc' para que coincida
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#e9967a' },
  emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', padding: 20 }
});