import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const GamePlay = () => {
  const { gameName } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/games" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Link>
        </Button>

        <Card className="border-border shadow-deep">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <CardTitle className="text-3xl bg-gradient-ninja bg-clip-text text-transparent">
              {gameName?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </CardTitle>
            <CardDescription>Game coming soon!</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              This game is under development. Check back soon for the full ninja experience!
            </p>
            <div className="text-8xl animate-pulse-glow">🍥</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamePlay;
