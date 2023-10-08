"use client";
import { WagmiConfig, sepolia } from "wagmi";
import Form from "./components/form";
import EventTable from "./components/eventTable";
import { useMemo, useState } from "react";
import Navigation from "./components/navigation";
import { configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import IUniswap from "./interfaces/IUniswap";

export default function Home() {
  const [data, setData] = useState<IUniswap[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Something went wrong!"
  );
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
        <Form
          memoizedUpdateTableData={memoizedUpdateTableData}
          setShowErrorAlert={setShowErrorAlert}
          setErrorMessage={setErrorMessage}
        />
        <EventTable updateTableData={data} />
        <div
          className={`alert fixed inset-x-0 bottom-10 alert-error ${
            showErrorAlert ? "" : "hidden"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      </main>
    </WagmiConfig>
  );
}
