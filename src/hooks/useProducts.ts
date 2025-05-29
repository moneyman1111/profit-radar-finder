
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService, Product, ProductFilters } from '@/services/productService';

export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.searchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBSRHistory = (productId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['bsr-history', productId, days],
    queryFn: () => productService.getBSRHistory(productId, days),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
