import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput, // Importamos TextInput para la barra de búsqueda personalizada
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importamos los íconos

// --- INICIO DE LA MODIFICACIÓN 1 (Importar el hook) ---
import { useAuth } from "./AuthContext"; // Asegúrate que la ruta sea correcta
// --- FIN DE LA MODIFICACIÓN 1 ---

// --- DATOS DE EJEMPLO ---
const MOCK_BUSINESSES = [
  {
    id: "1",
    name: "Taquería El Super Burro",
    category: "Restaurante",
    mainImageUrl:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/f1/e7/d4/photo0jpg.jpg?w=900&h=500&s=1",
    address: "Av. Insurgentes Sur 123",
  },
  {
    id: "2",
    name: "Café DOCECUARENTA",
    category: "Cafetería",
    mainImageUrl:
      "https://media-cdn.tripadvisor.com/media/photo-s/13/4b/ed/f5/photo0jpg.jpg",
    address: "Calle Madero 45",
  },
  {
    id: "3",
    name: 'afinaciones el inyector"',
    category: "Servicios",
    mainImageUrl:
      "https://lh3.googleusercontent.com/proxy/FX0z3o5b4RAwAt5afoLiemWkCZbMNjYL9UYHyUJ-5YIFy4VTufkYKaWgRjLVh-FX-GUbMjQWTDoL1pn4g11dJZY1hNMVoviIyh7oCFRQ83PBHqd69kDm__TJdkYmSToBKeP18mbYYKxQ1TM52uiTjHP96tSYOjfzpNZwcg=s1360-w1360-h1020-rw",
    address: "Callejón de la Herramienta 7",
  },
  {
    id: "4",
    name: "Oh la la BEAUTY LAB",
    category: "Belleza",
    mainImageUrl:
      "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npM-YZiu0Njv7TPf7y3RWUxK9qNeKtOH2tbj3juSqaoBSpTuDqGX38DlooOxMVpENjwAoh_vLHrEyjHVSbDkiKAW6kkkqyInIl1UycN2nBkFYNDRi1BOrP1TGB-u1ippPfG2fs=s1360-w1360-h1020-rw",
    address: "Av. Principal 456",
  },
  {
    id: "5",
    name: "Farmacia La Paz",
    category: "Salud",
    mainImageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipPvRvN4ieAcy3_ZE24dvCCwaXzCd1cwYgjlcyDH=s1360-w1360-h1020-rw",
    address: "Calle de la Salud 10",
  },
];

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
  // --- INICIO DE LA MODIFICACIÓN 2 (Obtener el usuario) ---
  const { user, mockLogout } = useAuth(); // 'user' será null si no hay sesión, o el objeto de usuario si la hay
  // --- FIN DE LA MODIFICACIÓN 2 ---

  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    setTimeout(() => {
      setBusinesses(MOCK_BUSINESSES);
      setFilteredBusinesses(MOCK_BUSINESSES);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = businesses.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBusinesses(filtered);
    setSelectedCategory("Todos");
  };

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === "Todos") {
      setFilteredBusinesses(businesses);
    } else {
      setFilteredBusinesses(
        businesses.filter((b) => b.category === categoryName)
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e9967a" />
      </View>
    );
  }

  const renderBusinessCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("BusinessDetail", {
          businessId: item.id,
          businessName: item.name,
          businessData: item,
        })
      }
    >
      <Image source={{ uri: item.mainImageUrl }} style={styles.cardImage} />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* --- INICIO DE LA MODIFICACIÓN 3 (Botones condicionales) --- */}
      <View style={styles.authButtonContainer}>
        {user ? (
          // --- INICIO DE LA MODIFICACIÓN ---
          // Usamos un Fragment (<>) para poder mostrar dos botones
          <>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate("CreateBusiness")} 
            >
              <Text style={styles.authButtonText}>+ Registrar mi Negocio</Text>
            </TouchableOpacity>

            {/* Este es el botón de Cerrar Sesión que añadimos */}
            <TouchableOpacity
              style={[styles.authButton, styles.logoutButton]} // Asigna el estilo extra
              onPress={mockLogout} // Llama a la función del contexto
            >
              <Text style={styles.authButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </>
          // --- FIN DE LA MODIFICACIÓN ---
        ) : (
          // Esta parte queda exactamente igual
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
      {/* --- FIN DE LA MODIFICACIÓN 3 --- */}

      {/* Tu código de búsqueda (intacto) */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Buscar negocio..."
            onChangeText={handleSearch}
            value={search}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Tu código de categorías (intacto) */}
      <View style={styles.categoriesCard}>
        <FlatList
          data={MOCK_CATEGORIES}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          scrollEnabled={false} // Deshabilitamos scroll, ya es parte del header
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
      <Text style={styles.businessListTitle}>Negocios Populares</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredBusinesses}
        renderItem={renderBusinessCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

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
  // --- ESTILOS PARA LA BÚSQUEDA PERSONALIZADA ---
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
  // --- ESTILOS PARA LA NUEVA TARJETA DE CATEGORÍAS ---
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
    borderRadius: 30, // Círculo perfecto
    backgroundColor: "#faebd7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIconSelected: {
    backgroundColor: "#e9967a", // Color cuando está seleccionado
  },
  categoryText: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 2,
  },
  businessListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  // --- Estilos para las tarjetas de negocios ---
  cardContainer: {
    backgroundColor: "white", // Un fondo blanco para mejor contraste
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
  // --- INICIO DE LA MODIFICACIÓN 4 (Estilos para los nuevos botones) ---
  authButtonContainer: {
    paddingHorizontal: 18,
    paddingTop: 15, // Espacio superior
    paddingBottom: 5, // Espacio antes de la barra de búsqueda
  },
  authButton: {
    backgroundColor: "#e9967a", // Usando tu color principal
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // --- FIN DE LA MODIFICACIÓN 4 ---

  authButtonContainer: {
    paddingHorizontal: 18,
    paddingTop: 15, 
    paddingBottom: 5, 
    gap: 10, // <- AÑADE ESTA LÍNEA (para separar los botones)
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

  // --- AÑADE ESTE NUEVO ESTILO ---
  logoutButton: {
    backgroundColor: "#888", // Un color diferente para distinguirlo
  },
  // --- FIN DEL CÓDIGO A AÑADIR ---

  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  
});