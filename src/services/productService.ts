
import { supabase } from "@/integrations/supabase/client";

export interface ProductFilters {
  category?: string;
  maxBSR?: number;
  minProfit?: number;
  minMargin?: number;
  priceRange?: [number, number];
  marketplace?: string;
}

export interface Product {
  id: string;
  asin?: string;
  title: string;
  description?: string;
  image_url?: string;
  amazon_price?: number;
  ebay_price?: number;
  cost_price?: number;
  profit?: number;
  margin?: number;
  bsr?: number;
  category?: string;
  subcategory?: string;
  marketplace: string;
  marketplace_url?: string;
  last_updated?: string;
  created_at?: string;
}

export interface BSRHistoryPoint {
  id: string;
  product_id: string;
  bsr: number;
  recorded_at: string;
}

export const productService = {
  // Search products with filters
  async searchProducts(filters: ProductFilters): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .order('profit', { ascending: false });

    if (filters.category && filters.category !== 'all categories') {
      query = query.eq('category', filters.category);
    }

    if (filters.maxBSR) {
      query = query.lte('bsr', filters.maxBSR);
    }

    if (filters.minProfit) {
      query = query.gte('profit', filters.minProfit);
    }

    if (filters.minMargin) {
      query = query.gte('margin', filters.minMargin);
    }

    if (filters.priceRange) {
      query = query.gte('amazon_price', filters.priceRange[0])
                   .lte('amazon_price', filters.priceRange[1]);
    }

    if (filters.marketplace) {
      query = query.eq('marketplace', filters.marketplace);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data || [];
  },

  // Get BSR history for a product
  async getBSRHistory(productId: string, days: number = 30): Promise<BSRHistoryPoint[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const { data, error } = await supabase
      .from('bsr_history')
      .select('*')
      .eq('product_id', productId)
      .gte('recorded_at', dateThreshold.toISOString())
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error('Error fetching BSR history:', error);
      throw error;
    }

    return data || [];
  },

  // Add a new product (for marketplace integration)
  async addProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }

    return data;
  },

  // Update product data
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, last_updated: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return data;
  },

  // Add BSR history point
  async addBSRHistory(productId: string, bsr: number): Promise<void> {
    const { error } = await supabase
      .from('bsr_history')
      .insert([{
        product_id: productId,
        bsr: bsr,
        recorded_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error adding BSR history:', error);
      throw error;
    }
  }
};
