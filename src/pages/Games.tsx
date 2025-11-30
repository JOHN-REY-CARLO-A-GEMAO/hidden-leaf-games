import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Game {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon: string | null;
}

const Games = () => {
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
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-ninja bg-clip-text text-transparent">
            Game Hub
          </h1>
          <p className="text-xl text-muted-foreground">
            10 epic Naruto-themed mini-games to master
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-kunai-spin text-6xl mb-4">⭐</div>
            <p className="text-muted-foreground">Loading games...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <Card 
                key={game.id} 
                className="border-border hover:shadow-kunai transition-all hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 animate-pulse-glow">{game.icon}</div>
                  <CardTitle className="text-primary">{game.display_name}</CardTitle>
                  <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full shadow-glow">
                    <Link to={`/games/${game.name}`}>Play Game</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
