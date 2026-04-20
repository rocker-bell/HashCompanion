import { Link } from "react-router-dom";
import "../Styles/HederaAppsMarketplace.css";
import { useState, useEffect } from "react";

import {
  Client,
  AccountId,
  PrivateKey,
  ContractCallQuery,
  ContractId,
  ContractFunctionParameters,
  Hbar
} from "@hashgraph/sdk";

import { AbiCoder } from "ethers";

interface AppItem {
  appId: number;
  appName: string;
  appDescription: string;
  appImage: string;
  appMetaData: string;
  appType: string;
  appStatus: string;
  owner: string;
}

interface Props {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null;
  network?: "testnet" | "mainnet";
}

const HederaAppsMarketplace = ({
  accountId,
  privateKey,
 
  network = "testnet"
}: Props) => {

  // ✅ CONTRACT ID IS NOW INSIDE COMPONENT
  const contractId = "0.0.8454022";

  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(false);

  const createClient = () => {
    const client =
      network === "mainnet"
        ? Client.forMainnet()
        : Client.forTestnet();

    client.setOperator(
      AccountId.fromString(accountId!),
      PrivateKey.fromStringECDSA(privateKey!)
    );

    return client;
  };

//   const fetchApps = async () => {
//     if (!accountId || !privateKey) return;

//     setLoading(true);

//     try {
//       const client = createClient();
//       const abiCoder = new AbiCoder();

//       const appStructABI = [
//         "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)"
//       ];

//       const results: AppItem[] = [];

//       for (let i = 1; i < 200; i++) {
//         try {
//           const query = new ContractCallQuery()
//             .setContractId(ContractId.fromString(contractId))
//             .setGas(300000)
//             .setFunction(
//               "getAppDetails",
//               new ContractFunctionParameters().addUint256(i)
//             )
//             .setMaxQueryPayment(new Hbar(1));

//           const response = await query.execute(client);

//           const decoded = abiCoder.decode(appStructABI, response.bytes)[0];

//           results.push({
//             appId: Number(decoded.appId),
//             appName: decoded.appName,
//             appDescription: decoded.appDescription,
//             appImage: decoded.appImage,
//             appMetaData: decoded.metadata,
//             appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][Number(decoded.appStatus)],
//             appType: ["Free", "Paid", "OpenSource", "Beta"][Number(decoded.appType)],
//             owner: decoded.owner.toLowerCase(),
//           });

//         } catch (err) {
//           break; // stop when no more apps
//         }
//       }

//       setApps(results);

//     } catch (err) {
//       console.error("Error fetching apps:", err);
//       setApps([]);
//     } finally {
//       setLoading(false);
//     }
//   };
        const fetchApps = async () => {
  if (!accountId || !privateKey) return;

  setLoading(true);

  try {
    const client = createClient();
    const abiCoder = new AbiCoder();

    const appStructABI = [
      "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)"
    ];

    const results: AppItem[] = [];

    let emptyStreak = 0; // 👈 important fix

    for (let i = 1; i < 500; i++) {
      try {
        const query = new ContractCallQuery()
          .setContractId(ContractId.fromString(contractId))
          .setGas(300000)
          .setFunction(
            "getAppDetails",
            new ContractFunctionParameters().addUint256(i)
          )
          .setMaxQueryPayment(new Hbar(1));

        const response = await query.execute(client);

        const decoded = abiCoder.decode(appStructABI, response.bytes)[0];

        // reset streak when successful call
        emptyStreak = 0;
          console.log("results", results)
        results.push({
          appId: Number(decoded.appId),
          appName: decoded.appName,
          appDescription: decoded.appDescription,
          appImage: decoded.appImage,
          appMetaData: decoded.metadata,
          appStatus: [
            "PendingReview",
            "Published",
            "Unlisted",
            "Unpublished"
          ][Number(decoded.appStatus)],
          appType: [
            "Free",
            "Paid",
            "OpenSource",
            "Beta"
          ][Number(decoded.appType)],
          owner: decoded.owner.toLowerCase(),
        });

      } catch (err) {
        emptyStreak++;

        // 🔥 only stop after multiple consecutive misses
        if (emptyStreak > 5) break;
      }
    }

    setApps(results);

  } catch (err) {
    console.error("Error fetching apps:", err);
    setApps([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchApps();
  }, [accountId, privateKey]);

  return (
    <div className="hederaAppsMarketplace_wrapper">

      <div className="MarketplaceHeader_container">
        <Link to="/">
          <img
            width="35"
            height="35"
            src="https://img.icons8.com/nolan/64/left.png"
            alt="left"
          />
        </Link>
      </div>

      <h1>Welcome to Hedera Apps marketplace - store</h1>

      <h3><strong>still in development</strong></h3>

      <p>
        Apps marketplace for HashCompanion built on Hedera.
      </p>

      {loading ? (
        <p>Loading apps...</p>
      ) : apps.length === 0 ? (
        <p>No apps found.</p>
      ) : (
        <div className="apps-grid">
          {apps.map((app) => (
            <div key={app.appId} className="app-card">
              {app.appImage && <img src={app.appImage} alt={app.appName} />}
              <h3>{app.appName}</h3>
              <p>{app.appDescription}</p>
              <p><strong>Type:</strong> {app.appType}</p>
              <p><strong>Status:</strong> {app.appStatus}</p>
              <p><strong>Owner:</strong> {app.owner}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default HederaAppsMarketplace;