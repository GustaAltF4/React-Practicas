import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ButtonUpdate() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState("Users")

    const [userData, setUserData] = useState({ id: 0, name: "", email: "" });
    const [productData, setProductData] = useState({
        id: 0,
        name: "",
        description: "",
        price: 0,
        userId: null as number | null,
        imageUrl: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        setLoading(true);

        try {
            if (selectedService === "Users" && userData.id <= 0) {
                throw new Error(`User ID is not valid.`)
            }
            if (selectedService === "Product" && productData.id <= 0) {
                throw new Error(`User ID is not valid.`)
            }

              if (selectedService==="Product" && productData.price <= 0) {
                throw new Error(`Price must be greater than 0.`)
            }

            const getRes = await fetch(
                `https://microserv-v2-gateway.onrender.com/${selectedService.toLocaleLowerCase()}/id/${selectedService === "Users" ? userData.id : productData.id}`
            ) 
            if (!getRes.ok) {
                throw new Error(`The ${selectedService} could not be obtained.`)
            }
            const original = await getRes.json();

            let updatedUser : typeof userData | null = null;
            let updatedProduct : typeof productData | null = null;

            if (selectedService === "Users") {
                updatedUser = {
                    id: userData.id,
                    name: userData.name || original.name,
                    email: userData.email || original.email,
                };
            } else {
                updatedProduct = {
                    id: productData.id,
                    name: productData.name || original.name,
                    description: productData.description || original.description,
                    price: productData.price || original.price,
                    userId: productData.userId || original.userId,
                    imageUrl: productData.imageUrl || original.imageUrl,
                };
            }

            const id = selectedService === "Users" ? userData.id : productData.id;
            const response = await fetch(
                `https://microserv-v2-gateway.onrender.com/${selectedService.toLocaleLowerCase()}/update/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(selectedService === "Users" ? updatedUser : updatedProduct),
                }
            );

            if (!response.ok) {
                throw new Error(`Error when updating ${selectedService}.`);
            }

            const data = await response.json();
            setSuccess(`ID: ${data.id}`);
        }catch (error : any) {
            setError(error.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog>

            <DialogTrigger asChild className="w-100 mt-4 ">
                <Button variant="outline">Test PUT Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Data</DialogTitle>
                        <DialogDescription>
                            https://microserv-v2-gateway.onrender.com/{selectedService.toLocaleLowerCase()}/update/{selectedService === "Users" ? userData.id : productData.id}
                        </DialogDescription>
                        {error && (
                            <div className="text-red-500 text-sm font-medium">
                                {error}
                            </div>
                        )}
                    </DialogHeader>

                    <RadioGroup
                        value={selectedService}
                        onValueChange={setSelectedService}
                        className="flex gap-4 mb-4 mt-4"
                    >
                        {["Users", "Product"].map((srv) => (
                            <div key={srv} className="flex items-center space-x-2">
                                <RadioGroupItem value={srv} id={srv} />
                                <Label htmlFor={srv}>{srv}</Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <div className="grid gap-4">
                        {selectedService === "Users" && (
                            <>
                                <div className="grid gap-3">
                                    <Label>ID</Label>
                                    <Input
                                        required
                                        type="number"
                                        value={userData.id}
                                        onChange={(e) => setUserData({ ...userData, id: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Name</Label>
                                    <Input
                                        
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Email</Label>
                                    <Input
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        {selectedService === "Product" && (
                            <>
                                <div className="grid gap-3">
                                    <Label>ID</Label>
                                    <Input
                                        required
                                        type="number"
                                        value={productData.id}
                                        onChange={(e) => setProductData({ ...productData, id: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Name</Label>
                                    <Input
                                        
                                        value={productData.name}
                                        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Description</Label>
                                    <Input
                                        value={productData.description}
                                        onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Price</Label>
                                    <Input
                                        required
                                        type="number"
                                        value={productData.price}
                                        onChange={(e) => setProductData({ ...productData, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label>User ID</Label>
                                    <Input
                                        type="number"
                                        value={productData.userId ?? ""}
                                        onChange={(e) => setProductData({
                                            ...productData,
                                            userId: e.target.value === "" ? null : Number(e.target.value)
                                        })}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Image URL</Label>
                                    <Input
                                        value={productData.imageUrl}
                                        onChange={(e) => setProductData({ ...productData, imageUrl: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Status */}
                    <div className="text-sm text-muted-foreground mt-4 mb-4">
                        Status:{" "}
                        <span
                            className={`ml-1 font-semibold ${loading
                                ? "text-gray-500"
                                : success
                                    ? "text-teal-600"
                                    : error
                                        ? "text-red-600"
                                        : "text-gray-400"
                                }`}
                        >
                            {loading
                                ? "Loading..."
                                : success
                                    ? `200 OK → ${selectedService} with ${success} successfully updated.`
                                    : error
                                        ? "Error"
                                        : "—"}
                        </span>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
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
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}