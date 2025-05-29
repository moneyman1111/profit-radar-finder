
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import BSRTrendChart from "@/components/BSRTrendChart";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProducts } from "@/hooks/useProducts";
import { Product, ProductFilters } from "@/services/productService";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  filters: ProductFilters;
  onProductSelect: (product: Product | null) => void;
}

const ProductGrid = ({ filters, onProductSelect }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBSRChart, setShowBSRChart] = useState(false);
  
  const { data: products = [], isLoading, error } = useProducts(filters);

  const handleViewBSR = (product: Product) => {
    setSelectedProduct(product);
    setShowBSRChart(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Product Opportunities</h2>
          <p className="text-gray-600">{products.length} products found matching your criteria</p>
        </div>
        <div className="flex gap-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>Sort by Profit</option>
            <option>Sort by Margin</option>
            <option>Sort by BSR</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or check back later for new products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onProductSelect}
              onViewBSR={() => handleViewBSR(product)}
            />
          ))}
        </div>
      )}

      {/* BSR Trend Modal */}
      <Dialog open={showBSRChart} onOpenChange={setShowBSRChart}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>BSR Trend Analysis - {selectedProduct?.title}</DialogTitle>
          </DialogHeader>
          {selectedProduct && <BSRTrendChart product={selectedProduct} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGrid;
