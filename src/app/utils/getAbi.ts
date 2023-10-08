import axios from "axios";

export default async function getAbi(
  contractAddress: string,
  networkType: string
) {
  let url;
  console.log("networkType", networkType);
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
  console.log("url", url);
  console.log("response", response);
  if (response.data.status == "1") {
    const abi = JSON.parse(response.data.result);
    return abi;
  } else if (response.data.status == "0") {
    throw Error(response.data.result);
  }
}
