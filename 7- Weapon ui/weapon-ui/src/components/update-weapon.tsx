import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react"; // ✅ spinner icon
import type { Weapon } from "./constants/Weapons";


export default function WeaponUpdateForm() {
    const [weapon, setWeapon] = useState<Weapon>({
        id: 0,
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
        setWeapon((prev) => ({ ...prev, [name]: name === "id" ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        setLoading(true);
        try {

            // Traer arma actual por ID
            const getRes = await fetch(`https://api-weapon-v2.onrender.com/weapons/id/${weapon.id}`);
            if (!getRes.ok) throw new Error("The weapon could not be obtained");
            const original = await getRes.json();

            // Crear nuevo objeto con los datos del form, pero rellenando con lo viejo si falta
            const updatedWeapon = {
                id: weapon.id,
                name: weapon.name || original.name,
                game: weapon.game || original.game,
                description: weapon.description || original.description,
                imageURL: weapon.imageURL || original.imageURL,
            };

            const response = await fetch(`https://api-weapon-v2.onrender.com/weapons/update/${weapon.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedWeapon),
            });

            if (!response.ok) {
                throw new Error("Error updating the weapon");
            }

            const data = await response.json();
            setSuccess(`ID: ${data.id}`);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4  bg-stone-900 rounded-xl shadow-md p-6 border ">
            <h1 className="text-base font-semibold">
                🛠️ Endpoint:
                <span className="ml-2 font-mono text-sm text-muted-foreground">
                    /weapons/update/{weapon.id}
                </span>
            </h1>

            <Input
                type="number"
                name="id"
                placeholder="Weapon ID"
                value={weapon.id}
                onChange={handleChange}
                required
            />
            <Input
                type="text"
                name="name"
                placeholder="Weapon Name"
                value={weapon.name}
                onChange={handleChange}
            />

            <Input
                type="text"
                name="game"
                placeholder="Game"
                value={weapon.game}
                onChange={handleChange}
            />

            <Textarea
                name="description"
                placeholder="Description"
                value={weapon.description}
                onChange={handleChange}
            />

            <Input
                type="text"
                name="imageURL"
                placeholder="URL-image"
                value={weapon.imageURL}
                onChange={handleChange}
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
                Updates the weapon identified by the specified ID with the given details.
            </p>

            <div className="text-sm text-muted-foreground">
                Status:{" "}
                <span
                    className={`ml-1 font-semibold ${loading
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
                            ? `200 OK → Weapon updated with ${success}`
                            : error
                                ? `Error → ${error}`
                                : "—"}
                </span>
            </div>
        </form>
    );
}
