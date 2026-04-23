// // import { useParams } from "react-router-dom";

// // const HashCompanionStoreApp = () => {
// //   const { AppName, AppID } = useParams();


// //   const fetchApps = async () => {
// //       if (!accountId || !privateKey) return;
  
// //       setLoading(true);
  
// //       try {
// //         const client = createClient();
// //         const abiCoder = new AbiCoder();
  
// //         const appStructABI = [
// //           "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)"
// //         ];
  
// //         const results: AppItem[] = [];
// //         let emptyStreak = 0;
  
// //         for (let i = 1; i < 500; i++) {
// //           try {
// //             const query = new ContractCallQuery()
// //               .setContractId(ContractId.fromString(contractId))
// //               .setGas(300000)
// //               .setFunction(
// //                 "getAppDetails",
// //                 new ContractFunctionParameters().addUint256(i)
// //               )
// //               .setMaxQueryPayment(new Hbar(1));
  
// //             const response = await query.execute(client);
  
// //             const decoded = abiCoder.decode(appStructABI, response.bytes)[0];
  
// //             emptyStreak = 0;
// //                   console.log(results);
  
// //             results.push({
// //               appId: Number(decoded.appId),
// //               appName: decoded.appName,
// //               appDescription: decoded.appDescription,
// //               appImage: decoded.appImage,
// //               appMetaData: decoded.metadata,
// //               appStatus: [
// //                 "PendingReview",
// //                 "Published",
// //                 "Unlisted",
// //                 "Unpublished"
// //               ][Number(decoded.appStatus)],
// //               appType: [
// //                 "Free",
// //                 "Paid",
// //                 "OpenSource",
// //                 "Beta"
// //               ][Number(decoded.appType)],
// //               owner: decoded.owner.toLowerCase(),
// //             });
  
// //           } catch {
// //             emptyStreak++;
// //             if (emptyStreak > 5) break;
// //           }
// //         }
  
// //         setApps(results);
  
// //       } catch (err) {
// //         console.error("Error fetching apps:", err);
// //         setApps([]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //       const filteredApps = apps.filter((app) =>
// //     app.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //     app.appDescription.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   return (
// //     <>
// //       <h1>HashCompanion Store App</h1>

// //       <p>App Name: {AppName}</p>
// //       <p>App ID: {AppID}</p>
// //     </>
// //   );
// // };

// // export default HashCompanionStoreApp;


// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// import "../Styles/hashcompanionStore.css"

// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractId,
//   ContractFunctionParameters,
//   Hbar
// } from "@hashgraph/sdk";

// import { AbiCoder } from "ethers";

// interface AppItem {
//   appId: number;
//   appName: string;
//   appDescription: string;
//   appImage: string;
//   appMetaData: string;
//   appType: string;
//   appStatus: string;
//   owner: string;
// }

// interface Props {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
//   network?: "testnet" | "mainnet";
// }

// interface RouteParams {
//   AppName?: string;
//   AppID?: string;
// }

// const HashCompanionStoreApp = ({
//   accountId,
//   privateKey,
//   network = "testnet"
// }: Props) => {
  
//     const { AppName, AppID } = useParams<{
//   AppName?: string;
//   AppID?: string;
// }>();

//   const contractId = "0.0.8454022";

//   const [app, setApp] = useState<AppItem | null>(null);
//   const [loading, setLoading] = useState(true);

//   // -----------------------------
//   // CLIENT
//   // -----------------------------
//   const createClient = () => {
//     const client =
//       network === "mainnet"
//         ? Client.forMainnet()
//         : Client.forTestnet();

//     client.setOperator(
//       AccountId.fromString(accountId!),
//       PrivateKey.fromStringECDSA(privateKey!)
//     );

//     return client;
//   };

//   // -----------------------------
//   // FETCH ALL APPS (same logic as marketplace)
//   // -----------------------------
//   const fetchApp = async () => {
//     if (!accountId || !privateKey) return;

//     setLoading(true);

//     try {
//       const client = createClient();
//       const abiCoder = new AbiCoder();

//       const appStructABI = [
//         "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)"
//       ];

//       const results: AppItem[] = [];
//       let emptyStreak = 0;

//       for (let i = 1; i < 500; i++) {
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
//             appStatus: [
//               "PendingReview",
//               "Published",
//               "Unlisted",
//               "Unpublished"
//             ][Number(decoded.appStatus)],
//             appType: [
//               "Free",
//               "Paid",
//               "OpenSource",
//               "Beta"
//             ][Number(decoded.appType)],
//             owner: decoded.owner.toLowerCase(),
//           });

//           emptyStreak = 0;
//         } catch {
//           emptyStreak++;
//           if (emptyStreak > 5) break;
//         }
//       }

//       // -----------------------------
//       // FILTER ONLY SELECTED APP
//       // -----------------------------
//       const selected = results.find(
//         (a) =>
//           a.appId === Number(AppID) ||
//           a.appName.toLowerCase() === AppName?.toLowerCase()
//       );

//       setApp(selected || null);
//     } catch (err) {
//       console.error("Error fetching app:", err);
//       setApp(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApp();
//   }, [accountId, privateKey, AppID, AppName]);

//   // -----------------------------
//   // UI
//   // -----------------------------
//   if (loading) return <p>Loading app...</p>;

//   if (!app) return <p>App not found.</p>;

//   return (
//     <div className="appDetail_container">

//       {/* BACK NAV */}
//       <Link to="/hederaAppsMarketplace" className="back-btn">
//         ← Back
//       </Link>

//       {/* APP HEADER */}
//       <div className="app-header">

//         {app.appImage && (
//           <img className="app-image" src={app.appImage} alt={app.appName} />
//         )}

//         <div className="app-main-info">
//           <h1>{app.appName}</h1>
//           <p className="app-type">{app.appType}</p>
//           <p className="app-status">{app.appStatus}</p>
//           <button className="add-app-install"></button>
//         </div>
//       </div>

//       {/* DESCRIPTION */}
//       <div className="app-section">
//         <h2>Description</h2>
//         <p>{app.appDescription}</p>
//       </div>

//       {/* METADATA */}
//       <div className="app-section">
//         <h2>Metadata</h2>
//         <p>{app.appMetaData}</p>
//       </div>

//       {/* OWNER */}
//       <div className="app-section">
//         <h2>Owner</h2>
//         <p>{app.owner}</p>
//       </div>

//     </div>
//   );
// };

// export default HashCompanionStoreApp;


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Client,
  AccountId,
  PrivateKey,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractId,
  ContractFunctionParameters,
  Hbar
} from "@hashgraph/sdk";

import { AbiCoder } from "ethers";

interface RouteParams {
  AppName: string;
  AppID: string;
}

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

interface Props {
  accountId: string;
  privateKey: string;
  evmAddress: string;
  network?: "testnet" | "mainnet";
}

const HashCompanionStoreApp = ({
  accountId,
  privateKey,
  evmAddress,
  network = "testnet"
}: Props) => {
  
        const { AppName, AppID } = useParams<{
  AppName?: string;
  AppID?: string;
}>();

  const contractId = "0.0.8454022";

  const [app, setApp] = useState<AppItem | null>(null);
  const [relation, setRelation] = useState<AppLOT | null>(null);
  const [loading, setLoading] = useState(true);

  const createClient = () => {
    const client =
      network === "mainnet"
        ? Client.forMainnet()
        : Client.forTestnet();

    client.setOperator(
      AccountId.fromString(accountId),
      PrivateKey.fromStringECDSA(privateKey)
    );

    return client;
  };

  // -----------------------------
  // FETCH APP
  // -----------------------------
  const fetchApp = async () => {
    if (!accountId || !privateKey) return;

    try {
      const client = createClient();
      const abiCoder = new AbiCoder();

      const appStructABI = [
        "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)"
      ];

      const query = new ContractCallQuery()
        .setContractId(ContractId.fromString(contractId))
        .setGas(300000)
        .setFunction(
          "getAppDetails",
          new ContractFunctionParameters().addUint256(Number(AppID))
        )
        .setMaxQueryPayment(new Hbar(1));

      const response = await query.execute(client);

      const decoded = abiCoder.decode(appStructABI, response.bytes)[0];

      setApp({
        appId: Number(decoded.appId),
        appName: decoded.appName,
        appDescription: decoded.appDescription,
        appImage: decoded.appImage,
        appMetaData: decoded.metadata,
        appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][
          Number(decoded.appStatus)
        ],
        appType: ["Free", "Paid", "OpenSource", "Beta"][
          Number(decoded.appType)
        ],
        owner: decoded.owner.toLowerCase()
      });
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // FETCH USER RELATION
  // -----------------------------
  const fetchRelation = async () => {
    try {
      const client = createClient();
      const abiCoder = new AbiCoder();

      const relationABI = [
        "tuple(uint256 appId,uint8 relationStatus,uint256 installTimestamp,uint256 purchaseTimestamp,uint256 lastUpdated)"
      ];

      const query = new ContractCallQuery()
        .setContractId(ContractId.fromString(contractId))
        .setGas(300000)
        .setFunction(
          "getUserAppRelation",
          new ContractFunctionParameters()
            .addAddress(evmAddress)
            .addUint256(Number(AppID))
        )
        .setMaxQueryPayment(new Hbar(1));

      const response = await query.execute(client);

      const decoded = abiCoder.decode(relationABI, response.bytes)[0];

      // if empty → treat as no relation
      if (!decoded || Number(decoded.appId) === 0) {
        setRelation(null);
        return;
      }

      setRelation({
        appId: Number(decoded.appId),
        relationStatus: Number(decoded.relationStatus),
        installTimestamp: Number(decoded.installTimestamp),
        purchaseTimestamp: Number(decoded.purchaseTimestamp),
        lastUpdated: Number(decoded.lastUpdated)
      });
    } catch (err) {
      console.log("No relation found");
      setRelation(null);
    }
  };

  // -----------------------------
  // INSTALL / UPDATE RELATION
  // -----------------------------
  const handleInstall = async () => {
    try {
      const client = createClient();

      const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(300000)
        .setFunction(
          "updateAppRelation",
          new ContractFunctionParameters()
            .addUint256(Number(AppID))
            .addUint8(1) // Installed
        )
        .setMaxTransactionFee(new Hbar(2));

      await tx.execute(client);

      await fetchRelation();
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // INIT
  // -----------------------------
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchApp();
      await fetchRelation();
      setLoading(false);
    };

    init();
  }, [AppID]);

  if (loading) return <p>Loading app...</p>;

  if (!app) return <p>App not found</p>;

  return (
    <div className="appPage">

      {/* APP HEADER */}
      <div className="appHeader">
        <img src={app.appImage} alt={app.appName} />
        <div>
          <h1>{app.appName}</h1>
          <p>{app.appDescription}</p>

          <span className="badge">{app.appType}</span>
          <span className="badge">{app.appStatus}</span>
        </div>
      </div>

      {/* RELATION SECTION */}
      <div className="relationBox">

        {relation ? (
          <>
            <p>
              Status:{" "}
              <strong>
                {["Owner", "Bookmarked", "Installed", "Purchased", "Uninstalled", "Pending"][
                  relation.relationStatus
                ]}
              </strong>
            </p>

            {relation.relationStatus === 2 && (
              <button className="btn-primary">Open App</button>
            )}
          </>
        ) : (
          <div>
            <p>No relation found</p>
            <button className="btn-primary" onClick={handleInstall}>
              Install App
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default HashCompanionStoreApp;