
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBSRHistory } from "@/hooks/useProducts";
import { Product } from "@/services/productService";
import { Loader2 } from "lucide-react";

interface BSRTrendChartProps {
  product: Product;
}

const BSRTrendChart = ({ product }: BSRTrendChartProps) => {
  const { data: bsrHistory7Day, isLoading: loading7Day } = useBSRHistory(product.id, 7);
  const { data: bsrHistory30Day, isLoading: loading30Day } = useBSRHistory(product.id, 30);
  const { data: bsrHistory90Day, isLoading: loading90Day } = useBSRHistory(product.id, 90);

  const formatBSR = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const formatChartData = (data: any[]) => {
    return data.map(point => ({
      date: new Date(point.recorded_at).toLocaleDateString(),
      bsr: point.bsr,
      shortDate: new Date(point.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  };

  const getBSRStatus = (currentBSR?: number, avgBSR?: number) => {
    if (!currentBSR || !avgBSR) return { status: "Unknown", color: "text-gray-600" };
    if (currentBSR < avgBSR * 0.9) return { status: "Improving", color: "text-green-600" };
    if (currentBSR > avgBSR * 1.1) return { status: "Declining", color: "text-red-600" };
    return { status: "Stable", color: "text-blue-600" };
  };

  const avg30Day = bsrHistory30Day?.reduce((sum, item) => sum + item.bsr, 0) / (bsrHistory30Day?.length || 1);
  const bsrStatus = getBSRStatus(product.bsr, avg30Day);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{formatBSR(product.bsr || 0)}</div>
          <div className="text-sm text-gray-600">Current BSR</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-700">{formatBSR(Math.round(avg30Day || 0))}</div>
          <div className="text-sm text-gray-600">30-Day Average</div>
        </Card>
        <Card className="p-4">
          <div className={`text-2xl font-bold ${bsrStatus.color}`}>{bsrStatus.status}</div>
          <div className="text-sm text-gray-600">Trend</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">{product.marketplace}</div>
          <div className="text-sm text-gray-600">Marketplace</div>
        </Card>
      </div>

      {/* Chart Tabs */}
      <Tabs defaultValue="30day" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="7day">7 Days</TabsTrigger>
          <TabsTrigger value="30day">30 Days</TabsTrigger>
          <TabsTrigger value="90day">90 Days</TabsTrigger>
        </TabsList>

        <TabsContent value="7day">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">7-Day BSR Trend</h3>
            {loading7Day ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading chart data...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData(bsrHistory7Day || [])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="shortDate" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={formatBSR}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatBSR(value), 'BSR']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bsr" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="30day">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">30-Day BSR Trend</h3>
            {loading30Day ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading chart data...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData(bsrHistory30Day || [])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="shortDate" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tickFormatter={formatBSR}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatBSR(value), 'BSR']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bsr" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="90day">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">90-Day BSR Trend</h3>
            {loading90Day ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading chart data...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData(bsrHistory90Day || [])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="shortDate" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tickFormatter={formatBSR}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatBSR(value), 'BSR']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bsr" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">BSR Analysis</h3>
        <div className="space-y-2 text-sm">
          <p>• <strong>Current Performance:</strong> BSR is {bsrStatus.status.toLowerCase()} compared to 30-day average</p>
          <p>• <strong>Data Points:</strong> {bsrHistory30Day?.length || 0} BSR records in the last 30 days</p>
          <p>• <strong>Recommendation:</strong> {(product.bsr || 0) < 100000 ? 'Excellent opportunity - low competition' : (product.bsr || 0) < 250000 ? 'Good opportunity - moderate competition' : 'Proceed with caution - high competition'}</p>
        </div>
      </Card>
    </div>
  );
};

export default BSRTrendChart;
