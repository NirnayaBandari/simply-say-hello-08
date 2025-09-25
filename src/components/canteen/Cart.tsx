import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Smartphone, Banknote, Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CartItem {
  id: string;
  food_item_id: string;
  quantity: number;
  special_instructions?: string;
  food_item: {
    name: string;
    price: number;
    image_url: string;
    prep_time_minutes: number;
  };
}

export function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cash'>('upi');
  const [pickupTime, setPickupTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          food_item_id,
          quantity,
          special_instructions,
          food_items (
            name,
            price,
            image_url,
            prep_time_minutes
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Transform the data to match our interface
      const formattedData = data?.map(item => ({
        ...item,
        food_item: item.food_items
      })) || [];
      
      setCartItems(formattedData);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const placeOrder = async () => {
    if (!user || cartItems.length === 0) return;

    setIsPlacingOrder(true);
    try {
      const totalAmount = subtotal + deliveryFee;
      const orderNumber = `ORD-${Date.now()}`;
      
      // Calculate pickup time (30 minutes from now if not specified)
      const pickupDateTime = pickupTime 
        ? new Date(pickupTime).toISOString()
        : new Date(Date.now() + 30 * 60 * 1000).toISOString();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: totalAmount,
          pickup_time: pickupDateTime,
          special_instructions: specialInstructions,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        food_item_id: item.food_item_id,
        quantity: item.quantity,
        unit_price: item.food_item.price,
        subtotal: item.food_item.price * item.quantity,
        special_instructions: item.special_instructions,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          user_id: user.id,
          amount: totalAmount,
          method: paymentMethod,
          status: 'completed', // For demo purposes
          transaction_id: `TXN-${Date.now()}`,
        });

      if (paymentError) throw paymentError;

      // Clear cart
      const { error: clearError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (clearError) throw clearError;

      toast({
        title: "Order placed successfully!",
        description: `Order #${orderNumber} will be ready for pickup at ${new Date(pickupDateTime).toLocaleTimeString()}`,
      });

      setCartItems([]);
      setSpecialInstructions('');
      setPickupTime('');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error placing order",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.food_item.price * item.quantity), 0);
  const deliveryFee = 0; // Free pickup
  const totalEstimatedTime = Math.max(...cartItems.map(item => item.food_item.prep_time_minutes), 0);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-16 h-16 bg-muted rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add some delicious items from the menu!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({cartItems.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <img
                src={item.food_item.image_url}
                alt={item.food_item.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/64/64';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.food_item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ₹{item.food_item.price} each • {item.food_item.prep_time_minutes} min
                </p>
                {item.special_instructions && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Note: {item.special_instructions}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    className="ml-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{(item.food_item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickup-time">Preferred Pickup Time (Optional)</Label>
            <Input
              id="pickup-time"
              type="datetime-local"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              min={new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 16)}
            />
            <p className="text-xs text-muted-foreground">
              If not specified, your order will be ready in {totalEstimatedTime} minutes
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Any special requests or notes..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant={paymentMethod === 'upi' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('upi')}
              className="flex items-center gap-2 h-12"
            >
              <Smartphone className="h-4 w-4" />
              UPI
            </Button>
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="flex items-center gap-2 h-12"
            >
              <CreditCard className="h-4 w-4" />
              Card
            </Button>
            <Button
              variant={paymentMethod === 'cash' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('cash')}
              className="flex items-center gap-2 h-12"
            >
              <Banknote className="h-4 w-4" />
              Cash
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="text-success">Free</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{(subtotal + deliveryFee).toFixed(2)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <Clock className="h-4 w-4" />
            <span>Estimated prep time: {totalEstimatedTime} minutes</span>
          </div>
          
          <Button
            onClick={placeOrder}
            disabled={isPlacingOrder || cartItems.length === 0}
            className="w-full mt-4"
            size="lg"
          >
            {isPlacingOrder ? 'Placing Order...' : `Place Order • ₹${(subtotal + deliveryFee).toFixed(2)}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}