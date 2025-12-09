import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { authApi } from "../../utils/api.js";
import LocationPicker from "../../components/LocationPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

// API Base URL - Update this based on your setup
// For Android Emulator: use 10.0.2.2
// For iOS Simulator: use localhost
// For Physical Device: use your computer's local IP (e.g., 192.168.1.100)
const API_BASE = "http://10.0.2.2:5000/api"; // Change this as needed

const home = () => {
  const router = useRouter();
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [locationName, setLocationName] = useState("Home");
  
  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // initialize dispatcher
  const dispatch = useDispatch()

  useEffect(() => {
    loadSavedLocation();
    fetchProducts();
  }, [selectedCategory, currentPage]);

  const fetchProducts = async (search = "") => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string
      let url = `${API_BASE}/products?page=${currentPage}&limit=20`;
      if (search || searchQuery) {
        url += `&q=${search || searchQuery}`;
      }
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      
      const data = await response.json();
      setProducts(data.data || data);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE}/products/${productId}`, {
                method: "DELETE",
              });
              
              if (!response.ok) {
                throw new Error("Failed to delete product");
              }
              
              Alert.alert("Success", "Product deleted successfully");
              fetchProducts(); // Refresh list
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete product");
            }
          },
        },
      ]
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(searchQuery);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1);
  };

  const loadSavedLocation = async () => {
    try {
      const saved = await AsyncStorage.getItem("userLocation");
      if (saved) {
        const location = JSON.parse(saved);
        setLocationName(location.address || "Home");
      }
    } catch (error) {
      console.error("Error loading location:", error);
    }
  };

  const handleLocationSelect = async (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => {
    setLocationName(location.address || "Home");
    await AsyncStorage.setItem("userLocation", JSON.stringify(location));
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await authApi.logout();
          router.replace("/");
        },
      },
    ]);
  };
  
  // Categories data
  const categories = [
    { id: 1, name: "Fruits", icon: "🍎", color: "bg-red-100" },
    { id: 2, name: "Vegetables", icon: "🥬", color: "bg-green-100" },
    { id: 3, name: "Dairy", icon: "🥛", color: "bg-blue-100" },
    { id: 4, name: "Snacks", icon: "🍪", color: "bg-yellow-100" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View className="bg-emerald-600 px-4 pt-2 pb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-white text-xs opacity-90">Delivery to</Text>
              <View className="flex-row items-center">
                <Text
                  className="text-white text-base font-bold mr-1"
                  numberOfLines={1}
                  style={{ maxWidth: "70%" }}
                >
                  {locationName}
                </Text>
                <Text className="text-white text-lg">▼</Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-white/20 px-3 py-2 rounded-full"
                onPress={() => setLocationPickerVisible(true)}
              >
                <Text className="text-white text-xs font-semibold">
                  📍 Change
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white/20 px-3 py-2 rounded-full"
                onPress={handleLogout}
              >
                <Text className="text-white text-xs font-semibold">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="bg-white rounded-xl px-4 py-3 flex-row items-center">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Search for products..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                  fetchProducts("");
                }}
                className="ml-2"
              >
                <Text className="text-gray-400">✕</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity 
              onPress={handleSearch}
              className="ml-2 bg-emerald-600 px-3 py-1 rounded-lg"
            >
              <Text className="text-white text-xs font-semibold">Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Banner */}

        <View className="bg-emerald-50 px-4 py-3 flex-row items-center justify-between border-b border-emerald-100">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-2">⚡</Text>
            <View>
              <Text className="text-emerald-800 font-bold text-sm">
                Delivery in 10-15 mins
              </Text>
              <Text className="text-emerald-600 text-xs">
                Express delivery available
              </Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text className="text-emerald-600 font-semibold text-xs">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}

        <View className="px-4 py-4 bg-white">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Categories
          </Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }: any) => (
              <TouchableOpacity 
                onPress={() => handleCategoryFilter(item.name)}
                className="items-center mr-4"
              >
                <View
                  className={`w-16 h-16 rounded-full ${
                    selectedCategory === item.name ? 'bg-emerald-200' : item.color
                  } items-center justify-center mb-2 ${
                    selectedCategory === item.name ? 'border-2 border-emerald-600' : ''
                  }`}
                >
                  <Text className="text-3xl">{item.icon}</Text>
                </View>
                <Text className={`text-xs font-medium ${
                  selectedCategory === item.name ? 'text-emerald-600 font-bold' : 'text-gray-700'
                }`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        </View>

        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-800">
              {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
              {searchQuery ? ` (Search: "${searchQuery}")` : ''}
            </Text>
            <TouchableOpacity onPress={() => fetchProducts()}>
              <Text className="text-emerald-600 font-semibold text-sm">
                Refresh →
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#059669" />
              <Text className="text-gray-500 mt-2">Loading products...</Text>
            </View>
          ) : error ? (
            <View className="py-8 items-center">
              <Text className="text-red-500 mb-2">❌ {error}</Text>
              <TouchableOpacity 
                className="bg-emerald-600 px-4 py-2 rounded-lg"
                onPress={fetchProducts}
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={products}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any) => item._id || item.id?.toString()}
              renderItem={({ item }: any) => (
                <View
                  className="bg-white rounded-xl p-3 mr-3 shadow-sm border border-gray-100"
                  style={{ width: 160 }}
                >
                  <View className="w-full h-24 bg-gray-50 rounded-lg items-center justify-center mb-2 overflow-hidden">
                    {item.imageUrl ? (
                      <Image 
                        source={{ uri: item.imageUrl }} 
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-4xl">📦</Text>
                    )}
                  </View>

                  <Text
                    className="text-sm font-semibold text-gray-800"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500">{item.category}</Text>
                  <Text className="text-xs text-gray-400">Stock: {item.stock}</Text>

                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-lg font-bold text-emerald-600">
                      ₹{item.price}
                    </Text>
                    <View className="flex-row gap-1">
                      <TouchableOpacity 
                        className="bg-emerald-600 px-2 py-1 rounded-lg"
                        onPress={() => {
                          dispatch(addToCart({
                            id: item._id || item.id,
                            name: item.name,
                            image: item.imageUrl || '📦',
                            category: item.category,
                            price: item.price
                          }))
                        }}
                      >
                        <Text className="text-white text-xs font-semibold">
                          Add
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        className="bg-red-500 px-2 py-1 rounded-lg"
                        onPress={() => handleDeleteProduct(item._id)}
                      >
                        <Text className="text-white text-xs font-semibold">
                          🗑️
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            />
          )}

          {/* Pagination Controls */}
          {!loading && !error && totalPages > 1 && (
            <View className="flex-row items-center justify-center mt-4 gap-2">
              <TouchableOpacity 
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1 ? 'bg-gray-200' : 'bg-emerald-600'
                }`}
                onPress={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <Text className={`font-semibold ${
                  currentPage === 1 ? 'text-gray-400' : 'text-white'
                }`}>
                  ← Previous
                </Text>
              </TouchableOpacity>
              
              <Text className="text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </Text>
              
              <TouchableOpacity 
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages ? 'bg-gray-200' : 'bg-emerald-600'
                }`}
                onPress={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <Text className={`font-semibold ${
                  currentPage === totalPages ? 'text-gray-400' : 'text-white'
                }`}>
                  Next →
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPicker
        visible={locationPickerVisible}
        onClose={() => setLocationPickerVisible(false)}
        onLocationSelect={handleLocationSelect}
      />
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
