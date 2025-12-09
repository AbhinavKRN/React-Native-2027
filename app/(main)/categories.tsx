import { 
  FlatList, 
  Text, 
  View, 
  ActivityIndicator, 
  TextInput, 
  RefreshControl,
  TouchableOpacity 
} from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [useIconLibrary, setUseIconLibrary] = useState(true);

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

  const getTotalValue = (categoryName: string): number => {
    return products
      .filter(p => p.category === categoryName)
      .reduce((sum, p) => sum + p.price * p.stock, 0);
  };

  const getMostPopularCategory = (): string => {
    const counts = CATEGORIES.map(cat => ({
      name: cat.name,
      count: getProductCount(cat.name)
    }));
    const maxCount = Math.max(...counts.map(c => c.count));
    const mostPopular = counts.find(c => c.count === maxCount);
    return mostPopular?.name || '';
  };

  const filteredCategories = CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  // Handle category press - navigate to category detail page
  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${encodeURIComponent(category.name)}`);
  };

  // Render individual category card
  const renderCategoryCard = ({ item }: { item: Category }) => {
    const mostPopular = getMostPopularCategory();
    return (
      <CategoryCard
        category={item}
        productCount={getProductCount(item.name)}
        totalValue={getTotalValue(item.name)}
        isMostPopular={item.name === mostPopular && getProductCount(item.name) > 0}
        onPress={() => handleCategoryPress(item)}
        useIconLibrary={useIconLibrary}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-emerald-600 px-4 pt-4 pb-3">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Browse Categories</Text>
            <Text className="text-white text-sm opacity-90 mt-1">
              Explore products by category
            </Text>
          </View>
          
          {/* Toggle Icon Library */}
          <TouchableOpacity 
            onPress={() => setUseIconLibrary(!useIconLibrary)}
            className="bg-white/20 px-3 py-2 rounded-full"
          >
            <Text className="text-white text-xs font-semibold">
              {useIconLibrary ? '🎨 Emoji' : '📦 Icons'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-xl px-4 py-3 flex-row items-center">
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Search categories..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
              <Text className="text-gray-400">✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
            {searchQuery ? 'No Matching Categories' : 'No Categories Available'}
          </Text>
          <Text className="text-gray-600 text-center">
            {searchQuery 
              ? `No categories match "${searchQuery}"`
              : 'Categories will appear here once they are added'
            }
          </Text>
          {searchQuery && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              className="mt-4 bg-emerald-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : filteredCategories.length === 0 ? (
        /* No Search Results */
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-6xl mb-4">🔍</Text>
          <Text className="text-gray-800 text-lg font-semibold mb-2">
            No Results Found
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            No categories match "{searchQuery}"
          </Text>
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            className="bg-emerald-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Clear Search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Categories Grid */
        <FlatList
          data={filteredCategories}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryCard}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#059669']}
              tintColor="#059669"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Categories;
