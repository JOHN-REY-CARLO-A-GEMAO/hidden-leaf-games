import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Gamepad2, Trophy, Users, Zap } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-ninja opacity-20"></div>
        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-slide-up">
            <div className="text-8xl mb-6 animate-pulse-glow">🍥</div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-ninja bg-clip-text text-transparent">
              Ninja Arena
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Test your ninja skills with 10 epic Naruto-themed mini-games!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" asChild className="text-lg shadow-kunai">
                  <Link to="/dashboard">Enter Arena</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="text-lg shadow-kunai">
                    <Link to="/auth?mode=signup">Start Training</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card p-6 rounded-lg border border-border hover:shadow-glow transition-all duration-300 animate-slide-up">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2 text-primary">10 Epic Games</h3>
            <p className="text-muted-foreground">
              Master kunai throws, rasengan charges, and more ninja challenges!
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border hover:shadow-glow transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Leaderboards</h3>
            <p className="text-muted-foreground">
              Compete with ninjas worldwide and claim your spot at the top!
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border hover:shadow-glow transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Multiple Roles</h3>
            <p className="text-muted-foreground">
              Progress from Academy Student to Hokage with role progression!
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border hover:shadow-glow transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Instant Action</h3>
            <p className="text-muted-foreground">
              Jump right in - all games run instantly in your browser!
            </p>
          </div>
        </div>
      </div>

      {/* Games Preview */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-ninja bg-clip-text text-transparent">
          Featured Mini-Games
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Shadow Clone Dodge", icon: "👥", desc: "Dodge shadow clones!" },
            { name: "Rasengan Charge", icon: "🌀", desc: "Charge your chakra!" },
            { name: "Kunai Throw", icon: "🗡️", desc: "Perfect your aim!" },
          ].map((game, i) => (
            <div
              key={game.name}
              className="bg-card p-8 rounded-lg border border-border hover:shadow-kunai transition-all duration-300 hover:scale-105"
            >
              <div className="text-6xl mb-4 text-center">{game.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-center text-primary">
                {game.name}
              </h3>
              <p className="text-muted-foreground text-center">{game.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="container mx-auto px-4 py-20">
          <div className="bg-gradient-ninja p-12 rounded-2xl text-center shadow-deep">
            <h2 className="text-4xl font-bold mb-4 text-primary-foreground">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Join thousands of ninjas already training in the arena!
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg">
              <Link to="/auth?mode=signup">Create Account</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
