import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Category } from '../utils/constants';

interface CategoryCardProps {
  category: Category;
  productCount: number;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, productCount, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${category.color} rounded-xl p-6 mb-4 shadow-sm border border-gray-200`}
      style={{ width: '48%' }}
      activeOpacity={0.7}
    >
      <Text className="text-5xl mb-3 text-center">{category.icon}</Text>
      
      <Text className="text-lg font-bold text-gray-800 text-center mb-1">
        {category.name}
      </Text>
      
      <Text className="text-sm text-gray-600 text-center">
        {productCount} {productCount === 1 ? 'product' : 'products'}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;

