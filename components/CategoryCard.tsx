import { Text, TouchableOpacity, Animated, View } from 'react-native';
import React, { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../utils/constants';

interface CategoryCardProps {
  category: Category;
  productCount: number;
  totalValue?: number;
  isMostPopular?: boolean;
  onPress: () => void;
  useIconLibrary?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  productCount, 
  totalValue,
  isMostPopular,
  onPress,
  useIconLibrary = true 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '48%' }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`${category.color} rounded-xl p-6 mb-4 shadow-sm border border-gray-200 relative`}
        activeOpacity={0.9}
      >
        {/* Most Popular Badge */}
        {isMostPopular && (
          <View className="absolute top-2 right-2 bg-emerald-600 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">Popular</Text>
          </View>
        )}

        {/* Category Icon */}
        {useIconLibrary && category.iconName ? (
          <View className="items-center mb-3">
            <Ionicons 
              name={category.iconName as any} 
              size={48} 
              color="#059669" 
            />
          </View>
        ) : (
          <Text className="text-5xl mb-3 text-center">{category.icon}</Text>
        )}
        
        {/* Category Name */}
        <Text className="text-lg font-bold text-gray-800 text-center mb-1">
          {category.name}
        </Text>
        
        {/* Product Count */}
        <Text className="text-sm text-gray-600 text-center">
          {productCount} {productCount === 1 ? 'product' : 'products'}
        </Text>

        {/* Total Value */}
        {totalValue !== undefined && totalValue > 0 && (
          <Text className="text-xs text-emerald-600 text-center mt-1 font-semibold">
            ₹{totalValue.toLocaleString()}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CategoryCard;

