"use client";
import { WagmiConfig } from "wagmi";
import Form from "./components/form";
import config from "./providers/config";
import EventTable from "./components/eventTable";
import { useMemo, useState } from "react";
import Navigation from "./components/navigation";

export default function Home() {
  const [data, setData] = useState([]);

  const memoizedUpdateTableData = useMemo(() => {
    return (newData) => {
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
