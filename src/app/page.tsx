"use client";
import { WagmiConfig, sepolia } from "wagmi";
import Form from "./components/form";
// import config from "./providers/config";
import EventTable from "./components/eventTable";
import { useMemo, useState } from "react";
import Navigation from "./components/navigation";
import { configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import IUniswap from "./interfaces/IUniswap";

export default function Home() {
  const [data, setData] = useState<IUniswap[]>([]);

  const { publicClient, webSocketPublicClient } = configureChains(
    [mainnet, sepolia],
    [publicProvider()]
  );

  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  });

  const memoizedUpdateTableData: (newData: IUniswap) => void = useMemo(() => {
    return (newData: IUniswap) => {
      setData([...data, newData]);
    };
  }, [data]);

  return (
    <WagmiConfig config={config}>
      <Navigation />
      <main className="w-full flex min-h-screen flex-col items-center p-24">
        <h1 className="text-3xl">Listen to any event in realtime!</h1>
        <Form memoizedUpdateTableData={memoizedUpdateTableData} />
        <EventTable updateTableData={data} />
      </main>
    </WagmiConfig>
  );
}
