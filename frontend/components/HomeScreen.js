import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList, // <-- 1. CAMBIAMOS FlatList por SectionList
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert, // <-- Para manejar errores
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./AuthContext"; // Para saber quién es el usuario
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // <-- 2. Importamos la BD REAL
import { collection, query, onSnapshot } from "firebase/firestore"; // <-- 3. Funciones de Firestore

// --- YA NO NECESITAMOS MOCK_BUSINESSES (borrado) ---

// (Tus MOCK_CATEGORIES se quedan igual)
const MOCK_CATEGORIES = [
  { id: "1", name: "Todos", icon: "apps-outline" },
  { id: "2", name: "Restaurante", icon: "restaurant-outline" },
  { id: "3", name: "Cafetería", icon: "cafe-outline" },
  { id: "4", name: "Servicios", icon: "build-outline" },
  { id: "5", name: "Compras", icon: "cart-outline" },
  { id: "6", name: "Salud", icon: "medkit-outline" },
  { id: "7", name: "Belleza", icon: "cut-outline" },
  { id: "8", name: "Más", icon: "grid-outline" },
];

const NUM_COLUMNS = 4;

export default function HomeScreen({ navigation }) {
  const { user } = useAuth(); // Obtenemos el usuario REAL
  
  // --- 4. NUEVOS ESTADOS PARA LOS DATOS ---
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  // 'allBusinesses' guarda la lista COMPLETA de Firestore
  const [allBusinesses, setAllBusinesses] = useState([]);
  
  // 'filteredBusinesses' guarda la lista DESPUÉS de aplicar filtros/búsqueda
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  
  // 'sectionedData' guarda los datos formateados para la SectionList
  const [sectionedData, setSectionedData] = useState([]);


  // --- 5. USEEFFECT PARA LEER DATOS DE FIRESTORE EN TIEMPO REAL ---
  useEffect(() => {
    setLoading(true);
    // Creamos una consulta a la colección "businesses"
    const q = query(collection(db, "businesses"));

    // onSnapshot es un "oyente" que se actualiza en tiempo real
    // cada vez que algo cambia en la base de datos
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const businessesFromDB = [];
      querySnapshot.forEach((doc) => {
        businessesFromDB.push({ ...doc.data(), id: doc.id });
      });
      
      setAllBusinesses(businessesFromDB); // Guardamos la lista completa
      setFilteredBusinesses(businessesFromDB); // Inicialmente, la lista filtrada es igual
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener negocios: ", error);
      Alert.alert("Error", "No se pudieron cargar los negocios.");
      setLoading(false);
    });

    // Limpiamos el "oyente" cuando el usuario sale de la pantalla
    return () => unsubscribe();
  }, []); // El array vacío [] asegura que esto solo se ejecute 1 vez

  // --- 6. USEEFFECT PARA FILTRAR Y SEPARAR EN SECCIONES ---
  // Este efecto se re-ejecuta CADA VEZ que el usuario (des)loguea o
  // la lista de 'filteredBusinesses' cambia (por búsqueda o categoría).
  useEffect(() => {
    let businessesToSection = [...filteredBusinesses]; // Empezamos con la lista filtrada

    // Aplicamos filtro de BÚSQUEDA
    if (search) {
      businessesToSection = businessesToSection.filter((item) =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Aplicamos filtro de CATEGORÍA
    if (selectedCategory !== "Todos") {
      businessesToSection = businessesToSection.filter(
        (b) => b.category === selectedCategory
      );
    }
    
    // Ahora, separamos en secciones
    if (!user) {
      // Si no hay usuario, todos van a una sección
      setSectionedData([
        { title: "Negocios Populares", data: businessesToSection }
      ]);
    } else {
      // Si hay usuario, separamos en "míos" y "otros"
      const myBusinesses = [];
      const otherBusinesses = [];
      
      businessesToSection.forEach(business => {
        if (business.ownerId === user.uid) {
          myBusinesses.push(business);
        } else {
          otherBusinesses.push(business);
        }
      });

      const sections = [];
      if (myBusinesses.length > 0) {
        sections.push({ title: 'Mis Negocios', data: myBusinesses });
      }
      if (otherBusinesses.length > 0) {
        sections.push({ title: 'Otros Negocios', data: otherBusinesses });
      }
      setSectionedData(sections);
    }

  }, [filteredBusinesses, user, search, selectedCategory]); // <-- Dependencias

  
  // --- 7. ACTUALIZAMOS LAS FUNCIONES DE FILTRO ---
  // Ya no filtran, solo actualizan el estado. El useEffect de arriba hará el trabajo.
  const handleSearch = (text) => {
    setSearch(text);
    // Al buscar, reseteamos la categoría
    setSelectedCategory("Todos");
  };

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName);
    // Al filtrar, reseteamos la búsqueda
    setSearch("");
  };

  // --- (Función de Logout REAL, ya la tenías) ---
  const handleLogout = () => {
    signOut(auth).catch((error) => Alert.alert("Error", error.message));
  };


  // --- (renderBusinessCard se queda igual) ---
  const renderBusinessCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("BusinessDetail", {
          // Pasamos el objeto 'item' completo
          businessData: item,
          // Pasamos los params que ya tenías (por si BusinessDetail los usa)
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

  // --- (renderHeader se queda igual) ---
  const renderHeader = () => (
    <>
      {/* (Botones de Login/Logout) */}
      <View style={styles.authButtonContainer}>
        {user ? (
          <>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate("CreateBusiness")}
            >
              <Text style={styles.authButtonText}>+ Registrar mi Negocio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.authButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.authButtonText}>
              Iniciar Sesión / Registrarse
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* (Barra de Búsqueda) */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar negocio..."
            onChangeText={handleSearch}
            value={search}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* (Categorías) */}
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
                  color={selectedCategory === item.name ? "#FFF" : "#e9967a"}
                />
              </View>
              <Text style={styles.categoryText} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* (Quitamos el título "Negocios Populares" de aquí, porque ahora lo pone la sección) */}
    </>
  );

  // --- (Spinner de Carga, se queda igual) ---
  if (loading && allBusinesses.length === 0) { // Mostramos si está cargando Y no hay datos
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e9967a" />
      </View>
    );
  }

  // --- 8. CAMBIAMOS EL RETURN FINAL A SECTIONLIST ---
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sectionedData} // <-- Usa las secciones
        keyExtractor={(item) => item.id}
        renderItem={renderBusinessCard} // <-- Reutiliza tu render de tarjeta
        ListHeaderComponent={renderHeader} // <-- Reutiliza tu cabecera
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        // Función para renderizar el título de CADA sección
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron negocios</Text>
            <Text style={styles.emptySubtext}>Intenta ajustar tu búsqueda o filtros.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// --- 9. AÑADIMOS/ACTUALIZAMOS ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faebd7",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faebd7",
  },
  // (Estilos de búsqueda, categorías y tarjetas se quedan igual)
  searchContainer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 5,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  categoriesCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    marginVertical: 15,
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
    backgroundColor: "#faebd7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIconSelected: {
    backgroundColor: "#e9967a",
  },
  categoryText: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 2,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    color: "#333",
  },
  cardCategory: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  // (Estilos de botones de Auth se quedan igual)
  authButtonContainer: {
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 5,
    gap: 10,
  },
  authButton: {
    backgroundColor: "#e9967a",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: "#888",
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  // --- ESTILOS NUEVOS ---
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#faebd7", // Mismo fondo que la app
    paddingTop: 15,
    paddingBottom: 10,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  }
});