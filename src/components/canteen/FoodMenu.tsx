import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Plus, Minus, Star, Clock, Leaf, Zap, Brain, DollarSign } from 'lucide-react';

interface FoodItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  allergens: string[];
  health_tags: string[];
  prep_time_minutes: number;
  rating: number;
  rating_count: number;
}

interface FoodCategory {
  id: string;
  name: string;
  description: string;
}

interface CartItem {
  food_item_id: string;
  quantity: number;
}

const healthTagIcons = {
  vegan: <Leaf className="h-3 w-3" />,
  vegetarian: <Leaf className="h-3 w-3" />,
  high_protein: "💪",
  high_energy: <Zap className="h-3 w-3" />,
  brain_food: <Brain className="h-3 w-3" />,
  low_calorie: "🏃",
  budget_friendly: <DollarSign className="h-3 w-3" />
};

export function FoodMenu() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [categoriesResult, itemsResult] = await Promise.all([
        supabase.from('food_categories').select('*').order('display_order'),
        supabase.from('food_items').select('*').eq('availability_status', true)
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (itemsResult.error) throw itemsResult.error;

      setCategories(categoriesResult.data || []);
      setItems(itemsResult.data || []);
      
      if (categoriesResult.data?.length > 0) {
        setSelectedCategory(categoriesResult.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('food_item_id, quantity')
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const getCartQuantity = (itemId: string) => {
    const cartItem = cartItems.find(item => item.food_item_id === itemId);
    return cartItem?.quantity || 0;
  };

  const updateCart = async (itemId: string, newQuantity: number) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      if (newQuantity === 0) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('food_item_id', itemId);
      } else {
        await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            food_item_id: itemId,
            quantity: newQuantity
          });
      }

      // Update local state
      setCartItems(prev => {
        const filtered = prev.filter(item => item.food_item_id !== itemId);
        if (newQuantity > 0) {
          filtered.push({ food_item_id: itemId, quantity: newQuantity });
        }
        return filtered;
      });

      const item = items.find(i => i.id === itemId);
      if (newQuantity > 0) {
        toast({
          title: "Added to cart",
          description: `${item?.name} (${newQuantity}) added to your cart`,
        });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory ? item.category_id === selectedCategory : true;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-4"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search food items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {totalCartItems > 0 && (
          <Badge variant="secondary" className="ml-4">
            {totalCartItems} items in cart
          </Badge>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All Items
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/400/300';
                }}
              />
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {item.health_tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-white/90">
                    {healthTagIcons[tag as keyof typeof healthTagIcons]} {tag.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    {item.rating.toFixed(1)} ({item.rating_count})
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>

              {/* Nutritional Info */}
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-semibold">{item.calories}</div>
                  <div>cal</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-semibold">{item.protein_g}g</div>
                  <div>protein</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded flex flex-col items-center">
                  <Clock className="h-3 w-3 mb-1" />
                  <div>{item.prep_time_minutes}m</div>
                </div>
              </div>

              {/* Allergens */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Allergens:</span> {item.allergens.join(', ')}
                </div>
              )}

              {/* Price and Add to Cart */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xl font-bold text-primary">₹{item.price}</div>
                
                <div className="flex items-center gap-2">
                  {getCartQuantity(item.id) > 0 ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCart(item.id, getCartQuantity(item.id) - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{getCartQuantity(item.id)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCart(item.id, getCartQuantity(item.id) + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => updateCart(item.id, 1)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No items found</p>
          <p className="text-sm">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}