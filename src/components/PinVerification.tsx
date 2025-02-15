
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface PinVerificationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PinVerification({ onSuccess, onCancel }: PinVerificationProps) {
  const [pin, setPin] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") { // In a real app, this would be properly secured
      onSuccess();
    } else {
      toast({
        variant: "destructive",
        title: "Invalid PIN",
        description: "Please try again",
      });
      setPin("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pin">Enter PIN</Label>
        <Input
          id="pin"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="****"
          maxLength={4}
          className="text-center text-2xl tracking-widest"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Verify
        </Button>
      </div>
    </form>
  );
}
