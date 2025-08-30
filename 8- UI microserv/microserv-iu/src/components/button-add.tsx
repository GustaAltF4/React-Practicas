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

export function ButtonAdd() {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState("Users")

    const [userData, setUserData] = useState({ name: "", email: "" });
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        userId: null as number | null,
        imageUrl: ""
    })
    const handleChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        setLoading(true);

        const body = selectedService === "Users" ? userData : productData;

        try {

            if (selectedService==="Product" && productData.price <= 0) {
                throw new Error(`Price must be greater than 0.`)
            }
            const response = await fetch(`https://microserv-v2-gateway.onrender.com/${selectedService.toLocaleLowerCase()}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(body),

                

            })

            

            

            if (!response.ok) {
                throw new Error(`Error when creating ${selectedService}.`);
            }

            const data = await response.json();
            setSuccess(`ID: ${data.id}`);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog>

            <DialogTrigger asChild className="w-100 mt-4 ">
                <Button variant="outline">Test POST Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleChange}>
                    <DialogHeader>
                        <DialogTitle>Add Data</DialogTitle>
                        <DialogDescription>
                            https://microserv-v2-gateway.onrender.com/{selectedService.toLocaleLowerCase()}/add
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
                                    <Label>Name</Label>
                                    <Input
                                        required
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
                                    <Label>Name</Label>
                                    <Input
                                        required
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
                                            userId: e.target.value === "" ? null : Number(e.target.value)})}
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
                                    ? `200 OK → ${selectedService} with ${success} successfully added`
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