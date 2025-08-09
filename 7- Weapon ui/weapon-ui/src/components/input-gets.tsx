import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Weapon } from "./constants/Weapons";

export default function InputWeapon() {
  const [inputC, setInputC] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weapon, setWeapon] = useState<Weapon | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setWeapon(null);
    setLoading(true);

    if (!inputC.trim()) {
      setError("Please enter a valid request");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://api-weapon-v2.onrender.com/${inputC}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Request could not be completed");
      }

      const data: Weapon = await response.json();
      setWeapon(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-transparent rounded-xl shadow-md p-6 border-5 w-full max-w-3xl"
    >
      <h1 className="text-base font-semibold">
        Try GET Endpoint:
        <span className="ml-2 font-mono text-sm text-muted-foreground">
          https://api-weapon-v2.onrender.com/{inputC}
        </span>
        
        
      </h1>

      <Input
        type="text"
        placeholder="example: weapons or weapons/id/7"
        value={inputC}
        onChange={(e) => setInputC(e.target.value)}
        
      />

      <Button type="submit" disabled={loading} className="cursor-pointer">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Send Request"
        )}
      </Button>

      <p className="text-sm text-muted-foreground mb-4">Test any GET request.</p>

      {/* Status */}
      <div className="text-sm">
        Status:{" "}
        <span
          className={`ml-1 font-semibold ${
            loading
              ? "text-gray-500"
              : success
              ? "text-green-600"
              : error
              ? "text-red-600"
              : "text-gray-400"
          }`}
        >
          {loading
            ? "Loading..."
            : success
            ? "200 OK"
            : error
            ? "Error"
            : "—"}
        </span>
      </div>

      {/* Mostrar JSON si hay éxito */}
      {success && weapon && (
        <pre className="bg-black text-green-300 p-4 rounded-lg whitespace-pre-wrap break-words text-xs">
          {JSON.stringify(weapon, null, 2)}
        </pre>
      )}

      {/* Mostrar error */}
      {error && (
        <div className="text-red-400 bg-red-900/20 p-3 rounded-lg text-xs">
          {error}
        </div>
      )}
    </form>
  );
}
