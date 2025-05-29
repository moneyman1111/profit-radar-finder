
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BarChart3 } from "lucide-react";
import { Product } from "@/services/productService";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onViewBSR: () => void;
}

const ProductCard = ({ product, onSelect, onViewBSR }: ProductCardProps) => {
  const getProfitColor = (profit?: number) => {
    if (!profit) return "text-gray-600";
    if (profit >= 15) return "text-green-600";
    if (profit >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getMarginColor = (margin?: number) => {
    if (!margin) return "text-gray-600";
    if (margin >= 30) return "text-green-600";
    if (margin >= 20) return "text-yellow-600";
    return "text-red-600";
  };

  const getBSRColor = (bsr?: number) => {
    if (!bsr) return "text-gray-600";
    if (bsr <= 50000) return "text-green-600";
    if (bsr <= 150000) return "text-yellow-600";
    return "text-red-600";
  };

  const displayPrice = product.amazon_price || product.ebay_price || product.cost_price || 0;
  const sellPrice = product.amazon_price || product.ebay_price || 0;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(product)}>
      <div className="flex space-x-4">
        <img 
          src={product.image_url || "/placeholder.svg"} 
          alt={product.title}
          className="w-20 h-20 object-cover rounded-lg bg-gray-100"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.title}</h3>
          <Badge variant="secondary" className="text-xs mb-2">{product.category || 'Uncategorized'}</Badge>
          {product.asin && (
            <p className="text-xs text-gray-500 mb-2">ASIN: {product.asin}</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {/* Pricing */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">
              Cost: <span className="font-semibold">${product.cost_price?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="text-sm text-gray-600">
              Sell: <span className="font-semibold">${sellPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${getProfitColor(product.profit)}`}>
              ${product.profit?.toFixed(2) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">profit</div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div className="text-center">
            <div className={`text-lg font-bold ${getMarginColor(product.margin)}`}>
              {product.margin?.toFixed(1) || 'N/A'}%
            </div>
            <div className="text-xs text-gray-500">Margin</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getBSRColor(product.bsr)}`}>
              {product.bsr?.toLocaleString() || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">BSR</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewBSR();
            }}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            BSR Trend
          </button>
          {product.marketplace_url && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(product.marketplace_url, '_blank');
              }}
              className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Product
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
