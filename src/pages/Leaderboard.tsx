import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  score: number;
  created_at: string;
  user_id: string;
  game_id: string;
  username?: string;
  game_name?: string;
  game_icon?: string;
}

const Leaderboard = () => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data: scoresData } = await supabase
        .from("game_scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(100);
      
      if (scoresData) {
        const enriched = await Promise.all(
          scoresData.map(async (score) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username")
              .eq("id", score.user_id)
              .single();
            
            const { data: game } = await supabase
              .from("games")
              .select("display_name, icon")
              .eq("id", score.game_id)
              .single();
            
            return {
              ...score,
              username: profile?.username,
              game_name: game?.display_name,
              game_icon: game?.icon,
            };
          })
        );
        setScores(enriched);
      }
      setLoading(false);
    };

    fetchScores();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-accent" />;
    if (index === 1) return <Medal className="w-6 h-6 text-muted-foreground" />;
    if (index === 2) return <Award className="w-6 h-6 text-ninja-red" />;
    return <span className="text-muted-foreground font-bold">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-slide-down">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-ninja bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Top ninja scores from around the world
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-kunai-spin text-6xl mb-4">⭐</div>
            <p className="text-muted-foreground">Loading scores...</p>
          </div>
        ) : scores.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>No Scores Yet</CardTitle>
              <CardDescription>Be the first to set a high score!</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {scores.map((entry, index) => (
              <Card 
                key={entry.id} 
                className={`border-border hover:shadow-glow transition-all animate-slide-up ${
                  index < 3 ? "bg-card/50" : ""
                }`}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(index)}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{entry.game_icon}</span>
                      <div>
                        <p className="font-bold text-primary">
                          {entry.username || "Anonymous"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {entry.game_name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">{entry.score}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
