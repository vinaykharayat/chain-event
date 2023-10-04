import { useEffect, useState } from "react";
import { useContractEvent, useContractRead } from "wagmi";
import getAbi from "../utils/getAbi";
import { setTimeout } from "timers";
import { formatEther, parseEther } from "viem";

export default function Form({ memoizedUpdateTableData }) {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState(
    "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
  ); //Set default to WETH of mainnet
  const [event, setEvent] = useState("Mint");
  const [networkType, setNetworkType] = useState("mainnet");
  const [uniswapFactoryAbi, setUniswapFactoryAbi] = useState([]);
  const [poolFee, setPoolFee] = useState("3000");
  const [poolAddress, setPoolAddress]: any = useState();
  const [poolAbi, setPoolAbi] = useState([]);
  const [buttonText, setButtonText] = useState("Start Listening");
  const [isDisabled, setIsDisabled] = useState(false);

  const UNISWAP_FACTORY: string =
    process.env.NEXT_PUBLIC_UNISWAP_FACTORY ??
    "0x1F98431c8aD98523631AE4a59f267346ea31F984";

  const getPoolFunc = useContractRead({
    address: UNISWAP_FACTORY,
    abi: uniswapFactoryAbi,
    functionName: "getPool",
    args: [tokenA, tokenB, poolFee],
  });

  useEffect(() => {
    if (!getPoolFunc.isLoading && getPoolFunc.data) {
      console.log("poolAddress", getPoolFunc.data);
      setPoolAddress(getPoolFunc.data);
    }
  }, [getPoolFunc.isLoading, uniswapFactoryAbi]);

  useEffect(() => {
    if (poolAddress) {
      const timer = setTimeout(() => {
        getAbi(poolAddress, networkType).then((value) => {
          setPoolAbi(value);
          console.log("poolAbi", value);
          setButtonText("Listening started...");
        });
      }, 5000); // Wait for 5 seconds.
      return () => clearTimeout(timer); // Clear the timeout when the component unmounts.
    }
  }, [poolAddress, networkType]);

  useContractEvent({
    address: poolAddress,
    abi: poolAbi,
    eventName: event,
    listener(log) {
      console.log(formatEther(log[0].args.amount0, "wei"));
      console.log(BigInt(log[0].blockNumber).toString());
      const data = {
        poolAddress: log[0].address,
        amountTokenA: formatEther(log[0].args.amount0, "wei"),
        amountTokenB: formatEther(log[0].args.amount1, "wei"),
        blockNumber: BigInt(log[0].blockNumber).toString(),
        eventName: log[0].eventName,
        transactionHash: log[0].transactionHash,
      };
      console.log("data", data);
      memoizedUpdateTableData(data);
    },
  });

  useEffect(() => {
    console.log("refetching...");
    getPoolFunc.refetch();
  }, [uniswapFactoryAbi]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Processing...");
    setIsDisabled(true);
    const factoryAbi = await getAbi(UNISWAP_FACTORY, networkType);
    setUniswapFactoryAbi(factoryAbi);
    // await getPoolFunc.refetch();
    // if (poolAddress) {
    //   await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds.
    //   const poolAbi = await getAbi(poolAddress, networkType);
    //   setPoolAbi(poolAbi);
    //   console.log("poolAbi", poolAbi);
    // }
  };

  return (
    <form onSubmit={handleFormSubmit} className="form-control">
      <div className="flex">
        <div className="mx-2">
          <label class="label mt-4">
            <span class="label-text">Token A</span>
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
          <label class="label mt-4">
            <span class="label-text">Token B</span>
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

      <div className="grid grid-cols-2">
        <div className="mx-2">
          <label class="label mt-4">
            <span class="label-text">Ethereum</span>
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
          <label class="label mt-4">
            <span class="label-text">Pool Fees</span>
          </label>
          <select
            className="select w-full"
            value={poolFee}
            onChange={(e) => {
              setPoolFee(e.target.value);
            }}
          >
            <option value={500}>0.05</option>
            <option value={3000}>0.3</option>
            <option value={10000}>1</option>
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
