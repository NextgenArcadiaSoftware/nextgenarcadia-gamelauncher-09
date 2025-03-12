import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Timer, GamepadIcon, History, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/storage-helpers";
import type { Game } from "@/types/game";

interface OwnerDashboardProps {
  onClose: () => void;
  onAddGame: (game: Game) => void;
}

const defaultGames: Omit<Game, "id" | "created_at" | "updated_at">[] = [
  {
    title: "Fruit Ninja VR",
    description: "Slice your way through a delicious lineup of fruits and compete for high scores.",
    genre: "Action",
    release_date: "2016-07-07",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=hPY4TRRHwZc",
    executable_path: "steam://rungameid/486780",
    status: "enabled"
  },
  {
    title: "Elven Assassin",
    description: "Defend your castle from hordes of orcs with your bow and arrow.",
    genre: "Action",
    release_date: "2016-12-01",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=D94cNMNyMy4",
    executable_path: "steam://rungameid/503770",
    status: "enabled"
  },
  {
    title: "Crisis Brigade 2 Reloaded",
    description: "Fast-paced VR shooting gallery game inspired by classic light gun games.",
    genre: "Action",
    release_date: "2020-05-21",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=pZHvTXD7QEw",
    executable_path: "steam://rungameid/1294750",
    status: "enabled"
  },
  {
    title: "Creed: Rise to Glory Championship Edition",
    description: "Step into the ring in this intense VR boxing experience featuring iconic characters from the Creed and Rocky universe.",
    genre: "Sports",
    release_date: "2023-04-04",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=EgbCMJ54xeM",
    executable_path: "steam://rungameid/804490",
    status: "enabled"
  },
  {
    title: "Beat Saber",
    description: "The ultimate VR rhythm game. Slash the beats, move to the music, and play the way you want to play.",
    genre: "Rhythm",
    release_date: "2019-05-21",
    thumbnail: "/lovable-uploads/1b5bd71c-b0e9-4c92-ab66-af7bc3967abb.png",
    trailer: "https://www.youtube.com/watch?v=vL39Sg2AqWg",
    executable_path: "steam://rungameid/620980",
    status: "enabled"
  },
  {
    title: "Richies Plank Experience",
    description: "Face your fears in VR! Walk a narrow plank 80 stories high above a bustling city.",
    genre: "Simulation",
    release_date: "2016-12-21",
    thumbnail: "/lovable-uploads/af1a36b9-7e7b-4f03-814d-ea2c073181e0.png",
    trailer: "https://www.youtube.com/watch?v=faNsP7ExSt0",
    executable_path: "steam://rungameid/517160",
    status: "enabled"
  },
  {
    title: "RollerCoaster Legends",
    description: "Experience thrilling roller coaster rides in stunning virtual environments.",
    genre: "Adventure",
    release_date: "2017-12-21",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=OpnTbOz_POE",
    executable_path: "steam://rungameid/901520",
    status: "enabled"
  },
  {
    title: "Arizona Sunshine II",
    description: "Face the zombie apocalypse in VR! Jump into the action-packed American Southwest.",
    genre: "Action",
    release_date: "2023-12-07",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=kNaSe37rcG4",
    executable_path: "steam://rungameid/1540210",
    status: "enabled"
  }
];

export function OwnerDashboard({ onClose, onAddGame }: OwnerDashboardProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [timerDuration, setTimerDuration] = useState(8);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 0,
    todaySessions: 0,
    averageDuration: 0,
    popularGames: [] as { title: string; count: number }[]
  });
  const [gameRatings, setGameRatings] = useState<{
    title: string;
    averageRating: number;
    totalRatings: number;
  }[]>([]);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<{
    month: number;
    year: number;
    total_sessions: number;
    unique_games_played: number;
    avg_duration: number;
    completed_sessions: number;
    game_title: string;
  }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
    fetchSettings();
    fetchSessionStats();
    fetchGameRatings();
    fetchMonthlyAnalytics();
  }, []);

  const fetchGameRatings = async () => {
    const { data: ratingsData, error } = await supabase
      .from('game_ratings')
      .select(`
        rating,
        games!inner(
          title
        )
      `);

    if (error) {
      console.error('Error fetching ratings:', error);
      return;
    }

    const ratingsByGame = ratingsData.reduce((acc: { [key: string]: number[] }, curr: any) => {
      const title = curr.games.title;
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(curr.rating);
      return acc;
    }, {});

    const ratings = Object.entries(ratingsByGame).map(([title, ratings]) => ({
      title,
      averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      totalRatings: ratings.length
    })).sort((a, b) => b.averageRating - a.averageRating);

    setGameRatings(ratings);
  };

  const fetchSessionStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: totalSessions } = await supabase
      .from('game_sessions')
      .select('*', { count: 'exact', head: true });

    const { count: todaySessions } = await supabase
      .from('game_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('started_at', today.toISOString());

    const { data: durationData } = await supabase
      .from('game_sessions')
      .select('duration')
      .not('duration', 'is', null);

    const averageDuration = durationData && durationData.length > 0
      ? Math.round(durationData.reduce((acc, curr) => acc + (curr.duration || 0), 0) / durationData.length)
      : 0;

    const { data: popularGamesData } = await supabase
      .from('game_sessions')
      .select(`
        games:game_id (
          title
        )
      `)
      .not('game_id', 'is', null);

    const gamePlayCounts = popularGamesData?.reduce((acc: {[key: string]: number}, session: any) => {
      if (session.games?.title) {
        const title = session.games.title;
        acc[title] = (acc[title] || 0) + 1;
      }
      return acc;
    }, {});

    const popularGames = Object.entries(gamePlayCounts || {})
      .map(([title, count]) => ({ title, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setSessionStats({
      totalSessions: totalSessions || 0,
      todaySessions: todaySessions || 0,
      averageDuration,
      popularGames
    });
  };

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('title');
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch games"
      });
      return;
    }

    if (!data || data.length === 0) {
      for (const game of defaultGames) {
        const { error: insertError } = await supabase
          .from('games')
          .insert([game])
          .select();
        
        if (insertError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to insert ${game.title}`
          });
        }
      }
      const { data: updatedData } = await supabase
        .from('games')
        .select('*')
        .order('title');
      
      setGames(updatedData as Game[]);
    } else {
      setGames(data as Game[]);
    }
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('timer_duration')
      .eq('id', 'global')
      .single();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch settings"
      });
      return;
    }

    if (data) {
      setTimerDuration(data.timer_duration);
    }
  };

  const fetchMonthlyAnalytics = async () => {
    const { data, error } = await supabase
      .from('monthly_game_analytics')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) {
      console.error('Error fetching monthly analytics:', error);
      return;
    }

    setMonthlyAnalytics(data);
  };

  const handleGameStatusToggle = async (id: string, currentStatus: 'enabled' | 'disabled') => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    
    const { error } = await supabase
      .from('games')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update game status"
      });
      return;
    }

    setGames(prev => 
      prev.map(game => 
        game.id === id 
          ? { ...game, status: newStatus as 'enabled' | 'disabled' }
          : game
      )
    );

    const game = games.find(g => g.id === id);
    toast({
      title: "Success",
      description: `${game?.title} has been ${newStatus}`
    });
  };

  const handleTimerUpdate = async (value: number[]) => {
    setTimerDuration(value[0]);
    
    const { error } = await supabase
      .from('settings')
      .update({ timer_duration: value[0] })
      .eq('id', 'global');

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update timer duration"
      });
      return;
    }

    toast({
      title: "Success",
      description: `Timer duration updated to ${value[0]} minutes`
    });
  };

  const handleEditGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;

    const { error } = await supabase
      .from('games')
      .update({
        title: editingGame.title,
        description: editingGame.description,
        genre: editingGame.genre,
        release_date: editingGame.release_date,
        thumbnail: editingGame.thumbnail,
        trailer: editingGame.trailer,
        executable_path: editingGame.executable_path,
      })
      .eq('id', editingGame.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update game"
      });
      return;
    }

    setGames(prev =>
      prev.map(game =>
        game.id === editingGame.id
          ? editingGame
          : game
      )
    );

    toast({
      title: "Success",
      description: "Game updated successfully"
    });

    setEditingGame(null);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Game Management</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="stats">Overview</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessionStats.totalSessions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
                  <GamepadIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessionStats.todaySessions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                  <Timer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessionStats.averageDuration} min</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Popular Games</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessionStats.popularGames.map((game) => (
                    <div key={game.title} className="flex items-center justify-between">
                      <span>{game.title}</span>
                      <span className="text-muted-foreground">{game.count} sessions</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyAnalytics.reduce((acc: any[], curr) => {
                    const monthYear = `${new Date(0, curr.month - 1).toLocaleString('default', { month: 'long' })} ${curr.year}`;
                    const existingMonth = acc.find(m => m.monthYear === monthYear);
                    
                    if (existingMonth) {
                      existingMonth.games.push({
                        title: curr.game_title,
                        sessions: curr.total_sessions,
                        completed: curr.completed_sessions,
                        avgDuration: Math.round(curr.avg_duration)
                      });
                    } else {
                      acc.push({
                        monthYear,
                        month: curr.month,
                        year: curr.year,
                        games: [{
                          title: curr.game_title,
                          sessions: curr.total_sessions,
                          completed: curr.completed_sessions,
                          avgDuration: Math.round(curr.avg_duration)
                        }]
                      });
                    }
                    return acc;
                  }, []).map((month) => (
                    <div key={month.monthYear} className="space-y-4">
                      <h3 className="text-lg font-semibold">{month.monthYear}</h3>
                      <div className="grid gap-4">
                        {month.games.map((game: any) => (
                          <div key={game.title} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                            <div>
                              <div className="font-medium">{game.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {game.completed} completed of {game.sessions} sessions
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{game.avgDuration} min</div>
                              <div className="text-sm text-muted-foreground">
                                avg. duration
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {monthlyAnalytics.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No monthly data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ratings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Game Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gameRatings.map((game) => (
                    <div key={game.title} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{game.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {game.totalRatings} {game.totalRatings === 1 ? 'rating' : 'ratings'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{game.averageRating.toFixed(1)}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </div>
                  ))}
                  {gameRatings.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No ratings yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timer">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Session Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Session Duration (minutes)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[timerDuration]}
                        onValueChange={handleTimerUpdate}
                        min={1}
                        max={60}
                        step={1}
                        className="w-[300px]"
                      />
                      <span className="font-mono">{timerDuration} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="games">
            <div className="space-y-4">
              {games.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={game.thumbnail} 
                      alt={game.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-base font-medium">{game.title}</h4>
                      <p className="text-sm text-muted-foreground">{game.genre}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingGame(game)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Switch
                      checked={game.status === 'enabled'}
                      onCheckedChange={() => handleGameStatusToggle(game.id, game.status)}
                    />
                  </div>
                </div>
              ))}
              {games.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No games found</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {editingGame && (
          <Dialog open={!!editingGame} onOpenChange={() => setEditingGame(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Game</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditGame} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingGame.title}
                    onChange={(e) =>
                      setEditingGame({ ...editingGame, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingGame.description}
                    onChange={(e) =>
                      setEditingGame({ ...editingGame, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={editingGame.genre}
                      onChange={(e) =>
                        setEditingGame({ ...editingGame, genre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="release_date">Release Date</Label>
                    <Input
                      id="release_date"
                      type="date"
                      value={editingGame.release_date}
                      onChange={(e) =>
                        setEditingGame({ ...editingGame, release_date: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={editingGame.thumbnail} 
                        alt={editingGame.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow space-y-2">
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          try {
                            toast({
                              title: "Uploading",
                              description: "Uploading thumbnail...",
                            });

                            const fileExt = file.name.split('.').pop();
                            const fileName = `${Date.now()}-${editingGame.id}.${fileExt}`;
                            
                            const publicUrl = await uploadFile(file, 'game-thumbnails', fileName);
                            
                            setEditingGame({ ...editingGame, thumbnail: publicUrl });
                            
                            toast({
                              title: "Success",
                              description: "Thumbnail uploaded successfully",
                            });
                          } catch (error) {
                            console.error('Error uploading thumbnail:', error);
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description: "Failed to upload thumbnail. Please check console for details.",
                            });
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          document.getElementById('thumbnail')?.click();
                        }}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Image
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trailer">Trailer URL (Optional)</Label>
                  <Input
                    id="trailer"
                    type="url"
                    value={editingGame.trailer || ''}
                    onChange={(e) =>
                      setEditingGame({ ...editingGame, trailer: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="executable_path">Steam Game ID or Executable Path</Label>
                  <Input
                    id="executable_path"
                    type="text"
                    placeholder="steam://rungameid/123456 or C:\Games\game.exe"
                    value={editingGame.executable_path || ''}
                    onChange={(e) =>
                      setEditingGame({ ...editingGame, executable_path: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => setEditingGame(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}

