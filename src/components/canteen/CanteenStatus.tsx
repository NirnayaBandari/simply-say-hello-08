import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';

interface CanteenStatusData {
  queue_length: number;
  available_seats: number;
  total_seats: number;
  rush_hour: boolean;
  estimated_wait_minutes: number;
}

export function CanteenStatus() {
  const [status, setStatus] = useState<CanteenStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    
    // Set up real-time updates for canteen status
    const channel = supabase
      .channel('canteen-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'canteen_status'
        },
        () => {
          fetchStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('canteen_status')
        .select('*')
        .single();

      if (error) throw error;
      setStatus(data);
    } catch (error) {
      console.error('Error fetching canteen status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!status) return null;

  const seatOccupancy = ((status.total_seats - status.available_seats) / status.total_seats) * 100;
  const queueStatus = status.queue_length === 0 ? 'empty' : status.queue_length < 5 ? 'light' : status.queue_length < 15 ? 'moderate' : 'heavy';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{status.queue_length}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>≈ {status.estimated_wait_minutes} min wait</span>
            <Badge 
              variant={queueStatus === 'empty' ? 'default' : queueStatus === 'light' ? 'secondary' : queueStatus === 'moderate' ? 'outline' : 'destructive'}
              className="text-xs"
            >
              {queueStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Seat Availability</CardTitle>
          <Users className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{status.available_seats}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>of {status.total_seats} seats</span>
            <Badge 
              variant={seatOccupancy < 50 ? 'default' : seatOccupancy < 80 ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {Math.round(seatOccupancy)}% occupied
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${status.rush_hour ? 'from-warning/5 to-destructive/5 border-warning/20' : 'from-success/5 to-primary/5 border-success/20'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Canteen Status</CardTitle>
          {status.rush_hour ? (
            <AlertTriangle className="h-4 w-4 text-warning" />
          ) : (
            <CheckCircle className="h-4 w-4 text-success" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${status.rush_hour ? 'text-warning' : 'text-success'}`}>
            {status.rush_hour ? 'Busy' : 'Normal'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {status.rush_hour 
              ? 'Peak dining hours - expect longer waits' 
              : 'Good time to visit!'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}