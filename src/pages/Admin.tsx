import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Gamepad2, Trophy } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  created_at: string;
  role?: string;
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGames: 10,
    totalScores: 0,
  });

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!data) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      fetchData();
    };

    checkAdmin();
  }, [user, navigate, toast]);

  const fetchData = async () => {
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesData) {
      const enriched = await Promise.all(
        profilesData.map(async (profile) => {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id)
            .maybeSingle();
          
          return { ...profile, role: roleData?.role };
        })
      );
      setProfiles(enriched);
      setStats(prev => ({ ...prev, totalUsers: enriched.length }));
    }

    const { count } = await supabase
      .from("game_scores")
      .select("*", { count: "exact", head: true });

    if (count !== null) {
      setStats(prev => ({ ...prev, totalScores: count }));
    }

    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: "user" | "cashier" | "admin") => {
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      toast({
        title: "Error",
        description: deleteError.message,
        variant: "destructive",
      });
      return;
    }

    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: newRole });

    if (insertError) {
      toast({
        title: "Error",
        description: insertError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-kunai-spin text-6xl">⭐</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8 animate-slide-down">
          <Shield className="w-16 h-16 mx-auto mb-4 text-accent" />
          <h1 className="text-4xl font-bold mb-2 bg-gradient-ninja bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage users and platform settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{stats.totalGames}</div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Scores</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.totalScores}</div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="border-border shadow-deep">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div 
                  key={profile.id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-primary">{profile.username}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={profile.role === "user" ? "default" : "outline"}
                      onClick={() => handleRoleChange(profile.id, "user")}
                    >
                      User
                    </Button>
                    <Button
                      size="sm"
                      variant={profile.role === "cashier" ? "default" : "outline"}
                      onClick={() => handleRoleChange(profile.id, "cashier")}
                    >
                      Cashier
                    </Button>
                    <Button
                      size="sm"
                      variant={profile.role === "admin" ? "default" : "outline"}
                      onClick={() => handleRoleChange(profile.id, "admin")}
                    >
                      Admin
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
