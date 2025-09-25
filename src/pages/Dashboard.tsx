import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { CanteenStatus } from '@/components/canteen/CanteenStatus';
import { FoodMenu } from '@/components/canteen/FoodMenu';
import { Cart } from '@/components/canteen/Cart';
import { SmartMealPlanner } from '@/components/canteen/SmartMealPlanner';
import { AIChatbot } from '@/components/ui/ai-chatbot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  User, 
  Trophy, 
  Wallet, 
  Users, 
  MessageSquare,
  ChefHat,
  LogOut,
  Brain
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary to-primary-glow rounded-lg">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Campus Canteen</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">
                <Wallet className="h-3 w-3 mr-1" />
                ₹200.00
              </Badge>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="menu" className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span className="hidden sm:inline">Menu</span>
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Planner</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <CanteenStatus />
            <FoodMenu />
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            <Cart />
          </TabsContent>

          <TabsContent value="planner" className="space-y-6">
            <SmartMealPlanner />
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Group Orders
                  </CardTitle>
                  <CardDescription>
                    Order together with friends and split the bill
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No active group orders</p>
                    <Button className="mt-2" variant="outline">Create Group Order</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Community Polls
                  </CardTitle>
                  <CardDescription>
                    Vote on new menu items and improvements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-2">What new cuisine should we add?</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Chinese</span>
                          <span className="text-muted-foreground">25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Continental</span>
                          <span className="text-muted-foreground">35%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bengali</span>
                          <span className="text-muted-foreground">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Punjabi</span>
                          <span className="text-muted-foreground">20%</span>
                        </div>
                      </div>
                      <Button size="sm" className="mt-3">Vote</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Loyalty Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">0</div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                    <Badge variant="secondary" className="mt-2">Bronze Level</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your latest accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No achievements yet</p>
                    <p className="text-sm">Complete your first order to earn achievements!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Available Achievements</CardTitle>
                <CardDescription>Complete these challenges to earn points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: '🎉', name: 'First Order', desc: 'Complete your first order', points: 50 },
                    { icon: '🌟', name: 'Foodie Explorer', desc: 'Try dishes from 3 different categories', points: 100 },
                    { icon: '🥞', name: 'Dosa Lover', desc: 'Order 5 different dosa varieties', points: 75 },
                    { icon: '💰', name: 'Budget Champion', desc: 'Stay within ₹150 for a week', points: 150 },
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                      </div>
                      <Badge variant="outline">{achievement.points} pts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  Manage your account and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-muted-foreground">{user.user_metadata?.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Student ID</label>
                    <p className="text-muted-foreground">{user.user_metadata?.college_id || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Monthly Budget</label>
                    <p className="text-muted-foreground">₹200.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Spending Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">₹0</div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-success">₹200</div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}