
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';  // Updated port

const CppLauncher: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/health`, {
        method: 'GET',
      });
      
      if (res.ok) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
        toast({
          title: "Connection Successful",
          description: "Successfully connected to the C++ server",
        });
      } else {
        setResponse(`Error: ${res.status} ${res.statusText}`);
        toast({
          title: "Connection Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error connecting to C++ server:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Connection Failed",
        description: `Could not connect to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">C++ Server Launcher</h1>
      <p className="mb-4">Test connection to the C++ server running at: {API_URL}</p>
      
      <Button 
        onClick={handleTestConnection} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </Button>
      
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default CppLauncher;
