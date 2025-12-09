import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_BASE } from '../../../utils/constants';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/cartSlice';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  description?: string;
}

const CategoryDetail = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categoryName = decodeURIComponent(name || '');

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryName]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products filtered by category
      const response = await fetch(
        `${API_BASE}/products?category=${encodeURIComponent(categoryName)}&limit=100`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.data || data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      image: product.imageUrl || '📦',
      category: product.category,
      price: product.price
    }));
    
    Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row">
        {/* Product Image */}
        <View className="w-24 h-24 bg-gray-50 rounded-lg items-center justify-center overflow-hidden mr-4">
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

        {/* Product Details */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">{item.category}</Text>
          {item.description && (
            <Text className="text-xs text-gray-400 mt-1" numberOfLines={2}>
              {item.description}
            </Text>
          )}
          
          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text className="text-xl font-bold text-emerald-600">
                ₹{item.price}
              </Text>
              <Text className="text-xs text-gray-400">
                Stock: {item.stock}
              </Text>
            </View>
            
            <TouchableOpacity 
              className="bg-emerald-600 px-4 py-2 rounded-lg"
              onPress={() => handleAddToCart(item)}
            >
              <Text className="text-white text-sm font-semibold">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-emerald-600 px-4 py-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-3"
        >
          <Text className="text-white text-2xl">←</Text>
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold">{categoryName}</Text>
          <Text className="text-white text-sm opacity-90 mt-1">
            {loading ? 'Loading...' : `${products.length} ${products.length === 1 ? 'product' : 'products'} available`}
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-gray-500 mt-2">Loading products...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-6xl mb-4">❌</Text>
          <Text className="text-red-500 text-lg font-semibold mb-2">
            Oops! Something went wrong
          </Text>
          <Text className="text-gray-600 text-center mb-4">{error}</Text>
          <TouchableOpacity 
            className="bg-emerald-600 px-6 py-3 rounded-lg"
            onPress={fetchCategoryProducts}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : products.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-6xl mb-4">📦</Text>
          <Text className="text-gray-800 text-lg font-semibold mb-2">
            No Products Found
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            There are no products in the {categoryName} category yet.
          </Text>
          <TouchableOpacity 
            className="bg-emerald-600 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryDetail;

