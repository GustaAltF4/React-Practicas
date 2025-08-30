import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InputJson() {
  const [inputC, setInputC] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null); // <- ahora puede ser cualquier JSON

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setData(null);
    setLoading(true);

    if (!inputC.trim()) {
      setError("Please enter a valid request");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://microserv-v2-gateway.onrender.com/${inputC}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = await response.json();
      setData(json);
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
      className="space-y-4 bg-transparent rounded-xl shadow-md p-6 border-5 w-full max-w-3xl mt-6"
    >
      <h1 className=" font-semibold">
        Test GET Endpoint:
        <span className="ml-2 font-mono text-sm text-muted-foreground">
          https://microserv-v2-gateway.onrender.com/{inputC}
        </span>
      </h1>

      <Input
        type="text"
        placeholder="example: 'user', 'product', 'users/details' , or 'users/id/1'"
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

      <p className="text-sm  mb-4">Test any GET request.</p>

      {/* Status */}
      <div className="text-sm">
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
              ? "200 OK"
              : error
                ? "Error"
                : "—"}
        </span>
      </div>

      {/* Mostrar JSON si hay éxito */}
      {success && data && (
        <div className="w-full max-w-3xl mx-auto bg-black rounded-lg">
          <div className="flex flex-col items-center ">
            <pre className=" text-teal-500 p-4  break-words text-xs text-left">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

        </div>
      )}

      {/* Mostrar error */}
      {error && (
        <div className="text-red-400 bg-red-900/20 p-3 rounded-lg text-xs ">
          {error}
        </div>
      )}
    </form>
  );
}
