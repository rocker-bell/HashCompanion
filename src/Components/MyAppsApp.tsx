// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractId,
//   ContractFunctionParameters,
//   Hbar,
// } from "@hashgraph/sdk";
// import { AbiCoder } from "ethers";
// import {getAccessToken} from "../utils/dropbox.ts"

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

// interface AppLOT {
//   appId: number;
//   relationStatus: number;
//   installTimestamp: number;
//   purchaseTimestamp: number;
//   lastUpdated: number;
// }

// interface MyAppsAppProps {
//   accountId: string;
//   privateKey: string;
//   evmAddress: string;
//   network?: "testnet" | "mainnet";
//    accounts: { accountId: string; privateKey: string; evmAddress?: string }[];
//    activeAccount: number | null;
//   connectAccount: (acc?: { accountId: string; privateKey: string }) => Promise<void>;
// }

// const relationLabels = [
//   "Owner",
//   "Bookmarked",
//   "Installed",
//   "Purchased",
//   "Uninstalled",
//   "Pending",
// ];

// const MyAppsApp = ({
//   accountId,
//   privateKey,
//   evmAddress,
//   network = "testnet",
//     accounts, 
//   activeAccount,
//   connectAccount 
// }: MyAppsAppProps) => {
//   const { AppName, AppID } = useParams<{
//     AppName: string;
//     AppID: string;
//   }>();

//   const contractId = "0.0.8454022";

//   const [app, setApp] = useState<(AppItem & { relation: AppLOT | null }) | null>(null);
//   const [loading, setLoading] = useState(true);

//   const createClient = () => {
//     const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
//     client.setOperator(
//       AccountId.fromString(accountId),
//       PrivateKey.fromStringECDSA(privateKey)
//     );
//     return client;
//   };


//   const [matchedFiles, setMatchedFiles] = useState<string[]>([]);
// const [missingFiles, setMissingFiles] = useState<string[]>([]);

// // const fetchDropboxFiles = async (path: string = "") => {
// //   try {
// //     const accessToken = await getAccessToken();

// //     const response = await fetch(
// //       "https://api.dropboxapi.com/2/files/list_folder",
// //       {
// //         method: "POST",
// //         headers: {
// //           Authorization: `Bearer ${accessToken}`,
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ path }),
// //       }
// //     );

// //     const data = await response.json();

// //     console.log('fetchedfiles', data)

// //     if (!response.ok) {
// //       throw new Error(data.error_summary || "Fetch failed");
// //     }

// //     return data.entries;
// //   } catch (error) {
// //     console.error("Dropbox Fetch Error:", error);
// //     throw error;
// //   }
// // };


// // const compareWithDropbox = async (appMetaData: string) => {
// //   try {
// //     const entries = await fetchDropboxFiles("");

// //     const dropboxFiles = entries.filter((e: any) => e[".tag"] === "file");

// //     const dropboxFileNames = dropboxFiles.map((f: any) => f.name);

// //     const parsedMeta = JSON.parse(appMetaData);

// //     const appFileNames = parsedMeta.map((f: any) => f.file_name);

// //     const matched = appFileNames.filter((name: string) =>
// //       dropboxFileNames.includes(name)
// //     );

// //     const missing = appFileNames.filter(
// //       (name: string) => !dropboxFileNames.includes(name)
// //     );

// //     setMatchedFiles(matched);
// //     setMissingFiles(missing);
// //   } catch (err) {
// //     console.error("Dropbox compare error:", err);
// //   }
// // };

// const fetchDropboxFiles = async (path: string = "/apps_files") => {
//   try {
//     const accessToken = await getAccessToken();

//     const response = await fetch(
//       "https://api.dropboxapi.com/2/files/list_folder",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           path: path,
//         }),
//       }
//     );

//     const data = await response.json();
//     console.log("data", data)

//     if (!response.ok) {
//       throw new Error(data.error_summary || "Fetch failed");
//     }

//     return data;
//   } catch (error) {
//     console.error("Dropbox Fetch Error:", error);
//     throw error;
//   }
// };

// // const compareWithDropbox = async (appMetaData: string) => {
// //   try {
// //     const entries = await fetchDropboxFiles("");

// //     const dropboxFiles = entries.filter((e: any) => e[".tag"] === "file");
// //     const dropboxFileNames = dropboxFiles.map((f: any) => f.name);

// //     // 🔍 SAFE PARSE
// //     let parsedMetaRaw;
// //     try {
// //       parsedMetaRaw = JSON.parse(appMetaData);
// //     } catch (e) {
// //       console.error("Invalid JSON metadata:", appMetaData);
// //       return;
// //     }

// //     // 🔁 NORMALIZE TO ARRAY
// //     let parsedMeta: any[] = [];

// //     if (Array.isArray(parsedMetaRaw)) {
// //       parsedMeta = parsedMetaRaw;
// //     } else if (parsedMetaRaw?.files && Array.isArray(parsedMetaRaw.files)) {
// //       parsedMeta = parsedMetaRaw.files;
// //     } else if (typeof parsedMetaRaw === "object") {
// //       parsedMeta = [parsedMetaRaw];
// //     } else {
// //       console.warn("Unsupported metadata format:", parsedMetaRaw);
// //       return;
// //     }

// //     console.log("RAW appMetaData:", appMetaData);
// // console.log("PARSED:", parsedMetaRaw);

// //     // 🧠 EXTRA SAFETY: filter valid entries only
// //     const appFileNames = parsedMeta
// //       .filter((f: any) => f && f.file_name)
// //       .map((f: any) => f.file_name);

// // //    const matched = appFileNames.filter((name: string) =>
// // //   dropboxFileNames.some((dbName: string) =>
// // //     dbName.endsWith(name)
// // //   )
// // // );

// // const matched = appFileNames.filter((name: string) => {
// //   const appFile = parsedMeta.find((f: any) => f.file_name === name);
// //   if (!appFile) return false;

// //   return dropboxFiles.some((db: any) => {
// //     const dbNameMatch = db.name.endsWith(name);

// //     // 🔐 strict metadata match
// //     const sizeMatch = db.size === appFile.file_size;

// //     return dbNameMatch && sizeMatch;
// //   });
// // });

// // // const missing = appFileNames.filter(
// // //   (name: string) =>
// // //     !dropboxFileNames.some((dbName: string) =>
// // //       dbName.endsWith(name)
// // //     )
// // // );

// // const missing = appFileNames.filter((name: string) => {
// //   const appFile = parsedMeta.find((f: any) => f.file_name === name);
// //   if (!appFile) return true;

// //   return !dropboxFiles.some((db: any) => {
// //     const dbNameMatch = db.name.endsWith(name);
// //     const sizeMatch = db.size === appFile.file_size;

// //     return dbNameMatch && sizeMatch;
// //   });
// // });
// //     setMatchedFiles(matched);
// //     setMissingFiles(missing);

// //   } catch (err) {
// //     console.error("Dropbox compare error:", err);
// //   }
// // };

// const compareWithDropbox = async (appMetaData: string) => {
//   try {
//     const data = await fetchDropboxFiles("/apps_files");

//     const dropboxFiles = data.entries.filter(
//       (e: any) => e[".tag"] === "file"
//     );

//     const dropboxFileNames = dropboxFiles.map((f: any) => f.name);

//     const parsedMeta = JSON.parse(appMetaData);

//     const appFileNames = [parsedMeta.file_name];

//     const matched = appFileNames.filter((name: string) =>
//       dropboxFileNames.some((dbName: string) =>
//         dbName.endsWith(name)
//       )
//     );

//     const missing = appFileNames.filter(
//       (name: string) =>
//         !dropboxFileNames.some((dbName: string) =>
//           dbName.endsWith(name)
//         )
//     );

//     setMatchedFiles(matched);
//     console.log("matchedFiles", matched)
//     setMissingFiles(missing);

//   } catch (err) {
//     console.error("Dropbox compare error:", err);
//   }
// };

// const [appSource, setAppSource] = useState<string>("");
// const getDropboxFileContent = async (filePath: string) => {
//   const accessToken = await getAccessToken();

//   const response = await fetch(
//     "https://content.dropboxapi.com/2/files/download",
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Dropbox-API-Arg": JSON.stringify({
//           path: `/apps_files/${filePath}`,
//         }),
//       },
//     }
//   );

//   const text = await response.text();
//   return text;
// };

// useEffect(() => {
//   if (matchedFiles.length > 0) {
//     const load = async () => {
//       const source = await getDropboxFileContent(matchedFiles[0]);
//       setAppSource(source);
//     };

//     load();
//   }
// }, [matchedFiles]);


// const [RuntimeComponent, setRuntimeComponent] = useState<any>(null);

// useEffect(() => {
//   if (!appSource) return;

//   try {
//     const wrapped = `
//       const React = arguments[0];

//       ${appSource}

//       return App || default || module.exports?.default;
//     `;

//     const Comp = new Function("React", wrapped)(React);

//     setRuntimeComponent(() => Comp);
//   } catch (err) {
//     console.error("Failed to mount app source:", err);
//   }
// }, [appSource]);


//   const fetchApp = async () => {
//     const client = createClient();
//     const abiCoder = new AbiCoder();

//     try {
//       const publishedQuery = new ContractCallQuery()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(800_000)
//         .setFunction("getPublishedApps")
//         .setMaxQueryPayment(new Hbar(1));

//       const publishedResponse = await publishedQuery.execute(client);

//       const decodedApps: any[] = abiCoder.decode(
//         [
//           "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)[]"
//         ],
//         publishedResponse.bytes
//       )[0];

//       for (const decodedApp of decodedApps) {
//         // 🔥 FILTER EARLY
//         if (
//           Number(decodedApp.appId) !== Number(AppID) ||
//           decodedApp.appName !== decodeURIComponent(AppName!)
//         ) {
//           continue;
//         }

//         const appData: AppItem = {
//           appId: Number(decodedApp.appId),
//           appName: decodedApp.appName,
//           appDescription: decodedApp.appDescription,
//           appImage: decodedApp.appImage,
//           appMetaData: decodedApp.metadata,
//           appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][Number(decodedApp.appStatus)],
//           appType: ["Free", "Paid", "OpenSource", "Beta"][Number(decodedApp.appType)],
//           owner: decodedApp.owner.toLowerCase(),
//         };

//         const relationQuery = new ContractCallQuery()
//           .setContractId(ContractId.fromString(contractId))
//           .setGas(300_000)
//           .setFunction(
//             "getUserAppRelation",
//             new ContractFunctionParameters()
//               .addAddress(
//                 evmAddress.startsWith("0x") ? evmAddress : `0x${evmAddress}`
//               )
//               .addUint256(appData.appId)
//           )
//           .setMaxQueryPayment(new Hbar(1));

//         let relation: AppLOT | null = null;

//         try {
//           const relationResponse = await relationQuery.execute(client);

//           const decodedRelation = abiCoder.decode(
//             ["tuple(uint256 appId,uint8 relationStatus,uint256 installTimestamp,uint256 purchaseTimestamp,uint256 lastUpdated)"],
//             relationResponse.bytes
//           )[0];

//           const isEmpty =
//             !decodedRelation ||
//             (Number(decodedRelation.appId) === 0 &&
//               Number(decodedRelation.lastUpdated) === 0);

//           if (!isEmpty) {
//             relation = {
//               appId: Number(decodedRelation.appId),
//               relationStatus: Number(decodedRelation.relationStatus),
//               installTimestamp: Number(decodedRelation.installTimestamp),
//               purchaseTimestamp: Number(decodedRelation.purchaseTimestamp),
//               lastUpdated: Number(decodedRelation.lastUpdated),
//             };

//             if (![0, 1, 2, 3].includes(relation.relationStatus)) {
//               relation = null;
//             }
//           }
//         } catch (err) {
//           console.warn("Relation fetch failed", err);
//         }

//         setApp({ ...appData, relation });
//         break; // ✅ stop loop once found
//       }
//     } catch (err) {
//       console.error("Error fetching app:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (AppID && AppName) {
//       fetchApp();
//     }
//   }, [AppID, AppName]);

//   useEffect(() => {
//   if (app?.appMetaData) {
//     compareWithDropbox(app.appMetaData);
//   }
// }, [app]);

//   if (loading) return <p>Loading app...</p>;

//   if (!app) {
//     return (
//       <>
//         <Link to="/Myapps">⬅ Back</Link>
//         <p>App not found.</p>
//       </>
//     );
//   }

//   return (
//     <div className="MyAppsApp_wrapper">
//        <Link
//           to="/Myapps"
//           onClick={() => activeAccount !== null && connectAccount(accounts[activeAccount])}
//         >
//           <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
//         </Link>

//       <img src={app.appImage} alt={app.appName} width={200} />
//       <h2>{app.appName}</h2>
//       {/* <p>{app.appMetaData}</p> */}

//       <p><strong>Type:</strong> {app.appType}</p>
//       <p><strong>Status:</strong> {app.appStatus}</p>

//       {app.relation && (
//         <p>
//           <strong>Relation:</strong>{" "}
//           {relationLabels[app.relation.relationStatus]}
//         </p>
//       )}

//       <div>
//   {/* <h3>📁 Dropbox Sync Status</h3>

//   <p><strong>Matched Files:</strong></p>
//   {matchedFiles.length > 0 ? (
//     <ul>
//       {matchedFiles.map((file, i) => (
//         <li key={i}>✅ {file}</li>
//       ))}
//     </ul>
//   ) : (
//     <p>No matches</p>
//   )}

//   <p><strong>Missing Files:</strong></p>
//   {missingFiles.length > 0 ? (
//     <ul>
//       {missingFiles.map((file, i) => (
//         <li key={i}>❌ {file}</li>
//       ))}
//     </ul>
//   ) : (
//     <p>All files present</p>
//   )} */}

//   <div style={{ marginTop: "40px", borderTop: "1px solid #333", paddingTop: "20px" }}>
//   <h3>🚀 Live App Runtime</h3>

//   {RuntimeComponent ? (
//     <RuntimeComponent />
//   ) : (
//     <p>Loading app source from Dropbox...</p>
//   )}
// </div>
// </div>
//     </div>
//   );
// };

// export default MyAppsApp;

// import React from "react";
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractId,
//   ContractFunctionParameters,
//   Hbar,
// } from "@hashgraph/sdk";
// import { AbiCoder } from "ethers";
// import { getAccessToken } from "../utils/dropbox.ts";

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

// interface AppLOT {
//   appId: number;
//   relationStatus: number;
//   installTimestamp: number;
//   purchaseTimestamp: number;
//   lastUpdated: number;
// }

// interface MyAppsAppProps {
//   accountId: string;
//   privateKey: string;
//   evmAddress: string;
//   network?: "testnet" | "mainnet";
//   accounts: { accountId: string; privateKey: string; evmAddress?: string }[];
//   activeAccount: number | null;
//   connectAccount: (acc?: { accountId: string; privateKey: string }) => Promise<void>;
// }

// const relationLabels = [
//   "Owner",
//   "Bookmarked",
//   "Installed",
//   "Purchased",
//   "Uninstalled",
//   "Pending",
// ];

// const MyAppsApp = ({
//   accountId,
//   privateKey,
//   evmAddress,
//   network = "testnet",
//   accounts,
//   activeAccount,
//   connectAccount,
// }: MyAppsAppProps) => {
//   const { AppName, AppID } = useParams<{ AppName: string; AppID: string }>();

//   const contractId = "0.0.8454022";

//   const [app, setApp] = useState<(AppItem & { relation: AppLOT | null }) | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [matchedFiles, setMatchedFiles] = useState<any[]>([]);
//   const [appSource, setAppSource] = useState<string>("");
//   const [RuntimeComponent, setRuntimeComponent] = useState<any>(null);

//   const createClient = () => {
//     const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
//     client.setOperator(
//       AccountId.fromString(accountId),
//       PrivateKey.fromStringECDSA(privateKey)
//     );
//     return client;
//   };

//   // ---------------- DROPBOX ----------------

//   const fetchDropboxFiles = async (path: string = "/apps_files") => {
//     const accessToken = await getAccessToken();

//     const response = await fetch(
//       "https://api.dropboxapi.com/2/files/list_folder",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ path }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error_summary || "Fetch failed");
//     }

//     return data.entries || [];
//   };

//   // 🔥 FIXED MATCHING (random_number_filename safe)
//   const compareWithDropbox = async (appMetaData: string) => {
//     try {
//       const entries = await fetchDropboxFiles("/apps_files");

//       const dropboxFiles = entries.filter((e: any) => e[".tag"] === "file");

//       const parsedMeta = JSON.parse(appMetaData);

//       const fileName = parsedMeta.file_name;

//       const matched = dropboxFiles.filter((db: any) => {
//         const cleanName = db.name.replace(/^\d+-/, "");
//         return cleanName === fileName;
//       });

//       setMatchedFiles(matched);

//       if (matched.length > 0) {
//         const content = await getDropboxFileContent(matched[0].path_display);
//         setAppSource(content);
//       }
//     } catch (err) {
//       console.error("Dropbox compare error:", err);
//     }
//   };

//   // ---------------- DOWNLOAD FIX ----------------

//   const getDropboxFileContent = async (filePath: string) => {
//     const accessToken = await getAccessToken();

//     const response = await fetch(
//       "https://content.dropboxapi.com/2/files/download",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Dropbox-API-Arg": JSON.stringify({
//             path: filePath, // ✅ MUST be path_display
//           }),
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Dropbox download failed");
//     }

//     return await response.text();
//   };

//   // ---------------- RUNTIME FIX ----------------

//   useEffect(() => {
//     if (!appSource) return;

//     try {
//       const wrapped = `
//         const React = arguments[0];

//         ${appSource}

//         return App || default || module.exports?.default;
//       `;

//       const Component = new Function("React", wrapped)(React);

//       setRuntimeComponent(() => Component);
//     } catch (err) {
//       console.error("Failed to mount app source:", err);
//     }
//   }, [appSource]);

//   // ---------------- HEDERA FETCH ----------------

//   const fetchApp = async () => {
//     const client = createClient();
//     const abiCoder = new AbiCoder();

//     try {
//       const query = new ContractCallQuery()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(800_000)
//         .setFunction("getPublishedApps")
//         .setMaxQueryPayment(new Hbar(1));

//       const res = await query.execute(client);

//       const apps = abiCoder.decode(
//         [
//           "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)[]",
//         ],
//         res.bytes
//       )[0];

//       for (const a of apps) {
//         if (
//           Number(a.appId) !== Number(AppID) ||
//           a.appName !== decodeURIComponent(AppName!)
//         ) continue;

//         const appData: AppItem = {
//           appId: Number(a.appId),
//           appName: a.appName,
//           appDescription: a.appDescription,
//           appImage: a.appImage,
//           appMetaData: a.metadata,
//           appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][Number(a.appStatus)],
//           appType: ["Free", "Paid", "OpenSource", "Beta"][Number(a.appType)],
//           owner: a.owner.toLowerCase(),
//         };

//         setApp({ ...appData, relation: null });
//         break;
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- EFFECTS ----------------

//   useEffect(() => {
//     if (AppID && AppName) fetchApp();
//   }, [AppID, AppName]);

//   useEffect(() => {
//     if (app?.appMetaData) {
//       compareWithDropbox(app.appMetaData);
//     }
//   }, [app]);

//   if (loading) return <p>Loading app...</p>;

//   if (!app) return <p>App not found</p>;

//   return (
//     <div className="MyAppsApp_wrapper">
//       <Link to="/Myapps">⬅ Back</Link>

//       <img src={app.appImage} width={200} />
//       <h2>{app.appName}</h2>

//       <p><strong>Type:</strong> {app.appType}</p>
//       <p><strong>Status:</strong> {app.appStatus}</p>

//       {/* 🚀 LIVE RUNTIME */}
//       <div style={{ marginTop: 30 }}>
//         <h3>🚀 Live App Runtime</h3>

//         {RuntimeComponent ? (
//           <RuntimeComponent />
//         ) : (
//           <p>Loading code from Dropbox...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyAppsApp;


// import React from "react";
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractId,
//   ContractFunctionParameters,
//   Hbar,
// } from "@hashgraph/sdk";
// import { AbiCoder } from "ethers";
// import { getAccessToken } from "../utils/dropbox.ts";

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

// interface AppLOT {
//   appId: number;
//   relationStatus: number;
//   installTimestamp: number;
//   purchaseTimestamp: number;
//   lastUpdated: number;
// }

// interface MyAppsAppProps {
//   accountId: string;
//   privateKey: string;
//   evmAddress: string;
//   network?: "testnet" | "mainnet";
//   accounts: { accountId: string; privateKey: string; evmAddress?: string }[];
//   activeAccount: number | null;
//   connectAccount: (acc?: { accountId: string; privateKey: string }) => Promise<void>;
// }

// const relationLabels = [
//   "Owner",
//   "Bookmarked",
//   "Installed",
//   "Purchased",
//   "Uninstalled",
//   "Pending",
// ];

// const MyAppsApp = ({
//   accountId,
//   privateKey,
//   evmAddress,
//   network = "testnet",
//   accounts,
//   activeAccount,
//   connectAccount,
// }: MyAppsAppProps) => {
//   const { AppName, AppID } = useParams<{ AppName: string; AppID: string }>();

//   const contractId = "0.0.8454022";

//   const [app, setApp] =
//     useState<(AppItem & { relation: AppLOT | null }) | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [matchedFiles, setMatchedFiles] = useState<any[]>([]);
//   const [appSource, setAppSource] = useState<string>("");
//   const [RuntimeComponent, setRuntimeComponent] = useState<any>(null);

//   const createClient = () => {
//     const client =
//       network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
//     client.setOperator(
//       AccountId.fromString(accountId),
//       PrivateKey.fromStringECDSA(privateKey)
//     );
//     return client;
//   };

//   // ---------------- DROPBOX ----------------

//   const fetchDropboxFiles = async (path: string = "/apps_files") => {
//     const accessToken = await getAccessToken();

//     const response = await fetch(
//       "https://api.dropboxapi.com/2/files/list_folder",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ path }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error_summary || "Fetch failed");
//     }

//     return data.entries || [];
//   };

//   // ---------------- FIX: normalize filename ----------------

//   const normalizeName = (name: string) =>
//     name.replace(/^\d+[_-]/, "");

//   // ---------------- FIXED MATCHING ----------------

//   const compareWithDropbox = async (appMetaData: string) => {
//     try {
//       const entries = await fetchDropboxFiles("/apps_files");

//       const files = entries.filter((e: any) => e[".tag"] === "file");

//       const parsed = JSON.parse(appMetaData);
//       const targetName = parsed.file_name;

//       const matched = files.find((f: any) => {
//         return normalizeName(f.name) === targetName;
//       });

//       if (!matched) {
//         console.warn("No matching file found");
//         return;
//       }

//       setMatchedFiles([matched]);

//       const content = await getDropboxFileContent(matched.path_display);
//       setAppSource(content);
//     } catch (err) {
//       console.error("Dropbox compare error:", err);
//     }
//   };

//   // ---------------- DROPBOX DOWNLOAD ----------------

//   const getDropboxFileContent = async (filePath: string) => {
//     const accessToken = await getAccessToken();

//     const response = await fetch(
//       "https://content.dropboxapi.com/2/files/download",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Dropbox-API-Arg": JSON.stringify({
//             path: filePath,
//           }),
//         },
//       }
//     );

//     if (!response.ok) {
//       const err = await response.text();
//       throw new Error(err);
//     }

//     return await response.text();
//   };

//   // ---------------- FIXED RUNTIME ENGINE ----------------

// //   const transformSource = (source: string) => {
// //     return source
// //       .replace(/import[\s\S]*?from\s+["'][^"']+["'];?/g, "")
// //       .replace(/export default/g, "")
// //       .replace(/export\s+(function|const|class)/g, "$1");
// //   };

// //   useEffect(() => {
// //     if (!appSource) return;

// //     try {
// //       const cleaned = transformSource(appSource);

// //       const wrapped = `
// //         const React = arguments[0];

// //         let exports = {};

// //         try {
// //           ${cleaned}
// //         } catch (e) {
// //           console.error("Runtime error:", e);
// //         }

// //         return (
// //           exports.default ||
// //           (typeof App !== "undefined" && App) ||
// //           (typeof default !== "undefined" && default) ||
// //           null
// //         );
// //       `;

// //       const Component = new Function("React", wrapped)(React);

// //       if (!Component) {
// //         throw new Error("No component returned from Dropbox file");
// //       }

// //       setRuntimeComponent(() => Component);
// //     } catch (err) {
// //       console.error("Failed to mount app source:", err);
// //       setRuntimeComponent(null);
// //     }
// //   }, [appSource]);

// const transformSource = (source: string) => {
//   // remove all import statements
//   return source
//     .replace(/import[\s\S]*?from\s+["'][^"']+["'];?/g, "")
//     .replace(/export default/g, "")
//     .replace(/export\s+(function|const|class)/g, "$1");
// };

// useEffect(() => {
//   if (!appSource) return;

//   try {
//     const cleaned = transformSource(appSource);

//     // create a new function that receives React as a parameter
//     const wrapperFn = new Function("React", `
//       ${cleaned}

//       return (typeof App !== "undefined" && App) || null;
//     `);

//     const Component = wrapperFn(React);

//     if (!Component) {
//       throw new Error("No component returned from Dropbox file");
//     }

//     setRuntimeComponent(() => Component);
//   } catch (err) {
//     console.error("Failed to mount app source:", err);
//     setRuntimeComponent(null);
//   }
// }, [appSource]);

//   // ---------------- HEDERA FETCH ----------------

//   const fetchApp = async () => {
//     const client = createClient();
//     const abiCoder = new AbiCoder();

//     try {
//       const query = new ContractCallQuery()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(800_000)
//         .setFunction("getPublishedApps")
//         .setMaxQueryPayment(new Hbar(1));

//       const res = await query.execute(client);

//       const apps = abiCoder.decode(
//         [
//           "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)[]",
//         ],
//         res.bytes
//       )[0];

//       for (const a of apps) {
//         if (
//           Number(a.appId) !== Number(AppID) ||
//           a.appName !== decodeURIComponent(AppName!)
//         )
//           continue;

//         const appData: AppItem = {
//           appId: Number(a.appId),
//           appName: a.appName,
//           appDescription: a.appDescription,
//           appImage: a.appImage,
//           appMetaData: a.metadata,
//           appStatus: [
//             "PendingReview",
//             "Published",
//             "Unlisted",
//             "Unpublished",
//           ][Number(a.appStatus)],
//           appType: ["Free", "Paid", "OpenSource", "Beta"][
//             Number(a.appType)
//           ],
//           owner: a.owner.toLowerCase(),
//         };

//         setApp({ ...appData, relation: null });
//         break;
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- EFFECTS ----------------

//   useEffect(() => {
//     if (AppID && AppName) fetchApp();
//   }, [AppID, AppName]);

//   useEffect(() => {
//     if (app?.appMetaData) {
//       compareWithDropbox(app.appMetaData);
//     }
//   }, [app]);

//   // ---------------- UI ----------------

//   if (loading) return <p>Loading app...</p>;
//   if (!app) return <p>App not found</p>;

//   return (
//     <div className="MyAppsApp_wrapper">
//       <Link to="/Myapps">⬅ Back</Link>

//       <img src={app.appImage} width={200} />
//       <h2>{app.appName}</h2>

//       <p>
//         <strong>Type:</strong> {app.appType}
//       </p>
//       <p>
//         <strong>Status:</strong> {app.appStatus}
//       </p>

//       {/* 🚀 LIVE APP RUNTIME */}
//       <div style={{ marginTop: 30 }}>
//         <h3>🚀 Live App Runtime</h3>

//         {RuntimeComponent ? (
//           <RuntimeComponent />
//         ) : (
//           <p>Loading code from Dropbox...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyAppsApp;


import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { getAccessToken } from "../utils/dropbox.ts";

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

interface MyAppsAppProps {
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

const MyAppsApp = ({
  accountId,
  privateKey,
  evmAddress,
  network = "testnet",
  accounts,
  activeAccount,
  connectAccount,
}: MyAppsAppProps) => {
  const { AppName, AppID } = useParams<{ AppName: string; AppID: string }>();

  const contractId = "0.0.8454022";

  const [app, setApp] =
    useState<(AppItem & { relation: AppLOT | null }) | null>(null);
  const [loading, setLoading] = useState(true);

  const [matchedFiles, setMatchedFiles] = useState<any[]>([]);
  const [appSource, setAppSource] = useState<string>("");
  const [RuntimeComponent, setRuntimeComponent] = useState<any>(null);

  const createClient = () => {
    const client =
      network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    client.setOperator(
      AccountId.fromString(accountId),
      PrivateKey.fromStringECDSA(privateKey)
    );
    return client;
  };

  // ---------------- DROPBOX ----------------

  const fetchDropboxFiles = async (path: string = "/apps_files") => {
    const accessToken = await getAccessToken();

    const response = await fetch(
      "https://api.dropboxapi.com/2/files/list_folder",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_summary || "Fetch failed");
    }

    return data.entries || [];
  };

  const normalizeName = (name: string) => name.replace(/^\d+[_-]/, "");

  const compareWithDropbox = async (appMetaData: string) => {
    try {
      const entries = await fetchDropboxFiles("/apps_files");
      const files = entries.filter((e: any) => e[".tag"] === "file");
      const parsed = JSON.parse(appMetaData);
      const targetName = parsed.file_name;

      const matched = files.find((f: any) => normalizeName(f.name) === targetName);

      if (!matched) {
        console.warn("No matching file found");
        return;
      }

      setMatchedFiles([matched]);

      const content = await getDropboxFileContent(matched.path_display);
      setAppSource(content);
    } catch (err) {
      console.error("Dropbox compare error:", err);
    }
  };

  const getDropboxFileContent = async (filePath: string) => {
    const accessToken = await getAccessToken();

    const response = await fetch(
      "https://content.dropboxapi.com/2/files/download",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Dropbox-API-Arg": JSON.stringify({ path: filePath }),
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    return await response.text();
  };

  // ---------------- FIXED RUNTIME ENGINE ----------------

  const transformSource = (source: string) => {
    // Remove all import statements and exports
    return source
      .replace(/import[\s\S]*?from\s+["'][^"']+["'];?/g, "")
      .replace(/export default/g, "")
      .replace(/export\s+(function|const|class)/g, "$1");
  };

  useEffect(() => {
    if (!appSource) return;

    try {
      const cleaned = transformSource(appSource);

      // wrap in an IIFE to avoid top-level identifier issues
      const wrapperFn = new Function(
        "React",
        `
          return (function() {
            ${cleaned}
            return typeof App !== "undefined" ? App : null;
          })();
        `
      );

      const Component = wrapperFn(React);

      if (!Component) {
        throw new Error("No component returned from Dropbox file");
      }

      setRuntimeComponent(() => Component);
    } catch (err) {
      console.error("Failed to mount app source:", err);
      setRuntimeComponent(null);
    }
  }, [appSource]);

  // ---------------- HEDERA FETCH ----------------

  const fetchApp = async () => {
    const client = createClient();
    const abiCoder = new AbiCoder();

    try {
      const query = new ContractCallQuery()
        .setContractId(ContractId.fromString(contractId))
        .setGas(800_000)
        .setFunction("getPublishedApps")
        .setMaxQueryPayment(new Hbar(1));

      const res = await query.execute(client);

      const apps = abiCoder.decode(
        [
          "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)[]",
        ],
        res.bytes
      )[0];

      for (const a of apps) {
        if (Number(a.appId) !== Number(AppID) || a.appName !== decodeURIComponent(AppName!))
          continue;

        const appData: AppItem = {
          appId: Number(a.appId),
          appName: a.appName,
          appDescription: a.appDescription,
          appImage: a.appImage,
          appMetaData: a.metadata,
          appStatus: ["PendingReview","Published","Unlisted","Unpublished"][Number(a.appStatus)],
          appType: ["Free","Paid","OpenSource","Beta"][Number(a.appType)],
          owner: a.owner.toLowerCase(),
        };

        setApp({ ...appData, relation: null });
        break;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EFFECTS ----------------

  useEffect(() => {
    if (AppID && AppName) fetchApp();
  }, [AppID, AppName]);

  useEffect(() => {
    if (app?.appMetaData) compareWithDropbox(app.appMetaData);
  }, [app]);

  // ---------------- UI ----------------

  if (loading) return <p>Loading app...</p>;
  if (!app) return <p>App not found</p>;

  return (
    <div className="MyAppsApp_wrapper">
      <Link to="/Myapps">⬅ Back</Link>

      <img src={app.appImage} width={200} />
      <h2>{app.appName}</h2>

      <p><strong>Type:</strong> {app.appType}</p>
      <p><strong>Status:</strong> {app.appStatus}</p>

      {/* 🚀 LIVE APP RUNTIME */}
      <div style={{ marginTop: 30 }}>
        <h3>🚀 Live App Runtime</h3>
        {RuntimeComponent ? (
          <RuntimeComponent />
        ) : (
          <p>Loading code from Dropbox...</p>
        )}
      </div>
    </div>
  );
};

export default MyAppsApp;

