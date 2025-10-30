import React, { useState, useEffect, useMemo, useCallback } from "react"; // <-- 1. Importa useMemo y useCallback
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [allBusinesses, setAllBusinesses] = useState([]);
  
  // (El useEffect de Firestore se queda igual)
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

  
  // --- 2. USAMOS 'useMemo' PARA CALCULAR LOS DATOS FILTRADOS Y SECCIONADOS ---
  // Esto es más eficiente. Solo se re-calcula si una de las dependencias cambia.
  const sectionedData = useMemo(() => {
    let businessesToFilter = [...allBusinesses];

    // 1. Aplicamos filtro de BÚSQUEDA
    if (search) {
      businessesToFilter = businessesToFilter.filter((item) =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // 2. Aplicamos filtro de CATEGORÍA
    if (selectedCategory !== "Todos") {
      businessesToFilter = businessesToFilter.filter(
        (b) => b.category === selectedCategory
      );
    }
    
    // 3. Separamos en secciones
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
  }, [allBusinesses, user, search, selectedCategory]); // <-- Dependencias
  // --- FIN DE 'useMemo' ---

  
  // (Las funciones de 'handle' se quedan igual)
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

  // (El useEffect de la cabecera se queda igual)
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

  // (renderBusinessCard se queda igual)
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
      <Image source={{ uri: item.mainImageUrl }} style={styles.cardImage} />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <Text style={styles.cardCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  // --- 3. 'renderHeader' MODIFICADO ---
  // Se ha quitado la barra de búsqueda de aquí.
  // Usamos 'useCallback' para que esta función sea estable y no se
  // recree innecesariamente, mejorando el rendimiento de SectionList.
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
      
      {/* Las categorías se quedan aquí */}
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
  ), [user, selectedCategory]); // <-- Dependencias de renderHeader
  // --- FIN DE 'renderHeader' ---

  // (El spinner de carga se queda igual)
  if (loading && allBusinesses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // --- 4. 'return' MODIFICADO ---
  return (
    <SafeAreaView style={styles.container}>
      
      {/* La barra de búsqueda AHORA VIVE AQUÍ (fuera de la lista) */}
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

      {/* La SectionList ahora toma el espacio restante */}
      <SectionList
        style={{flex: 1}} // <-- Ocupa el espacio
        sections={sectionedData} // <-- Usa los datos de useMemo
        keyExtractor={(item) => item.id}
        renderItem={renderBusinessCard}
        ListHeaderComponent={renderHeader} // <-- Cabecera (sin búsqueda)
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
        // Optimización: le dice a la lista que no se mueva si solo cambian los items
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

// (Los estilos se quedan 100% igual que en la versión anterior)
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
    paddingTop: 10, // <-- Damos un poco de espacio
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
  listContainer: {
    // Ya no necesita padding horizontal, el <SectionList> lo maneja
    paddingBottom: 20,
  },
  categoriesCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    marginVertical: 15,
    marginHorizontal: 18, // <-- Añadimos margen horizontal
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
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 18, // <-- Añadimos margen horizontal
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardTextContainer: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222222",
  },
  cardCategory: {
    fontSize: 14,
    color: "#555555",
    marginTop: 4,
  },
  authButtonContainer: {
    paddingHorizontal: 18,
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
  logoutButton: {
    backgroundColor: "#8E8E93",
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
    paddingHorizontal: 18, // <-- Añadimos padding horizontal
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