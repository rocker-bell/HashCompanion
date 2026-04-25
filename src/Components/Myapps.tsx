import { useEffect, useState } from "react";
import "../Styles/hashcompanionStore.css";
import {Link} from 'react-router-dom';

import {
  Client,
  AccountId,
  PrivateKey,
  ContractCallQuery,
  ContractId,
  ContractFunctionParameters,
  Hbar,
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

interface AppLOT {
  appId: number;
  relationStatus: number;
  installTimestamp: number;
  purchaseTimestamp: number;
  lastUpdated: number;
}

interface MyappsProps {
  accountId: string;
  privateKey: string;
  evmAddress: string;
  network?: "testnet" | "mainnet";
  accounts: { accountId: string; privateKey: string; evmAddress?: string }[];
   activeAccount: number | null;
  connectAccount: (acc?: { accountId: string; privateKey: string }) => Promise<void>;
}

const relationLabels = [
  "Owner",
  "Bookmarked",
  "Installed",
  "Purchased",
  "Uninstalled",
  "Pending",
];

const Myapps = ({ accountId, privateKey, evmAddress, network = "testnet", accounts, activeAccount,
  connectAccount }: MyappsProps) => {
  const contractId = "0.0.8454022";
  const [apps, setApps] = useState<(AppItem & { relation: AppLOT | null })[]>([]);
  const [loading, setLoading] = useState(true);

  const createClient = () => {
    const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
    return client;
  };


//   const fetchApps = async () => {
//   const client = createClient(); // use props directly
//   const abiCoder = new AbiCoder();

//   try {
//     // Fetch all published apps
//     const publishedQuery = new ContractCallQuery()
//       .setContractId(ContractId.fromString(contractId))
//       .setGas(500_000)
//       .setFunction("getPublishedApps")
//       .setMaxQueryPayment(new Hbar(1));

//     const publishedResponse = await publishedQuery.execute(client);

//     const decodedApps: any[] = abiCoder.decode(
//       ["tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)[]"],
//       publishedResponse.bytes
//     )[0];

//     console.log("decodedApps", decodedApps); 

//     const allApps: (AppItem & { relation: AppLOT | null })[] = [];

    

//     for (const decodedApp of decodedApps) {
//       const app: AppItem = {
//         appId: Number(decodedApp.appId),
//         appName: decodedApp.appName,
//         appDescription: decodedApp.appDescription,
//         appImage: decodedApp.appImage,
//         appMetaData: decodedApp.metadata,
//         appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][Number(decodedApp.appStatus)],
//         appType: ["Free", "Paid", "OpenSource", "Beta"][Number(decodedApp.appType)],
//         owner: decodedApp.owner.toLowerCase()
//       };

      
      


//       // Fetch relation for this app
//       const relationQuery = new ContractCallQuery()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(300_000)
//         .setFunction(
//           "getUserAppRelation",
//           new ContractFunctionParameters()
//             .addAddress(evmAddress) // use evmAddress prop directly
//             .addUint256(Number(app.appId))
//         )
//         .setMaxQueryPayment(new Hbar(1));

//       let relation: AppLOT | null = null;
//       try {
//         const relationResponse = await relationQuery.execute(client);
//         const decodedRelation = abiCoder.decode(
//           ["tuple(uint256 appId,uint8 relationStatus,uint256 installTimestamp,uint256 purchaseTimestamp,uint256 lastUpdated)"],
//           relationResponse.bytes
//         )[0];

//         if (decodedRelation && Number(decodedRelation.appId) !== 0) {
//           relation = {
//             appId: Number(decodedRelation.appId),
//             relationStatus: Number(decodedRelation.relationStatus),
//             installTimestamp: Number(decodedRelation.installTimestamp),
//             purchaseTimestamp: Number(decodedRelation.purchaseTimestamp),
//             lastUpdated: Number(decodedRelation.lastUpdated)
//           };
//         }
//       } catch {
//         console.warn("No relation for appId", app.appId);
//       }

//       // Only keep apps with a relation
//       if (relation) allApps.push({ ...app, relation });
//     }

//     setApps(allApps);
//   } catch (err) {
//     console.error("Error fetching apps:", err);
//   } finally {
//     setLoading(false);
//   }
// };

    const fetchApps = async () => {
  const client = createClient();
  const abiCoder = new AbiCoder();

  try {
    // Fetch all published apps
    const publishedQuery = new ContractCallQuery()
      .setContractId(ContractId.fromString(contractId))
      .setGas(500_000)
      .setFunction("getPublishedApps")
      .setMaxQueryPayment(new Hbar(1));

    const publishedResponse = await publishedQuery.execute(client);

    const decodedApps: any[] = abiCoder.decode(
      [
        "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)[]"
      ],
      publishedResponse.bytes
    )[0];

    console.log("decodedApps", decodedApps);

    const allApps: (AppItem & { relation: AppLOT | null })[] = [];

    for (const decodedApp of decodedApps) {
      const app: AppItem = {
        appId: Number(decodedApp.appId),
        appName: decodedApp.appName,
        appDescription: decodedApp.appDescription,
        appImage: decodedApp.appImage,
        appMetaData: decodedApp.metadata,
        appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][Number(decodedApp.appStatus)],
        appType: ["Free", "Paid", "OpenSource", "Beta"][Number(decodedApp.appType)],
        owner: decodedApp.owner.toLowerCase()
      };

      // Fetch relation for this app
      const relationQuery = new ContractCallQuery()
        .setContractId(ContractId.fromString(contractId))
        .setGas(300_000)
        .setFunction(
          "getUserAppRelation",
          new ContractFunctionParameters()
            .addAddress(evmAddress.startsWith("0x") ? evmAddress : `0x${evmAddress}`)
            .addUint256(app.appId)
        )
        .setMaxQueryPayment(new Hbar(1));

      let relation: AppLOT | null = null;
      try {
        const relationResponse = await relationQuery.execute(client);
        const decodedRelation = abiCoder.decode(
          ["tuple(uint256 appId,uint8 relationStatus,uint256 installTimestamp,uint256 purchaseTimestamp,uint256 lastUpdated)"],
          relationResponse.bytes
        )[0];

        // ✅ Proper empty struct detection
        const isEmpty =
          !decodedRelation ||
          (Number(decodedRelation.appId) === 0 && Number(decodedRelation.lastUpdated) === 0);

        if (!isEmpty) {
          relation = {
            appId: Number(decodedRelation.appId),
            relationStatus: Number(decodedRelation.relationStatus),
            installTimestamp: Number(decodedRelation.installTimestamp),
            purchaseTimestamp: Number(decodedRelation.purchaseTimestamp),
            lastUpdated: Number(decodedRelation.lastUpdated)
          };

          // Filter by relevant relation statuses if you want (e.g., only Installed, Purchased, Owner)
          const validStatuses = [0, 1, 2, 3]; // Owner, Bookmarked, Installed, Purchased
          if (!validStatuses.includes(relation.relationStatus)) {
            relation = null;
          }
        } else {
          console.log(`No relation exists for appId ${app.appId}`);
        }
      } catch (err) {
        console.warn(`Error fetching relation for appId ${app.appId}`, err);
      }

      // Only keep apps with a valid relation
      if (relation) allApps.push({ ...app, relation });
    }

    console.log("Filtered apps with relation:", allApps);
    setApps(allApps);
  } catch (err) {
    console.error("Error fetching apps:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchApps();
  }, [accountId, privateKey, evmAddress, network]);

  if (loading) return <p>Loading apps...</p>;
  if (apps.length === 0) return (
    <>
    <Link
        to="/ConnectWallet"
        onClick={() => activeAccount !== null && connectAccount(accounts[activeAccount])}
      >
        <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
      </Link>
  <p>No apps found with your relation.</p>
  </>
);

  return (
    <div className="Myapps_wrapper">
      <h2>My Apps</h2>
       <Link
        to="/ConnectWallet"
        onClick={() => activeAccount !== null && connectAccount(accounts[activeAccount])}
      >
        <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
      </Link>
      <div className="apps-grid">
        {apps.map(({ appId, appName, appDescription, appImage, appType, appStatus, relation }) => (
          <div key={appId} className="app-card">
            <img src={appImage} alt={appName} className="app-card-img" />
            <h3>{appName}</h3>
            <p>{appDescription}</p>
            <div className="app-badges">
              <span className="badge">{appType}</span>
              <span className="badge">{appStatus}</span>
              {relation && <span className="badge">{relationLabels[relation.relationStatus]}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myapps;