import {
  Dispatch,
  FormEvent,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { mainnet, sepolia, useContractEvent, useContractRead } from "wagmi";
import getAbi from "../utils/getAbi";
import { setTimeout } from "timers";
import { formatEther } from "viem";
import IUniswap from "../interfaces/IUniswap";

export default function Form({
  memoizedUpdateTableData,
  setShowErrorAlert,
  setErrorMessage,
}: {
  memoizedUpdateTableData: (newData: IUniswap) => void;
  setShowErrorAlert: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}) {
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
    address: uniswapFactoryAddress as `0x${string}`,
    abi: uniswapFactoryAbi,
    functionName: "getPool",
    args: [tokenA, tokenB, poolFee],
    chainId: chainId,
    onSuccess(data) {
      console.log("poolAddress", data);
      if (data == 0x0) {
        setButtonText("Start Listening");
        setIsDisabled(false);
        setShowErrorAlert(true);
        setErrorMessage(
          "Pool address not found, make sure token addresses, selected chain and pool fees are correct!"
        );

        setTimeout(function () {
          setShowErrorAlert(false);
        }, 10000);
      }
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
        getAbi(poolAddress, networkType)
          .then((value) => {
            setPoolAbi(value);
            console.log("poolAbi", value);
            console.log("eventype", event);
            setButtonText("Listening started...");
          })
          .catch((error) => {
            console.error(error);
            setButtonText("Start Listening");
            setIsDisabled(false);
            setShowErrorAlert(true);
            setErrorMessage(error.message);

            setTimeout(function () {
              setShowErrorAlert(false);
            }, 10000);
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
    listener(log: any[]) {
      console.log("Event:", log);
      const data: IUniswap = {
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
    getAbi(uniswapFactoryAddress, networkType)
      .then((value) => {
        setUniswapFactoryAbi(value);
      })
      .catch((error) => {
        console.error(error);
        setButtonText("Start Listening");
        setIsDisabled(false);
      });
  };

  return (
    <form onSubmit={handleFormSubmit} className="form-control">
      <div className="grid grid-cols-2">
        <div className="mx-2">
          <label className="label mt-4">
            <span className="label-text">Token A</span>
          </label>
          <input
            className="input w-full"
            placeholder="Token A Address"
            onChange={(e) => {
              setTokenA(e.target.value);
            }}
            value={tokenA}
            required
          />
        </div>
        <div>
          <label className="label mt-4">
            <span className="label-text">Token B</span>
            <span className="label-text">Default: WETH</span>
          </label>
          <input
            className="input w-full"
            placeholder="Token B Address"
            onChange={(e) => {
              setTokenB(e.target.value);
            }}
            value={tokenB}
            required
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

      <div
        className={`alert my-4 alert-warning max-w-prose ${
          networkType == "mainnet" ? "" : "hidden"
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
        <span>
          Get ABI API of Etherscan Mainnet is not working, so this project would
          not work as intended for mainnet!
        </span>
      </div>
      <button
        className="mx-2 my-4 btn btn-lg btn-outline"
        disabled={isDisabled}
      >
        {buttonText}
      </button>
      <div className={`alert my-4 alert-warning max-w-prose`}>
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
        <span>We only support uniswap pools at the moment!</span>
      </div>
    </form>
  );
}
