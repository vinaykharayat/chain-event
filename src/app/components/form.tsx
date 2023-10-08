import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { mainnet, sepolia, useContractEvent, useContractRead } from "wagmi";
import getAbi from "../utils/getAbi";
import { setTimeout } from "timers";
import { formatEther } from "viem";

export default function Form({ memoizedUpdateTableData }) {
  const [tokenA, setTokenA] = useState<string>("");
  const [tokenB, setTokenB] = useState<string>(
    "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
  ); //Set default to WETH of mainnet
  const [event, setEvent] = useState<string>("Mint");
  const [networkType, setNetworkType] = useState<string>("mainnet");
  const [uniswapFactoryAddress, setUniswapFactoryAddress] = useState<string>(
    "0x1F98431c8aD98523631AE4a59f267346ea31F984"
  );
  const [uniswapFactoryAbi, setUniswapFactoryAbi] = useState<Object[]>([]);
  const [poolFee, setPoolFee] = useState<number>(3000);
  const [poolAddress, setPoolAddress]: any = useState<string>();
  const [poolAbi, setPoolAbi] = useState<Object[]>([]);
  const [buttonText, setButtonText] = useState<string>("Start Listening");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(mainnet.id);

  const getPoolFunc = useContractRead({
    address: uniswapFactoryAddress,
    abi: uniswapFactoryAbi,
    functionName: "getPool",
    args: [tokenA, tokenB, poolFee],
    chainId: chainId,
    onSuccess(data) {
      console.log("poolAddress", data);
      setPoolAddress(data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  useEffect(() => {
    console.log("uniswapFactoryAbi", uniswapFactoryAbi);
    console.log("uniswapFactoryAddress", uniswapFactoryAddress);
    console.log("tokenA", tokenA);
    console.log("tokenB", tokenB);
    console.log("poolFee", poolFee);
    console.log("chainId", chainId);
    getPoolFunc.refetch();
  }, [uniswapFactoryAbi]);

  useEffect(() => {
    if (poolAddress) {
      const timer = setTimeout(() => {
        getAbi(poolAddress, networkType).then((value) => {
          setPoolAbi(value);
          console.log("poolAbi", value);
          console.log("eventype", event);
          setButtonText("Listening started...");
        });
      }, 5000); // Wait for 5 seconds.
      return () => clearTimeout(timer); // Clear the timeout when the component unmounts.
    }
  }, [poolAddress]);

  useEffect(() => {
    switch (networkType) {
      case "sepolia":
        setUniswapFactoryAddress("0x0227628f3F023bb0B980b67D528571c95c6DaC1c");
        setChainId(sepolia.id);
        break;
      case "mainnet":
        setUniswapFactoryAddress("0x1F98431c8aD98523631AE4a59f267346ea31F984");
        setChainId(mainnet.id);
        break;
      default:
        setUniswapFactoryAddress("0x1F98431c8aD98523631AE4a59f267346ea31F984");
        setChainId(mainnet.id);
    }
    // getPoolFunc.refetch();
  }, [networkType]);

  useContractEvent({
    address: poolAddress,
    abi: poolAbi,
    eventName: event,
    listener(log) {
      console.log("Event:", log);
      const data = {
        id: log[0].logIndex,
        poolAddress: log[0].address,
        amountTokenA: formatEther(log[0].args.amount0, "wei"),
        amountTokenB: formatEther(log[0].args.amount1, "wei"),
        blockNumber: BigInt(log[0].blockNumber).toString(),
        eventName: log[0].eventName,
        transactionHash: log[0].transactionHash,
      };
      memoizedUpdateTableData(data);
    },
    chainId: chainId,
  });

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setButtonText("Processing...");
    setIsDisabled(true);
    const factoryAbi = await getAbi(uniswapFactoryAddress, networkType);
    setUniswapFactoryAbi(factoryAbi);
  };

  return (
    <form onSubmit={handleFormSubmit} className="form-control">
      <div className="flex">
        <div className="mx-2">
          <label className="label mt-4">
            <span className="label-text">Token A</span>
          </label>
          <input
            className="input"
            placeholder="Token A Address"
            onChange={(e) => {
              setTokenA(e.target.value);
            }}
            value={tokenA}
          />
        </div>
        <div>
          <label className="label mt-4">
            <span className="label-text">Token B</span>
            <span className="label-text">Default: WETH</span>
          </label>
          <input
            className="input"
            placeholder="Token B Address"
            onChange={(e) => {
              setTokenB(e.target.value);
            }}
            value={tokenB}
          />
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="mx-2">
          <label className="label mt-4">
            <span className="label-text">Ethereum</span>
          </label>
          <select
            className="select w-full"
            value={networkType}
            onChange={(e) => {
              setNetworkType(e.target.value);
            }}
          >
            <option value={"sepolia"}>Sepolia</option>
            <option value={"mainnet"}>Mainnet</option>
          </select>
        </div>
        <div className="mx-2">
          <label className="label mt-4">
            <span className="label-text">Pool Fees</span>
          </label>
          <select
            className="select w-full"
            value={poolFee}
            onChange={(e) => {
              setPoolFee(parseInt(e.target.value));
            }}
          >
            <option value={500}>0.05</option>
            <option value={3000}>0.3</option>
            <option value={10000}>1</option>
          </select>
        </div>
        <div className="mx-2">
          <label className="label mt-4">
            <span className="label-text">Event</span>
          </label>
          <select
            className="select w-full"
            value={event}
            onChange={(e) => {
              setEvent(e.target.value);
            }}
          >
            <option value={"Mint"}>Add Liquidity</option>
          </select>
        </div>
      </div>
      <button
        className="mx-2 my-4 btn btn-lg btn-outline"
        disabled={isDisabled}
      >
        {buttonText}
      </button>
    </form>
  );
}
