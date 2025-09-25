-- Create enums for various statuses
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE public.payment_method AS ENUM ('card', 'upi', 'cash', 'wallet');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE public.allergen_type AS ENUM ('peanuts', 'gluten', 'dairy', 'soy', 'eggs', 'shellfish', 'tree_nuts', 'fish');
CREATE TYPE public.health_tag AS ENUM ('vegan', 'vegetarian', 'high_protein', 'high_energy', 'brain_food', 'low_calorie', 'budget_friendly');

-- Profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  college_id TEXT,
  phone TEXT,
  budget_limit DECIMAL(10,2) DEFAULT 200.00,
  dietary_preferences TEXT[],
  health_goals TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Food categories
CREATE TABLE public.food_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Food items with nutritional info
CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.food_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  calories INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  allergens allergen_type[],
  health_tags health_tag[],
  availability_status BOOLEAN DEFAULT true,
  prep_time_minutes INTEGER DEFAULT 10,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User wallet for budget tracking
CREATE TABLE public.user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  total_spent_month DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Loyalty points system
CREATE TABLE public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  level_name TEXT DEFAULT 'Bronze',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Cart items
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, food_item_id)
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  pickup_time TIMESTAMPTZ,
  special_instructions TEXT,
  is_group_order BOOLEAN DEFAULT false,
  group_order_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES public.food_items(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  special_instructions TEXT
);

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Food ratings and reviews
CREATE TABLE public.food_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, food_item_id)
);

-- Queue and seat tracking
CREATE TABLE public.canteen_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_length INTEGER DEFAULT 0,
  available_seats INTEGER DEFAULT 50,
  total_seats INTEGER DEFAULT 50,
  rush_hour BOOLEAN DEFAULT false,
  estimated_wait_minutes INTEGER DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Group orders
CREATE TABLE public.group_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_pickup_time TIMESTAMPTZ,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) DEFAULT 0,
  max_participants INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Group order participants
CREATE TABLE public.group_order_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_order_id UUID NOT NULL REFERENCES public.group_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_order_id, user_id)
);

-- Polls for community features
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  options JSONB NOT NULL,
  votes JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Achievements system
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  points_reward INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User achievements
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canteen_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for public data (food items, categories)
CREATE POLICY "Anyone can view food categories" ON public.food_categories
  FOR SELECT USING (active = true);
CREATE POLICY "Anyone can view food items" ON public.food_items
  FOR SELECT USING (availability_status = true);

-- RLS Policies for user-specific data
CREATE POLICY "Users can manage their own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own wallet" ON public.user_wallets
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own loyalty points" ON public.loyalty_points
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own ratings" ON public.food_ratings
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for canteen status (public read)
CREATE POLICY "Anyone can view canteen status" ON public.canteen_status
  FOR SELECT USING (true);

-- RLS Policies for group orders
CREATE POLICY "Anyone can view active group orders" ON public.group_orders
  FOR SELECT USING (true);
CREATE POLICY "Users can create group orders" ON public.group_orders
  FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can join group orders" ON public.group_order_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements and polls
CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT USING (active = true);
CREATE POLICY "Anyone can view polls" ON public.polls
  FOR SELECT USING (active = true);
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON public.food_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_wallets_updated_at BEFORE UPDATE ON public.user_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loyalty_points_updated_at BEFORE UPDATE ON public.loyalty_points FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_wallets (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.loyalty_points (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.food_categories (name, description, display_order) VALUES
('Main Course', 'Rice, Noodles, and full meals', 1),
('South Indian', 'Dosa, Idli, and traditional favorites', 2),
('Snacks', 'Quick bites and light snacks', 3),
('Beverages', 'Tea, Coffee, and refreshing drinks', 4),
('Desserts', 'Sweet treats and desserts', 5);

-- Insert sample canteen status
INSERT INTO public.canteen_status (queue_length, available_seats, total_seats, estimated_wait_minutes) 
VALUES (5, 35, 50, 8);