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

const services = [
    { name: 'Users', value: 'users' },
    { name: 'Products', value: 'product' },
]
export function ButtonDelete() {
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState("users")
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
            const response = await fetch(`https://microserv-v2-gateway.onrender.com/${selectedService}/del/id/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error(`The ${selectedService} could not be deleted.`);
            }

            setSuccess(`ID: ${id}`);
            setId("");
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog>

            <DialogTrigger asChild className="w-100 mt-4 ">
                <Button variant="outline">Test DELETE Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleDelete}>
                    <DialogHeader>
                        <DialogTitle>Delete Data</DialogTitle>
                        <DialogDescription>
                            https://microserv-v2-gateway.onrender.com/{selectedService}/del/id/{id}
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
                        {services.map((srv) => (
                            <div key={srv.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={srv.value} id={srv.value} />
                                <Label htmlFor={srv.value}>{srv.name}</Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label >Id User to delete</Label>
                            <Input type="number" value={id}
                                onChange={(e) => setId(e.target.value)} />
                        </div>
                    </div>
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
                                    ? `200 OK → ${selectedService} with ${success} successfully removed`
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