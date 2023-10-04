import axios from "axios";

export default async function getAbi(
  contractAddress: string,
  networkType: string
) {
  let url;
  switch (networkType) {
    case "sepolia":
      url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`;
      break;
    case "mainnet":
      url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`;
      break;
    default:
      url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`;
  }
  const response = await axios.get(url);
  console.log("contractAddress", contractAddress);
  const abi = JSON.parse(response.data.result);

  return abi;
}
