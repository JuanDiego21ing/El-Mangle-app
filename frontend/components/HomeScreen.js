import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons"; // (Ya lo teníamos, ahora lo usamos más)
import { useAuth } from "./AuthContext";
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, query, onSnapshot } from "firebase/firestore";

// (Tus MOCK_CATEGORIES se quedan igual)
const MOCK_CATEGORIES = [
  { id: "1", name: "Todos", icon: "apps-outline" },
  { id: "2", name: "Restaurante", icon: "restaurant-outline" },
  { id: "3", name: "Cafetería", icon: "cafe-outline" },
  { id: "4.s", name: "Servicios", icon: "build-outline" },
  { id: "5.c", name: "Compras", icon: "cart-outline" },
  { id: "6.s", name: "Salud", icon: "medkit-outline" },
  { id: "7.b", name: "Belleza", icon: "cut-outline" },
  { id: "8.m", name: "Más", icon: "grid-outline" },
];

const NUM_COLUMNS = 4;

export default function HomeScreen({ navigation }) {
  // (Toda tu lógica de 'useState', 'useEffect' y 'useMemo' se queda 100% igual)
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [allBusinesses, setAllBusinesses] = useState([]);
  
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "businesses"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const businessesFromDB = [];
      querySnapshot.forEach((doc) => {
        businessesFromDB.push({ ...doc.data(), id: doc.id });
      });
      setAllBusinesses(businessesFromDB);
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener negocios: ", error);
      Alert.alert("Error", "No se pudieron cargar los negocios.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const sectionedData = useMemo(() => {
    let businessesToFilter = [...allBusinesses];
    if (search) {
      businessesToFilter = businessesToFilter.filter((item) =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory !== "Todos") {
      businessesToFilter = businessesToFilter.filter(
        (b) => b.category === selectedCategory
      );
    }
    if (!user) {
      return [{ title: "Negocios Populares", data: businessesToFilter }];
    } else {
      const myBusinesses = [];
      const otherBusinesses = [];
      businessesToFilter.forEach(business => {
        if (business.ownerId === user.uid) {
          myBusinesses.push(business);
        } else {
          otherBusinesses.push(business);
        }
      });
      const sections = [];
      if (myBusinesses.length > 0) sections.push({ title: 'Mis Negocios', data: myBusinesses });
      if (otherBusinesses.length > 0) sections.push({ title: 'Otros Negocios', data: otherBusinesses });
      return sections;
    }
  }, [allBusinesses, user, search, selectedCategory]);

  const handleSearch = (text) => {
    setSearch(text);
    setSelectedCategory("Todos");
  };
  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearch("");
  };
  const handleLogout = () => {
    signOut(auth).catch((error) => Alert.alert("Error", error.message));
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtonContainer}>
          {user ? (
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.headerButtonTextLogout}>Cerrar Sesión</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.headerButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, user]);


  // --- 1. 'renderBusinessCard' MODIFICADO ---
  const renderBusinessCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("BusinessDetail", {
          businessData: item,
          businessId: item.id, 
          businessName: item.nombre,
        })
      }
    >
      {/* Columna 1: Logo */}
      {item.mainImageUrl ? (
        <Image source={{ uri: item.mainImageUrl }} style={styles.cardLogo} />
      ) : (
        <View style={styles.cardLogoPlaceholder}>
          <Ionicons name="image-outline" size={30} color="#CCC" />
        </View>
      )}
      
      {/* Columna 2: Info del Negocio */}
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.nombre}</Text>
        <Text style={styles.cardCategory} numberOfLines={1}>{item.category}</Text>
        
        {/* Info adicional con iconos */}
        {item.address && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color="#555" style={styles.detailIcon} />
            <Text style={styles.detailText} numberOfLines={1}>{item.address}</Text>
          </View>
        )}
        {item.horario && (
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={14} color="#555" style={styles.detailIcon} />
            <Text style={styles.detailText} numberOfLines={1}>{item.horario}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  // --- FIN DE LA MODIFICACIÓN ---


  // ('renderHeader' se queda igual)
  const renderHeader = useCallback(() => (
    <>
      <View style={styles.authButtonContainer}>
        {user && (
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate("CreateBusiness")}
          >
            <Text style={styles.authButtonText}>+ Registrar mi Negocio</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.categoriesCard}>
        <FlatList
          data={MOCK_CATEGORIES}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(item.name)}
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  selectedCategory === item.name && styles.categoryIconSelected,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={35}
                  color={selectedCategory === item.name ? "#FFFFFF" : "#007AFF"}
                />
              </View>
              <Text style={styles.categoryText} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  ), [user, selectedCategory]);

  // (Spinner de Carga se queda igual)
  if (loading && allBusinesses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // (El 'return' principal se queda igual)
  return (
    <SafeAreaView style={styles.container}>
      
      {/* La barra de búsqueda (intacta) */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar negocio..."
            onChangeText={handleSearch}
            value={search}
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {/* La SectionList (intacta) */}
      <SectionList
        style={{flex: 1}}
        sections={sectionedData}
        keyExtractor={(item) => item.id}
        renderItem={renderBusinessCard}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron negocios</Text>
            <Text style={styles.emptySubtext}>Intenta ajustar tu búsqueda o filtros.</Text>
          </View>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

// --- 2. 'styles' MODIFICADOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  headerButtonContainer: {
    marginRight: 10,
  },
  headerButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  headerButtonTextLogout: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 5,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222222",
  },
  // Corrección de alineación: Padding de la lista
  listContainer: {
    paddingHorizontal: 18, 
    paddingBottom: 20,
  },
  categoriesCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    marginVertical: 15,
    // (Quitamos el 'marginHorizontal', ya lo maneja 'listContainer')
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryItem: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    paddingVertical: 10,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIconSelected: {
    backgroundColor: "#FFC107",
  },
  categoryText: {
    fontSize: 12,
    textAlign: "center",
    color: "#555555",
    paddingHorizontal: 2,
  },

  // --- ESTILOS DE TARJETA NUEVOS/MODIFICADOS ---
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    // (Quitamos 'marginHorizontal')
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row', // <-- La clave del cambio
    alignItems: 'center', // <-- Alinear logo y texto
    padding: 12, // <-- Padding interno
  },
  cardLogo: { // <-- Nuevo estilo (reemplaza 'cardImage')
    width: 80,
    height: 80,
    borderRadius: 12, // <-- Bordes redondeados
    marginRight: 12,
    resizeMode: 'cover',
  },
  cardLogoPlaceholder: { // <-- Nuevo estilo
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1, // <-- Ocupa el espacio restante
    padding: 0, // <-- Ya no necesita padding
  },
  cardTitle: {
    fontSize: 18, // <-- Un poco más pequeño
    fontWeight: "bold",
    color: "#222222",
  },
  cardCategory: {
    fontSize: 14,
    color: "#007AFF", // <-- Usamos el azul de acento
    marginTop: 2,
    marginBottom: 6,
  },
  detailRow: { // <-- Nuevo estilo
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailIcon: { // <-- Nuevo estilo
    marginRight: 5,
  },
  detailText: { // <-- Nuevo estilo
    fontSize: 13,
    color: '#555555',
    flex: 1, // Para que se ajuste y no se desborde
  },
  // --- FIN DE ESTILOS DE TARJETA ---

  authButtonContainer: {
    paddingHorizontal: 0, // <-- Quitamos padding, 'listContainer' lo maneja
    paddingTop: 15,
    paddingBottom: 5,
    gap: 10,
  },
  authButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222222",
    backgroundColor: "#FFFFFF",
    paddingTop: 15,
    paddingBottom: 10,
    // (Quitamos 'paddingHorizontal', 'listContainer' lo maneja)
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#777777',
    marginTop: 8,
  }
});