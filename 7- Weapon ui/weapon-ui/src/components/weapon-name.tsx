import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Weapon } from "./constants/Weapons";
import { Loader2 } from "lucide-react"; 


export function WeaponByNameRequest() {
    const [weapon, setWeapon] = useState<Weapon | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequest = async () => {
        setLoading(true);
        setError(null);
        setWeapon(null);

        try {
            const res = await fetch("https://api-weapon-v2.onrender.com/weapons/name/Blades of Chaos");
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

            const data: Weapon = await res.json();
            setWeapon(data);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    🔍 Endpoint:
                    <span className="ml-2 font-mono text-sm text-muted-foreground">
                        /weapons/name/Blades of Chaos
                    </span>
                </CardTitle>
                <Button className="mt-2 w-fit cursor-pointer" onClick={handleRequest} disabled={loading}>
                    {loading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                        </>
                        ) : ("Send Request")}
                    
                </Button>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    Returns the weapon with the specified Name.
                </p>

                {error && (
                    <p className="text-red-600 font-semibold mb-4">
                        ❌ {error}
                    </p>
                )}

                {weapon && (
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col items-center">
                            <img
                                src="/BladeOfChaos_29.webp" 
                                alt={weapon.name}
                                className="w-[100vh] h-auto rounded-md shadow-md"
                            />
                            {weapon.imageURL && (
                                <a
                                    href={weapon.imageURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 text-sm  hover:underline"
                                >
                                    View original image 🔗
                                </a>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{weapon.name}</h3>
                            <p className="italic text-sm text-muted-foreground mb-2">
                                Game: {weapon.game}
                            </p>
                            <p>{weapon.description}</p>
                            <p className="mt-2 text-xs text-muted-foreground">ID: {weapon.id}</p>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="text-sm text-muted-foreground">
                Status:{" "}
                <span className={`ml-1 font-semibold ${
                    loading
                        ? "text-gray-500"
                        : weapon
                            ? "text-green-600"
                            : error
                                ? "text-red-600"
                                : "text-gray-400"
                }`}>
                    {loading ? "Loading..." : weapon ? "200 OK" : error ? "Error" : "—"}
                </span>
            </CardFooter>
        </Card>
    );
}
