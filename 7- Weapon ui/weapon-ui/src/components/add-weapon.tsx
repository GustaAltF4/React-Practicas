import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import type { Weapon2 } from "./constants/Weapons";


export default function WeaponPostForm() {
  const [weapon, setWeapon] = useState<Weapon2>({
    name: "",
    game: "",
    description: "",
    imageURL: "",
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWeapon((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("https://api-weapon-v2.onrender.com/weapons/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weapon),
      });

      if (!response.ok) {
        throw new Error("Error when creating the weapon");
      }

      const data = await response.json();
      setSuccess(`ID: ${data.id}`);
      setWeapon({ name: "", game: "", description: "", imageURL: "" });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4  bg-stone-900 rounded-xl shadow-md p-6 border ">
      <h1 className="text-base font-semibold">
        🖊️ Endpoint:
        <span className="ml-2 font-mono text-sm text-muted-foreground">
          /weapons/add
        </span>
      </h1>


      <Input
        type="text"
        name="name"
        placeholder="Weapon Name"
        value={weapon.name}
        onChange={handleChange}
        required
      />

      <Input
        type="text"
        name="game"
        placeholder="Game"
        value={weapon.game}
        onChange={handleChange}
        required
      />

      <Textarea
        name="description"
        placeholder="Description"
        value={weapon.description}
        onChange={handleChange}
        required
      />

      <Input
        type="text"
        name="imageURL"
        placeholder="URL-image"
        value={weapon.imageURL}
        onChange={handleChange}
        required
      />

      <Button type="submit" disabled={loading} className=" cursor-pointer">
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
        Creates a new weapon with the provided details.
      </p>

      <div className="text-sm text-muted-foreground">
        Status:{" "}
        <span className={`ml-1 font-semibold ${loading
          ? "text-gray-500"
          : success
            ? "text-green-600"
            : error
              ? "text-red-600"
              : "text-gray-400"
          }`}>
          {loading ? "Loading..." : success ? `200 OK → Weapon created whith ${success}` : error ? "Error" : "—"}
        </span>
      </div>
    </form>
  );
}
