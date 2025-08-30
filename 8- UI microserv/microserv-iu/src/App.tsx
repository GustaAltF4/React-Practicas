import { useState, useEffect } from "react";
import "./App.css";
import { Separator } from "@/components/ui/separator";
import { Content } from "./Content";
import { SquareCheckBig, SquareX} from "lucide-react"
type ServiceStatus = "loading" | "up" | "down";

function App() {
  const [statuses, setStatuses] = useState<Record<string, ServiceStatus>>({
    eureka: "loading",
    product: "loading",
    user: "loading",
    gateway: "loading",
  });

  const [allReady, setAllReady] = useState(false);

  const urls = {
    eureka: "https://microserv-v2.onrender.com",
    product: "https://microserv-v2-product.onrender.com/product",
    user: "https://microserv-v2-user.onrender.com/users",
    gateway: "https://microserv-v2-gateway.onrender.com/users",
  };

  const checkService = async (name: string, url: string) => {
    try {
      const res = await fetch(url);
      if (res.ok) {
        setStatuses((prev) => ({ ...prev, [name]: "up" }));
      } else {
        setStatuses((prev) => ({ ...prev, [name]: "down" }));
      }
    } catch {
      setStatuses((prev) => ({ ...prev, [name]: "down" }));
    }
  };

  useEffect(() => {
    const wakeUp = async () => {
      // 1. Chequear Eureka
      if (statuses.eureka !== "up") {
        await checkService("eureka", urls.eureka);
        return; // hasta que Eureka no esté UP no seguimos
      }

      // 2. Chequear Product y User en paralelo
      if (statuses.product !== "up" || statuses.user !== "up") {
        await Promise.all([
          checkService("product", urls.product),
          checkService("user", urls.user),
        ]);
        return; // esperamos a que ambos se despierten antes de Gateway
      }

      // 3. Chequear Gateway al final
      if (statuses.gateway !== "up") {
        await checkService("gateway", urls.gateway);
      }
    };

    wakeUp();

    // Reintentar cada 5s hasta que todos estén arriba
    const interval = setInterval(wakeUp, 5000);
    return () => clearInterval(interval);
  }, [statuses.eureka, statuses.product, statuses.user, statuses.gateway]);

  useEffect(() => {
    if (Object.values(statuses).every((s) => s === "up")) {
      setAllReady(true);
    }
  }, [statuses]);

  if (!allReady) {
    return (
      <div className="flex flex-col  items-center justify-center h-screen gap-6 px-6 ">
        <h1 className="text-xl font-bold  mb-4">
          Inicializando servicios...<br/>
          Initializing services...
        </h1>
        <div className="space-y-2">
          {Object.entries(statuses).map(([name, status]) => (
            <div
              key={name}
              className="flex items-center justify-between w-72 px-4 py-2 bg-slate-800 rounded-xl"
            >
              <span className="text-white capitalize">{name}</span>
              {status === "loading" && (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              )}
              {status === "up" && <span className="text-green-400"><SquareCheckBig/></span>}
              {status === "down" && <span className="text-red-400"><SquareX/></span>}
            </div>
          ))}
        </div>
        <Separator className="my-4 w-full max-w-3xl border-t" />
        <p className="text-sm max-w-3xl">
          Puede tardar bastante porque los servicios están en Render gratuito.<br />
          This may take some time because the services are on free hosting.
        </p>
      </div>
    );
  }

  return <Content />;
}

export default App;
