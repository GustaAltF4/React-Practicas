import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DeleteWeapon() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!id.trim()) {
      setError("Please enter an ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api-weapon-v2.onrender.com/weapons/del/id/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("The weapon could not be deleted.");
      }

      setSuccess(`ID: ${id}`);
      setId("");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (

    <form onSubmit={handleDelete} className="space-y-4 bg-stone-900 rounded-xl shadow-md p-6 border">
  <h1 className="text-base font-semibold">
    🗑️ Endpoint:
    <span className="ml-2 font-mono text-sm text-muted-foreground">
      /weapons/del/id/{id}
    </span>
  </h1>

  {error && (
    <div className="text-red-500 text-sm font-medium">
      {error}
    </div>
  )}

  <Input
    type="number"
    placeholder="ID of the weapon to be eliminated"
    value={id}
    onChange={(e) => setId(e.target.value)}
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

  <p className="text-sm text-muted-foreground mb-4">
    Deletes the weapon identified by the specified ID.
  </p>

  <div className="text-sm text-muted-foreground">
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
        ? `200 OK → Weapon with ${success} successfully removed`
        : error
        ? "Error"
        : "—"}
    </span>
  </div>
</form>)
}
