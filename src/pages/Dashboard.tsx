import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Gamepad2, Trophy, User } from "lucide-react";

interface Game {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("display_name");
      
      if (data && !error) {
        setGames(data);
      }
      setLoading(false);
    };

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center animate-slide-down">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-ninja bg-clip-text text-transparent">
            Welcome to the Arena!
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your game and start your ninja training
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{games.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">Academy Student</div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Role</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">Ninja</div>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-primary">Available Games</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-kunai-spin text-6xl mb-4">⭐</div>
              <p className="text-muted-foreground">Loading games...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, index) => (
                <Card 
                  key={game.id} 
                  className="border-border hover:shadow-kunai transition-all hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="text-5xl mb-2">{game.icon}</div>
                    <CardTitle className="text-primary">{game.display_name}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full shadow-glow">
                      <Link to={`/games/${game.name}`}>Play Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
