import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CategoryCard from '../../components/CategoryCard';
import { CATEGORIES, API_BASE, Category } from '../../utils/constants';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

const Categories = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/products?limit=100`);
      
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

  // Calculate product count for each category
  const getProductCount = (categoryName: string): number => {
    return products.filter(p => p.category === categoryName).length;
  };

  // Handle category press - navigate to category detail page
  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${encodeURIComponent(category.name)}`);
  };

  // Render individual category card
  const renderCategoryCard = ({ item }: { item: Category }) => (
    <CategoryCard
      category={item}
      productCount={getProductCount(item.name)}
      onPress={() => handleCategoryPress(item)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-emerald-600 px-4 py-4">
        <Text className="text-white text-2xl font-bold">Browse Categories</Text>
        <Text className="text-white text-sm opacity-90 mt-1">
          Explore products by category
        </Text>
      </View>

      {/* Loading State */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-gray-500 mt-2">Loading categories...</Text>
        </View>
      ) : error ? (
        /* Error State */
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-6xl mb-4">❌</Text>
          <Text className="text-red-500 text-lg font-semibold mb-2">
            Oops! Something went wrong
          </Text>
          <Text className="text-gray-600 text-center">{error}</Text>
        </View>
      ) : CATEGORIES.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-6xl mb-4">📦</Text>
          <Text className="text-gray-800 text-lg font-semibold mb-2">
            No Categories Available
          </Text>
          <Text className="text-gray-600 text-center">
            Categories will appear here once they are added
          </Text>
        </View>
      ) : (
        /* Categories Grid */
        <FlatList
          data={CATEGORIES}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryCard}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Categories;
