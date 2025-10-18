import React, { useState, useEffect } from 'react';
import { SearchBar } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

// --- DATOS DE EJEMPLO ---
const MOCK_BUSINESSES = [
  {
    id: '1',
    name: 'Taquería El Califa',
    category: 'Restaurante Mexicano',
    mainImageUrl: 'https://placehold.co/600x400/E94F37/FFFFFF?text=Tacos',
    address: 'Av. Insurgentes Sur 123',
  },
  {
    id: '2',
    name: 'Café de la Esquina',
    category: 'Cafetería',
    mainImageUrl: 'https://placehold.co/600x400/393E41/FFFFFF?text=Café',
    address: 'Calle Madero 45',
  },
  {
    id: '3',
    name: 'Reparaciones "El Manitas"',
    category: 'Servicios del Hogar',
    mainImageUrl: 'https://placehold.co/600x400/F6F7EB/333333?text=Servicios',
    address: 'Callejón de la Herramienta 7',
  },
];

export default function HomeScreen({ navigation }) {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      item.category.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBusinesses(filtered);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  const BusinessCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('BusinessDetail', {
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

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Buscar negocio"
        onChangeText={handleSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={{ backgroundColor: '#fff' }}
        searchIcon={false}
        clearIcon={false}
      />

      {/* --- CATEGORÍAS AGREGADAS --- */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categorías</Text>
        <FlatList
          data={['Todos', 'Restaurante Mexicano', 'Cafetería', 'Servicios del Hogar']}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => {
                if (item === 'Todos') {
                  setFilteredBusinesses(businesses);
                } else {
                  setFilteredBusinesses(
                    businesses.filter((b) =>
                      b.category.toLowerCase().includes(item.toLowerCase())
                    )
                  );
                }
              }}
            >
              <Text style={styles.categoryButtonText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredBusinesses}
        renderItem={BusinessCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faebd7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 18,
    paddingTop: 80,
  },
  listContainer: {
    padding: 10,
    paddingHorizontal: 18,
  },
  cardContainer: {
    backgroundColor: '#e9967a',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardTextContainer: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  categoryButton: {
    backgroundColor: '#f4a460',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#fff',
  },
});
