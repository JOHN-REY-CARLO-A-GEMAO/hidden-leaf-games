import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Gamepad2, Trophy, User, LogOut, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        
        setIsAdmin(!!data);
      }
    };
    checkRole();
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-deep">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-3xl animate-pulse-glow">🍥</div>
            <span className="text-2xl font-bold bg-gradient-ninja bg-clip-text text-transparent">
              Ninja Arena
            </span>
          </Link>

          {user && (
            <div className="flex items-center gap-2">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </Button>

              <Button
                variant={isActive("/games") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/games" className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Games</span>
                </Link>
              </Button>

              <Button
                variant={isActive("/leaderboard") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/leaderboard" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Leaderboard</span>
                </Link>
              </Button>

              <Button
                variant={isActive("/profile") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>

              {isAdmin && (
                <Button
                  variant={isActive("/admin") ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to="/admin" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
