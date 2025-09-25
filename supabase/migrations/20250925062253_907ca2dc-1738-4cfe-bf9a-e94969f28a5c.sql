-- Insert sample food items for the canteen
INSERT INTO public.food_items (category_id, name, description, price, calories, protein_g, carbs_g, fat_g, allergens, health_tags, image_url, prep_time_minutes) 
SELECT 
  c.id as category_id,
  items.name,
  items.description,
  items.price,
  items.calories,
  items.protein_g,
  items.carbs_g,
  items.fat_g,
  items.allergens::allergen_type[],
  items.health_tags::health_tag[],
  items.image_url,
  items.prep_time_minutes
FROM public.food_categories c
CROSS JOIN (
  VALUES 
  -- Main Course
  ('Chicken Biryani', 'Fragrant basmati rice with tender chicken and spices', 85.00, 520, 28.5, 65.2, 12.8, ARRAY['dairy'], ARRAY['high_protein', 'high_energy'], '/api/placeholder/400/300', 25),
  ('Veg Fried Rice', 'Wok-tossed rice with mixed vegetables and soy sauce', 60.00, 380, 8.2, 72.5, 6.8, ARRAY['soy'], ARRAY['vegetarian'], '/api/placeholder/400/300', 15),
  ('Paneer Butter Masala', 'Creamy tomato-based curry with cottage cheese', 75.00, 450, 18.5, 25.8, 28.2, ARRAY['dairy'], ARRAY['vegetarian', 'high_protein'], '/api/placeholder/400/300', 20),
  
  -- South Indian  
  ('Masala Dosa', 'Crispy rice crepe with spiced potato filling', 45.00, 320, 12.5, 58.2, 8.5, NULL, ARRAY['vegan', 'budget_friendly'], '/api/placeholder/400/300', 12),
  ('Idli Sambar', '3 steamed rice cakes with lentil curry', 35.00, 285, 11.8, 52.5, 4.2, NULL, ARRAY['vegan', 'brain_food', 'budget_friendly'], '/api/placeholder/400/300', 8),
  ('Rava Uttapam', 'Thick pancake made with semolina and vegetables', 40.00, 295, 9.5, 48.2, 7.8, NULL, ARRAY['vegetarian'], '/api/placeholder/400/300', 10),
  
  -- Snacks
  ('Samosa', 'Deep-fried pastry with spiced potato filling', 15.00, 180, 4.2, 22.8, 8.5, ARRAY['gluten'], ARRAY['vegetarian', 'budget_friendly'], '/api/placeholder/400/300', 5),
  ('Pav Bhaji', 'Spiced vegetable curry with buttered bread rolls', 50.00, 420, 12.8, 58.5, 14.2, ARRAY['gluten', 'dairy'], ARRAY['vegetarian'], '/api/placeholder/400/300', 15),
  ('Vada Pav', 'Deep-fried potato dumpling in a bread bun', 20.00, 285, 8.5, 42.8, 9.2, ARRAY['gluten'], ARRAY['vegetarian', 'budget_friendly'], '/api/placeholder/400/300', 8),
  
  -- Beverages
  ('Masala Chai', 'Spiced tea with milk and aromatic spices', 12.00, 85, 2.8, 12.5, 2.8, ARRAY['dairy'], ARRAY['brain_food'], '/api/placeholder/400/300', 3),
  ('Fresh Lime Soda', 'Refreshing drink with lime juice and soda', 18.00, 45, 0.2, 11.5, 0.1, NULL, ARRAY['vegan', 'low_calorie'], '/api/placeholder/400/300', 2),
  ('Mango Lassi', 'Creamy yogurt drink with fresh mango', 25.00, 165, 5.8, 28.2, 3.2, ARRAY['dairy'], ARRAY['vegetarian'], '/api/placeholder/400/300', 3),
  
  -- Desserts
  ('Gulab Jamun', 'Sweet milk dumplings in sugar syrup', 30.00, 285, 6.2, 42.8, 9.8, ARRAY['dairy'], ARRAY['vegetarian'], '/api/placeholder/400/300', 5),
  ('Kulfi', 'Traditional Indian ice cream with cardamom', 22.00, 195, 4.8, 22.5, 8.2, ARRAY['dairy'], ARRAY['vegetarian'], '/api/placeholder/400/300', 2),
  ('Jalebi', 'Crispy sweet pretzel-shaped dessert', 25.00, 220, 2.8, 45.2, 4.5, NULL, ARRAY['vegetarian'], '/api/placeholder/400/300', 8)
) AS items(name, description, price, calories, protein_g, carbs_g, fat_g, allergens, health_tags, image_url, prep_time_minutes)
WHERE 
  (c.name = 'Main Course' AND items.name IN ('Chicken Biryani', 'Veg Fried Rice', 'Paneer Butter Masala')) OR
  (c.name = 'South Indian' AND items.name IN ('Masala Dosa', 'Idli Sambar', 'Rava Uttapam')) OR
  (c.name = 'Snacks' AND items.name IN ('Samosa', 'Pav Bhaji', 'Vada Pav')) OR
  (c.name = 'Beverages' AND items.name IN ('Masala Chai', 'Fresh Lime Soda', 'Mango Lassi')) OR
  (c.name = 'Desserts' AND items.name IN ('Gulab Jamun', 'Kulfi', 'Jalebi'));

-- Insert some sample achievements
INSERT INTO public.achievements (name, description, icon, points_reward, requirement_type, requirement_value) VALUES
('First Order', 'Complete your first order', '🎉', 50, 'order_count', '{"count": 1}'),
('Foodie Explorer', 'Try dishes from 3 different categories', '🌟', 100, 'category_diversity', '{"categories": 3}'),
('Dosa Lover', 'Order 5 different dosa varieties', '🥞', 75, 'item_category', '{"category": "South Indian", "count": 5}'),
('Budget Champion', 'Stay within ₹150 for a week', '💰', 150, 'weekly_budget', '{"amount": 150}'),
('Early Bird', 'Order before 10 AM for 5 consecutive days', '🌅', 120, 'early_orders', '{"time": "10:00", "days": 5}'),
('Social Butterfly', 'Create 3 group orders', '👥', 200, 'group_orders', '{"count": 3}');

-- Insert a sample poll
INSERT INTO public.polls (title, description, options, expires_at, created_at) VALUES
('What new cuisine should we add?', 'Help us decide the next addition to our menu!', 
'{"options": [{"id": 1, "text": "Chinese", "votes": 0}, {"id": 2, "text": "Continental", "votes": 0}, {"id": 3, "text": "Bengali", "votes": 0}, {"id": 4, "text": "Punjabi", "votes": 0}]}', 
NOW() + INTERVAL '30 days', NOW());