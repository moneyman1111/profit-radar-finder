
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calculator, X } from "lucide-react";

interface ProfitCalculatorProps {
  onClose: () => void;
  product?: any;
}

const ProfitCalculator = ({ onClose, product }: ProfitCalculatorProps) => {
  const [calculations, setCalculations] = useState({
    buyPrice: product?.price || 0,
    sellPrice: product?.amazonPrice || 0,
    shippingCost: 3.50,
    amazonFee: 0,
    ebayFee: 0,
    platform: 'amazon'
  });

  // Amazon fee calculation (simplified)
  const calculateAmazonFee = (price: number) => {
    const referralFee = price * 0.15; // 15% average
    const fulfillmentFee = price < 25 ? 3.06 : price < 50 ? 4.75 : 6.25; // FBA fees
    return referralFee + fulfillmentFee;
  };

  // eBay fee calculation (simplified)  
  const calculateEbayFee = (price: number) => {
    return price * 0.1295; // 12.95% final value fee
  };

  // Update fees when platform or price changes
  const updateCalculations = (updates: any) => {
    const newCalcs = { ...calculations, ...updates };
    
    if (newCalcs.platform === 'amazon') {
      newCalcs.amazonFee = calculateAmazonFee(newCalcs.sellPrice);
      newCalcs.ebayFee = 0;
    } else {
      newCalcs.ebayFee = calculateEbayFee(newCalcs.sellPrice);
      newCalcs.amazonFee = 0;
    }
    
    setCalculations(newCalcs);
  };

  const totalFees = calculations.amazonFee + calculations.ebayFee + calculations.shippingCost;
  const profit = calculations.sellPrice - calculations.buyPrice - totalFees;
  const margin = calculations.sellPrice > 0 ? (profit / calculations.sellPrice) * 100 : 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Profit Calculator
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Product Details</h3>
            
            <div className="space-y-4">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select 
                  value={calculations.platform}
                  onChange={(e) => updateCalculations({ platform: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="amazon">Amazon (FBA)</option>
                  <option value="ebay">eBay</option>
                </select>
              </div>

              {/* Buy Price */}
              <div>
                <label className="block text-sm font-medium mb-2">Buy Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={calculations.buyPrice}
                  onChange={(e) => updateCalculations({ buyPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Sell Price */}
              <div>
                <label className="block text-sm font-medium mb-2">Sell Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={calculations.sellPrice}
                  onChange={(e) => updateCalculations({ sellPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Shipping Cost */}
              <div>
                <label className="block text-sm font-medium mb-2">Shipping to Customer</label>
                <input
                  type="number"
                  step="0.01"
                  value={calculations.shippingCost}
                  onChange={(e) => updateCalculations({ shippingCost: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Profit Breakdown</h3>
            
            <div className="space-y-4">
              {/* Fee Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Fees</h4>
                <div className="space-y-2 text-sm">
                  {calculations.platform === 'amazon' && (
                    <div className="flex justify-between">
                      <span>Amazon Fees:</span>
                      <span>${calculations.amazonFee.toFixed(2)}</span>
                    </div>
                  )}
                  {calculations.platform === 'ebay' && (
                    <div className="flex justify-between">
                      <span>eBay Fees:</span>
                      <span>${calculations.ebayFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${calculations.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total Fees:</span>
                    <span>${totalFees.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Final Results */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Revenue:</span>
                  <span className="text-lg">${calculations.sellPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Costs:</span>
                  <span className="text-lg">${(calculations.buyPrice + totalFees).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b-2 border-gray-300">
                  <span className="text-xl font-bold">Net Profit:</span>
                  <span className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Profit Margin:</span>
                  <span className={`text-lg font-semibold ${margin >= 20 ? 'text-green-600' : margin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {margin.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Recommendation */}
              <div className={`p-3 rounded-lg ${profit >= 7 && margin >= 20 ? 'bg-green-50 text-green-800' : profit >= 5 && margin >= 15 ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
                <p className="text-sm font-medium">
                  {profit >= 7 && margin >= 20 ? '✅ Excellent opportunity!' : 
                   profit >= 5 && margin >= 15 ? '⚠️ Moderate opportunity' : 
                   '❌ Poor opportunity'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfitCalculator;
