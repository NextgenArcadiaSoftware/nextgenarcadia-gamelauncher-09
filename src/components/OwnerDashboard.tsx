
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  genre: z.string().min(2, {
    message: "Genre must be at least 2 characters.",
  }),
  release_date: z.string().min(2, {
    message: "Release date must be at least 2 characters.",
  }),
  thumbnail: z.string().url({ message: "Invalid URL." }),
  executable_path: z.string().min(2, {
    message: "Executable path must be at least 2 characters.",
  }),
  launch_code: z.string().min(2, {
    message: "Launch code must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

interface OwnerDashboardProps {
  onClose: () => void;
  onAddGame: (game: any) => void;
}

export function OwnerDashboard({ onClose, onAddGame }: OwnerDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("timer");
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      genre: "",
      release_date: "",
      thumbnail: "",
      executable_path: "",
      launch_code: "",
      description: "",
    },
  })

  useEffect(() => {
    const fetchTimerDuration = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('timer_duration')
          .eq('id', 'global')
          .single();

        if (error) throw error;

        if (data) {
          setTimerDuration(data.timer_duration);
        }
      } catch (error) {
        console.error('Error fetching timer duration:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch timer duration",
        });
      }
    };

    fetchTimerDuration();
  }, [toast]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddGame(values);
    toast({
      title: "Success!",
      description: "Game added successfully.",
    })
    form.reset();
  }

  const handleTimerDurationChange = async (newDuration: number) => {
    try {
      const { error } = await supabase
        .from('settings')
        .update({ timer_duration: newDuration })
        .eq('id', 'global');

      if (error) throw error;

      setTimerDuration(newDuration);
      toast({
        title: "Timer Updated",
        description: `Session duration set to ${newDuration} minutes`,
      });
    } catch (error) {
      console.error('Error updating timer duration:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update timer duration",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Owner Dashboard</DialogTitle>
          <DialogDescription>
            Manage settings and add new games to the platform.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="timer" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timer">Timer Settings</TabsTrigger>
            <TabsTrigger value="add-game">Add Game</TabsTrigger>
          </TabsList>

          <TabsContent value="timer">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="timer-duration">Session Duration (minutes)</Label>
                <Input
                  id="timer-duration"
                  type="number"
                  value={timerDuration ?? ''}
                  onChange={(e) => {
                    const newDuration = parseInt(e.target.value);
                    if (!isNaN(newDuration)) {
                      handleTimerDurationChange(newDuration);
                    }
                  }}
                  placeholder="Loading..."
                  disabled={timerDuration === null}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add-game">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter game title" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the title of the game.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter game genre" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the genre of the game.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="release_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the release date of the game.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter thumbnail URL" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the URL of the game thumbnail.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="executable_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Executable Path</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter executable path" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the path to the game executable.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="launch_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Launch Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter launch code" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the launch code for the game.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter game description" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the description of the game.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Game</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
