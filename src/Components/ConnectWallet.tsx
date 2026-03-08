// import { useState } from "react";
// import { ethers } from "ethers";

// const ConnectWallet = () => {
//   const [mnemonic, setMnemonic] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [address, setAddress] = useState("");

//   const handleVerify = () => {
//     try {
//       let wallet;

//       if (mnemonic.trim()) {
//         wallet = ethers.Wallet.fromPhrase(mnemonic.trim());
//       } else if (privateKey.trim()) {
//         wallet = new ethers.Wallet(privateKey.trim());
//       } else {
//         alert("Enter mnemonic or private key");
//         return;
//       }

//       setAddress(wallet.address);
//     } catch (err) {
//       alert("Invalid mnemonic or private key");
//       setAddress("");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Connect Wallet</h2>

//       <textarea
//         placeholder="Enter mnemonic"
//         value={mnemonic}
//         onChange={(e) => setMnemonic(e.target.value)}
//         rows={3}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="OR Enter private key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button onClick={handleVerify}>
//         Verify & Connect
//       </button>

//       {address && (
//         <p><strong>Wallet Address:</strong> {address}</p>
//       )}
//     </div>
//   );
// };

// export default ConnectWallet;



// import { useState } from "react";
// import {
//   Client,
//   AccountBalanceQuery,
//   PrivateKey,
//   AccountId
// } from "@hashgraph/sdk";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);

//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       // Validate inputs
//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery()
//         .setAccountId(parsedAccountId);

//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button onClick={connectAccount} disabled={loading}>
//         {loading ? "Connecting..." : "Connect"}
//       </button>

//       {balance && (
//         <p><strong>Balance:</strong> {balance}</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;

// works


// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";
// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // --- Save only account ID for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     navigate("/")
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         alert("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     alert("Disconnected from account.");
//   };

//   // --- Hot reload: restore account ID ---
//   useEffect(() => {
//     const savedId = localStorage.getItem("hedera_account_id");
//     if (savedId) {
//       setAccountId(savedId);
//     }
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button onClick={connectAccount} disabled={loading}>
//         {loading ? "Connecting..." : "Connect"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//       >
//         Disconnect
//       </button>

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;



// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // --- Save account ID to localStorage for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     navigate("/");
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         alert("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     alert("Disconnected from account.");
//   };

//   // --- Hot reload: check for changes in localStorage every 3 seconds ---
//   useEffect(() => {
//     // Set an interval to check the localStorage value periodically
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) {
//         setAccountId(savedId);
//       }
//     }, 3000); // Check every 3 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, [accountId]); // Rerun the effect only if `accountId` changes

//   // --- Hot reload: listen for storage event to sync across tabs ---
//   useEffect(() => {
//     // Listen for changes to `localStorage` in other tabs/windows
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") {
//         setAccountId(e.newValue || ""); // Update state with new accountId
//       }
//     };

//     // Attach the listener
//     window.addEventListener("storage", onStorageChange);

//     // Cleanup the event listener on unmount
//     return () => {
//       window.removeEventListener("storage", onStorageChange);
//     };
//   }, []);

//   // --- Hot reload: Fetch balance when accountId changes ---
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (accountId) {
//         try {
//           setLoading(true);

//           const parsedAccountId = AccountId.fromString(accountId);

//           const client =
//             import.meta.env.VITE_NETWORK === "mainnet"
//               ? Client.forMainnet()
//               : Client.forTestnet();

//           const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//           const accountBalance = await balanceQuery.execute(client);

//           setBalance(accountBalance.hbars.toString());
//         } catch (err) {
//           console.error(err);
//           setBalance("Error fetching balance");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     // Fetch balance when accountId changes
//     fetchBalance();
//   }, [accountId]);

//   return (
//     <div >
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button onClick={connectAccount} disabled={loading}>
//         {loading ? "Connecting..." : "Connected"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//       >
//         Disconnect
//       </button>

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// working


// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // --- Save account ID to localStorage for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     navigate("/"); // Optionally navigate elsewhere after disconnect
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         alert("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     alert("Disconnected from account.");
//   };

//   // --- Hot reload: check for changes in localStorage every 3 seconds ---
//   useEffect(() => {
//     // Set an interval to check the localStorage value periodically
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) {
//         setAccountId(savedId);
//       } else if (!savedId && accountId) {
//         // Clear account and balance if localStorage doesn't contain account ID
//         disconnect();
//       }
//     }, 3000); // Check every 3 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, [accountId]); // Rerun the effect only if `accountId` changes

//   // --- Hot reload: listen for storage event to sync across tabs ---
//   useEffect(() => {
//     // Listen for changes to `localStorage` in other tabs/windows
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") {
//         setAccountId(e.newValue || ""); // Update state with new accountId
//       }
//     };

//     // Attach the listener
//     window.addEventListener("storage", onStorageChange);

//     // Cleanup the event listener on unmount
//     return () => {
//       window.removeEventListener("storage", onStorageChange);
//     };
//   }, []);

//   // --- Hot reload: Fetch balance when accountId changes ---
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (accountId) {
//         try {
//           setLoading(true);

//           const parsedAccountId = AccountId.fromString(accountId);

//           const client =
//             import.meta.env.VITE_NETWORK === "mainnet"
//               ? Client.forMainnet()
//               : Client.forTestnet();

//           const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//           const accountBalance = await balanceQuery.execute(client);

//           setBalance(accountBalance.hbars.toString());
//         } catch (err) {
//           console.error(err);
//           setBalance("Error fetching balance");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     // Fetch balance when accountId changes
//     fetchBalance();
//   }, [accountId]);

//   return (
//     <div >
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button
//         onClick={connectAccount}
//         disabled={loading || !!localStorage.getItem("hedera_account_id")}
//       >
//         {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//         disabled={!localStorage.getItem("hedera_account_id")}
//       >
//         Disconnect
//       </button>

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [ethAddress, setEthAddress] = useState("");
//   const navigate = useNavigate();

//   // --- Save account ID to localStorage for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEthAddress(""); // Clear the ETH address when disconnecting
//     navigate("/"); // Optionally navigate elsewhere after disconnect
//   };

//   // --- Fetch ETH Address from HashScan ---
//   const fetchEthAddress = async (accountId: string) => {
//     try {
//       const response = await fetch(`https://api.hashscan.io/v1/account/${accountId}/address`);
//       const data = await response.json();
//       setEthAddress(data?.address || "Address not found");
//     } catch (err) {
//       console.error("Error fetching ETH address:", err);
//     }
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         alert("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//       // Fetch the ETH address from HashScan
//       fetchEthAddress(accountId);

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     alert("Disconnected from account.");
//   };

//   // --- Hot reload: check for changes in localStorage every 3 seconds ---
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) {
//         setAccountId(savedId);
//       } else if (!savedId && accountId) {
//         disconnect();
//       }
//     }, 3000); // Check every 3 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // --- Hot reload: listen for storage event to sync across tabs ---
//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") {
//         setAccountId(e.newValue || "");
//       }
//     };

//     window.addEventListener("storage", onStorageChange);

//     return () => {
//       window.removeEventListener("storage", onStorageChange);
//     };
//   }, []);

//   // --- Hot reload: Fetch balance when accountId changes ---
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (accountId) {
//         try {
//           setLoading(true);

//           const parsedAccountId = AccountId.fromString(accountId);

//           const client =
//             import.meta.env.VITE_NETWORK === "mainnet"
//               ? Client.forMainnet()
//               : Client.forTestnet();

//           const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//           const accountBalance = await balanceQuery.execute(client);

//           setBalance(accountBalance.hbars.toString());
//         } catch (err) {
//           console.error(err);
//           setBalance("Error fetching balance");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchBalance();
//   }, [accountId]);

//   // --- Masking the Account ID and Private Key ---
//   const maskAccountId = (id: string) => {
//     if (!id) return "";
//     return `${id.slice(0, 8)}...${id.slice(-4)}`;
//   };

//   const maskPrivateKey = (key: string) => {
//     if (!key) return "";
//     return `${key.slice(0, 8)}...${key.slice(-4)}`;
//   };

//   return (
//     <div>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button
//         onClick={connectAccount}
//         disabled={loading || !!localStorage.getItem("hedera_account_id")}
//       >
//         {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//         disabled={!localStorage.getItem("hedera_account_id")}
//       >
//         Disconnect
//       </button>

//       {accountId && (
//         <div>
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}

//       {ethAddress && (
//         <p style={{ marginTop: 10 }}><strong>ETH Address:</strong> {ethAddress.slice(0, 6)}...{ethAddress.slice(-4)}</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {Link} from "react-router-dom";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");  // For the EVM Address
//   const navigate = useNavigate();

//   // --- Save account ID to localStorage for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress(""); // Clear the EVM address when disconnecting
//     navigate("/"); // Optionally navigate elsewhere after disconnect
//   };

//   // --- Fetch EVM Address from a Service (like HashScan) ---
//   const fetchEvmAddress = async (accountId: string) => {
//     try {
//       // This is an example request to the HashScan API. Adjust as needed.
//       const response = await fetch(`https://api.hashscan.io/v1/account/${accountId}/evm-address`);
//       const data = await response.json();
      
//       // Assuming HashScan returns an object with `evm_address`
//       if (data && data.evm_address) {
//         setEvmAddress(data.evm_address);
//       } else {
//         setEvmAddress("EVM address not found");
//       }
//     } catch (err) {
//       console.error("Error fetching EVM address:", err);
//     }
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//       // Fetch the EVM address from HashScan or relevant API
//       fetchEvmAddress(accountId);

//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // --- Hot reload: check for changes in localStorage every 3 seconds ---
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) {
//         setAccountId(savedId);
//       } else if (!savedId && accountId) {
//         disconnect();
//       }
//     }, 3000); // Check every 3 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // --- Hot reload: listen for storage event to sync across tabs ---
//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") {
//         setAccountId(e.newValue || "");
//       }
//     };

//     window.addEventListener("storage", onStorageChange);

//     return () => {
//       window.removeEventListener("storage", onStorageChange);
//     };
//   }, []);

//   // --- Hot reload: Fetch balance when accountId changes ---
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (accountId) {
//         try {
//           setLoading(true);

//           const parsedAccountId = AccountId.fromString(accountId);

//           const client =
//             import.meta.env.VITE_NETWORK === "mainnet"
//               ? Client.forMainnet()
//               : Client.forTestnet();

//           const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//           const accountBalance = await balanceQuery.execute(client);

//           setBalance(accountBalance.hbars.toString());
//         } catch (err) {
//           console.error(err);
//           setBalance("Error fetching balance");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchBalance();
//   }, [accountId]);

//   // --- Masking the Account ID and Private Key ---
//   const maskAccountId = (id: string) => {
//     if (!id) return "";
//     return `${id.slice(0, 8)}...${id.slice(-4)}`;
//   };

//   const maskPrivateKey = (key: string) => {
//     if (!key) return "";
//     return `${key.slice(0, 8)}...${key.slice(-4)}`;
//   };

//   const maskEvmAddress = (address: string) => {
//     if (!address) return "";
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   const AddTodo = () => {
    
//   }

//   return (
//     <div>
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button
//         onClick={connectAccount}
//         disabled={loading || !!localStorage.getItem("hedera_account_id")}
//       >
//         {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//         disabled={!localStorage.getItem("hedera_account_id")}
//       >
//         Disconnect
//       </button>

//       {accountId && (
//         <div>
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}

//       {evmAddress && (
//         <p style={{ marginTop: 10 }}><strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}</p>
//       )}

//       <div className="todo_container">
//             <button type="submit" onClick={AddTodo}>
//                   Add
//             </button>
//       </div>
//     </div>
//   );
// };

// export default ConnectHederaAccount;

// works

// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";

// type Status = "Active" | "Completed" | "Expired";



// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);
  
//   const navigate = useNavigate();

//   const saveAccountId = (id: string) => localStorage.setItem("hedera_account_id", id);
//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   const fetchEvmAddress = async (accountId: string) => {
//     try {
//       const response = await fetch(`https://api.hashscan.io/v1/account/${accountId}/evm-address`);
//       const data = await response.json();
//       if (data && data.evm_address) setEvmAddress(data.evm_address);
//       else setEvmAddress("EVM address not found");
//     } catch (err) {
//       console.error("Error fetching EVM address:", err);
//     }
//   };

//   const connectAccount = async () => {
//     try {
//       setLoading(true);
//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);
//       fetchEvmAddress(accountId);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

  
//   useEffect(() => {
//   if (!accountId) return;

//   const fetchBalance = async () => {
//     try {
//       setLoading(true);
//       const parsedAccountId = AccountId.fromString(accountId);
//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();
//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);
//       setBalance(accountBalance.hbars.toString());
//     } catch (err) {
//       console.error(err);
//       setBalance("Error fetching balance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   fetchBalance();

//   // Poll every 5 seconds
//   const intervalId = setInterval(fetchBalance, 5000);

//   return () => clearInterval(intervalId);
// }, [accountId]);

//   const maskAccountId = (id: string) => (!id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`);
//   const maskPrivateKey = (key: string) => (!key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`);
//   const maskEvmAddress = (address: string) => (!address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`);



//   const CONTRACT_ADDRESS = "0xe307fd0518faab84bec309f4206591ee5a6179f0";

//   const AddTodo = async () => {
//   if (!todoTitle) {
//     toast.error("Title is required");
//     return;
//   }

//   if (!evmAddress) {
//     toast.error("EVM Address not available");
//     return;
//   }

//   try {
//     // Connect to Hedera-compatible EVM wallet (via window.ethereum)
//     //@ts-ignore
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     const contract = new ethers.Contract(CONTRACT_ADDRESS, TODOLISTABI.abi, signer);

//     // Example: set dueDate 24h from now
//     const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//     const tx = await contract.addTodo(todoTitle, todoDescription, dueDate);
//     await tx.wait();

//     // Update local state UI
//     setTodos([...todos, { title: todoTitle, description: todoDescription, status: "Active" }]);
//     setTodoTitle("");
//     setTodoDescription("");
//     setTodoStatus("Active");
//     setShowModal(false);

//     toast.success("Todo added on chain!");
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to add Todo on chain");
//   }
// };

//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input type="text" placeholder="Account ID (0.0.x)" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="input" />
//       <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} className="input" />

//       <div className="button-group">
//         <button onClick={connectAccount} disabled={loading || !!localStorage.getItem("hedera_account_id")} className="btn">
//           {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//         </button>
//         <button onClick={disconnect} disabled={!localStorage.getItem("hedera_account_id")} className="btn disconnect">
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}
//       {balance && <p className="info"><strong>Balance:</strong> {balance} HBAR</p>}
//       {evmAddress && <p className="info"><strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}</p>}

//       <div className="todo_container">
//         <button type="button" onClick={() => setShowModal(true)} className="btn">Add Todo</button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>
//             <input type="text" placeholder="Title" value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} className="input" />
//             <textarea placeholder="Description" value={todoDescription} onChange={(e) => setTodoDescription(e.target.value)} className="textarea" />
//             <select value={todoStatus} onChange={(e) => setTodoStatus(e.target.value as Status)} className="select">
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">Add</button>
//               <button onClick={() => setShowModal(false)} className="btn disconnect">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>
//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p><strong>Title:</strong> {todo.title}</p>
//               <p><strong>Description:</strong> {todo.description}</p>
//               <p><strong>Status:</strong> {todo.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;

// works magnifico

// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import {
//   Client,
//   AccountBalanceQuery,
//   PrivateKey,
//   AccountId,
// } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";
// import { ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";


// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<
//     { title: string; description: string; status: Status }[]
//   >([]);

//   const navigate = useNavigate();

//   const CONTRACT_ID = "0.0.8028090";

//   const saveAccountId = (id: string) =>
//     localStorage.setItem("hedera_account_id", id);

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   // ✅ Correct Hedera EVM address conversion
//   const getEvmAddressFromAccountId = (id: string): string => {
//     try {
//       const parsed = AccountId.fromString(id);
//       return "0x" + parsed.toSolidityAddress();
//     } catch (err) {
//       console.error("Error converting to EVM address:", err);
//       return "";
//     }
//   };

//   // -------------------- Connect Hedera account --------------------
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(
//         parsedAccountId
//       );
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);

//       // ✅ Use AccountId → Solidity address conversion
//       const evm = getEvmAddressFromAccountId(accountId);
//       setEvmAddress(evm);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // -------------------- Polling for accountId changes --------------------
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id")
//         setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   // -------------------- Balance polling --------------------
//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);

//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();

//         const balanceQuery = new AccountBalanceQuery().setAccountId(
//           parsedAccountId
//         );

//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // -------------------- Masking helpers --------------------
//   const maskAccountId = (id: string) =>
//     !id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`;

//   const maskPrivateKey = (key: string) =>
//     !key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`;

//   const maskEvmAddress = (address: string) =>
//     !address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`;

//   // const CONTRACT_ADDRESS =
//   //   "0xe307fd0518faab84bec309f4206591ee5a6179f0";

//   // -------------------- Add Todo --------------------
//   // const AddTodo = async () => {
//   //   if (!todoTitle) {
//   //     toast.error("Title is required");
//   //     return;
//   //   }

//   //   if (!evmAddress) {
//   //     toast.error("EVM Address not available");
//   //     return;
//   //   }

//   //   try {
//   //     //@ts-ignore
//   //     const provider = new ethers.providers.Web3Provider(window.ethereum);
//   //     const signer = provider.getSigner();

//   //     const contract = new ethers.Contract(
//   //       CONTRACT_ADDRESS,
//   //       TODOLISTABI.abi,
//   //       signer
//   //     );

//   //     const dueDate =
//   //       Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//   //     const tx = await contract.addTodo(
//   //       todoTitle,
//   //       todoDescription,
//   //       dueDate
//   //     );

//   //     await tx.wait();

//   //     setTodos([
//   //       ...todos,
//   //       {
//   //         title: todoTitle,
//   //         description: todoDescription,
//   //         status: "Active",
//   //       },
//   //     ]);

//   //     setTodoTitle("");
//   //     setTodoDescription("");
//   //     setTodoStatus("Active");
//   //     setShowModal(false);

//   //     toast.success("Todo added on chain!");
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Failed to add Todo on chain");
//   //   }
//   // };

//   const AddTodo = async () => {
//   if (!todoTitle) {
//     toast.error("Title is required");
//     return;
//   }

//   try {
//     if (!accountId || !privateKey) {
//       toast.error("Wallet not connected");
//       return;
//     }

//     const parsedAccountId = AccountId.fromString(accountId);
//     const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//     const client =
//       import.meta.env.VITE_NETWORK === "mainnet"
//         ? Client.forMainnet()
//         : Client.forTestnet();

//     client.setOperator(parsedAccountId, parsedPrivateKey);

//     const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//     // Execute the contract function directly via Hedera SDK
//     const tx = await new ContractExecuteTransaction()
//       .setContractId(CONTRACT_ID)
//       .setGas(500000) // adjust if needed
//       .setFunction(
//         "addTodo",
//         new ContractFunctionParameters()
//           .addString(todoTitle)
//           .addString(todoDescription)
//           .addUint256(dueDate)
//       )
//       .execute(client);

//     const receipt = await tx.getReceipt(client);

//     console.log("Transaction status:", receipt.status.toString());

//     toast.success("Todo added on Hedera Testnet!");

//     setTodos([
//       ...todos,
//       {
//         title: todoTitle,
//         description: todoDescription,
//         status: "Active",
//       },
//     ]);

//     setTodoTitle("");
//     setTodoDescription("");
//     setTodoStatus("Active");
//     setShowModal(false);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to add Todo on Hedera");
//   }
// };

//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         className="input"
//       />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         className="input"
//       />

//       <div className="button-group">
//         <button
//           onClick={connectAccount}
//           disabled={
//             loading ||
//             !!localStorage.getItem("hedera_account_id")
//           }
//           className="btn"
//         >
//           {loading
//             ? "Connecting..."
//             : localStorage.getItem("hedera_account_id")
//             ? "Connected"
//             : "Connect"}
//         </button>

//         <button
//           onClick={disconnect}
//           disabled={
//             !localStorage.getItem("hedera_account_id")
//           }
//           className="btn disconnect"
//         >
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p>
//             <strong>Account ID:</strong>{" "}
//             {maskAccountId(accountId)}
//           </p>
//           <p>
//             <strong>Private Key:</strong>{" "}
//             {maskPrivateKey(privateKey)}
//           </p>
//         </div>
//       )}

//       {balance && (
//         <p className="info">
//           <strong>Balance:</strong> {balance} HBAR
//         </p>
//       )}

//       {evmAddress && (
//         <p className="info">
//           <strong>EVM Address:</strong>{" "}
//           {maskEvmAddress(evmAddress)}
//         </p>
//       )}

//       <div className="todo_container">
//         <button
//           type="button"
//           onClick={() => setShowModal(true)}
//           className="btn"
//         >
//           Add Todo
//         </button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>

//             <input
//               type="text"
//               placeholder="Title"
//               value={todoTitle}
//               onChange={(e) =>
//                 setTodoTitle(e.target.value)
//               }
//               className="input"
//             />

//             <textarea
//               placeholder="Description"
//               value={todoDescription}
//               onChange={(e) =>
//                 setTodoDescription(e.target.value)
//               }
//               className="textarea"
//             />

//             <select
//               value={todoStatus}
//               onChange={(e) =>
//                 setTodoStatus(e.target.value as Status)
//               }
//               className="select"
//             >
//               <option value="Active">Active</option>
//               <option value="Completed">
//                 Completed
//               </option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button
//                 onClick={AddTodo}
//                 className="btn"
//               >
//                 Add
//               </button>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="btn disconnect"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>

//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p>
//                 <strong>Title:</strong> {todo.title}
//               </p>
//               <p>
//                 <strong>Description:</strong>{" "}
//                 {todo.description}
//               </p>
//               <p>
//                 <strong>Status:</strong> {todo.status}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;

// test brasla works


// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import {
//   Client,
//   AccountBalanceQuery,
//   PrivateKey,
//   AccountId,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction
// } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";

// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<
//     { title: string; description: string; status: Status }[]
//   >([]);

//   const navigate = useNavigate();

//   const CONTRACT_ID = "0.0.8028090";

//   const saveAccountId = (id: string) =>
//     localStorage.setItem("hedera_account_id", id);

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   const getEvmAddressFromAccountId = (id: string): string => {
//     try {
//       const parsed = AccountId.fromString(id);
//       return "0x" + parsed.toSolidityAddress();
//     } catch (err) {
//       console.error("Error converting to EVM address:", err);
//       return "";
//     }
//   };

//   // -------------------- Connect Hedera account --------------------
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(
//         parsedAccountId
//       );
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);

//       const evm = getEvmAddressFromAccountId(accountId);
//       setEvmAddress(evm);

//       // ✅ Fetch all todos on login
//       fetchTodos(client);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // -------------------- Polling for accountId changes --------------------
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id")
//         setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   // -------------------- Balance polling --------------------
//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);

//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();

//         const balanceQuery = new AccountBalanceQuery().setAccountId(
//           parsedAccountId
//         );

//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // -------------------- Masking helpers --------------------
//   const maskAccountId = (id: string) =>
//     !id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`;

//   const maskPrivateKey = (key: string) =>
//     !key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`;

//   const maskEvmAddress = (address: string) =>
//     !address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`;

//   // -------------------- Fetch Todos --------------------
//   // const fetchTodos = async (clientOverride?: Client) => {
//   //   if (!accountId || !privateKey) return;

//   //   const client =
//   //     clientOverride ??
//   //     (import.meta.env.VITE_NETWORK === "mainnet"
//   //       ? Client.forMainnet()
//   //       : Client.forTestnet());

//   //   const parsedAccountId = AccountId.fromString(accountId);
//   //   const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);
//   //   client.setOperator(parsedAccountId, parsedPrivateKey);

//   //   try {
//   //     // 1️⃣ Get total todos
//   //     const totalTodosTx = await new ContractCallQuery()
//   //       .setContractId(CONTRACT_ID)
//   //       .setGas(100000)
//   //       .setFunction("getTotalTodos")
//   //       .execute(client);

//   //     const totalTodos = totalTodosTx.getUint256(0);

//   //     const allTodos: { title: string; description: string; status: Status }[] = [];

//   //     // 2️⃣ Fetch each todo
//   //     for (let i = 1; i <= totalTodos; i++) {
//   //       const todoRes = await new ContractCallQuery()
//   //         .setContractId(CONTRACT_ID)
//   //         .setGas(200000)
//   //         .setFunction(
//   //           "getTodo",
//   //           new ContractFunctionParameters().addUint256(i)
//   //         )
//   //         .execute(client);

//   //       const title = todoRes.getString(0);
//   //       const description = todoRes.getString(1);
//   //       const statusIndex = todoRes.getUint256(3); // 0 = Active, 1 = Completed, 2 = Expired

//   //       const status: Status =
//   //         statusIndex === 0
//   //           ? "Active"
//   //           : statusIndex === 1
//   //           ? "Completed"
//   //           : "Expired";

//   //       allTodos.push({ title, description, status });
//   //     }

//   //     setTodos(allTodos);
//   //   } catch (err) {
//   //     console.error("Error fetching todos:", err);
//   //   }
//   // };

//   // -------------------- Fetch Todos --------------------
// const fetchTodos = async (clientOverride?: Client) => {
//   if (!accountId || !privateKey) return;

//   const client =
//     clientOverride ??
//     (import.meta.env.VITE_NETWORK === "mainnet"
//       ? Client.forMainnet()
//       : Client.forTestnet());

//   const parsedAccountId = AccountId.fromString(accountId);
//   const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);
//   client.setOperator(parsedAccountId, parsedPrivateKey);

//   try {
//     // 1️⃣ Get total todos
//     const totalTodosTx = await new ContractCallQuery()
//       .setContractId(CONTRACT_ID)
//       .setGas(100000)
//       .setFunction("getTotalTodos")
//       .execute(client);

//     // const totalTodos = totalTodosTx.getUint256(0);
//     const totalTodosBig = totalTodosTx.getUint256(0);
//     const totalTodos = Number(totalTodosBig);

//     const allTodos: { title: string; description: string; status: Status }[] = [];

//     // 2️⃣ Fetch each todo
//     for (let i = 1; i <= totalTodos; i++) {
//       const todoRes = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(200000)
//         .setFunction(
//           "getTodo",
//           new ContractFunctionParameters().addUint256(i)
//         )
//         .execute(client);

//       const title = todoRes.getString(0);
//       const description = todoRes.getString(1);
//       const statusIndexBig = todoRes.getUint256(3); // Hedera returns BigNumber / Long
//       const statusIndex = Number(statusIndexBig);   // ✅ convert to number before comparison

//       const status: Status =
//         statusIndex === 0
//           ? "Active"
//           : statusIndex === 1
//           ? "Completed"
//           : "Expired";

//       allTodos.push({ title, description, status });
//     }

//     setTodos(allTodos);
//   } catch (err) {
//     console.error("Error fetching todos:", err);
//   }
// };

//   // -------------------- Add Todo --------------------
//   const AddTodo = async () => {
//     if (!todoTitle) {
//       toast.error("Title is required");
//       return;
//     }

//     try {
//       if (!accountId || !privateKey) {
//         toast.error("Wallet not connected");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//       const tx = await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500000)
//         .setFunction(
//           "addTodo",
//           new ContractFunctionParameters()
//             .addString(todoTitle)
//             .addString(todoDescription)
//             .addUint256(dueDate)
//         )
//         .execute(client);

//       const receipt = await tx.getReceipt(client);

//       console.log("Transaction status:", receipt.status.toString());
//       toast.success("Todo added on Hedera Testnet!");

//       setTodos([
//         ...todos,
//         {
//           title: todoTitle,
//           description: todoDescription,
//           status: "Active",
//         },
//       ]);

//       setTodoTitle("");
//       setTodoDescription("");
//       setTodoStatus("Active");
//       setShowModal(false);

//       // ✅ Refresh the todos after adding
//       fetchTodos(client);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add Todo on Hedera");
//     }
//   };

//   // -------------------- Render --------------------
//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         className="input"
//       />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         className="input"
//       />

//       <div className="button-group">
//         <button
//           onClick={connectAccount}
//           disabled={
//             loading || !!localStorage.getItem("hedera_account_id")
//           }
//           className="btn"
//         >
//           {loading
//             ? "Connecting..."
//             : localStorage.getItem("hedera_account_id")
//             ? "Connected"
//             : "Connect"}
//         </button>

//         <button
//           onClick={disconnect}
//           disabled={!localStorage.getItem("hedera_account_id")}
//           className="btn disconnect"
//         >
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p>
//             <strong>Account ID:</strong> {maskAccountId(accountId)}
//           </p>
//           <p>
//             <strong>Private Key:</strong> {maskPrivateKey(privateKey)}
//           </p>
//         </div>
//       )}

//       {balance && (
//         <p className="info">
//           <strong>Balance:</strong> {balance} HBAR
//         </p>
//       )}

//       {evmAddress && (
//         <p className="info">
//           <strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}
//         </p>
//       )}

//       <div className="todo_container">
//         <button
//           type="button"
//           onClick={() => setShowModal(true)}
//           className="btn"
//         >
//           Add Todo
//         </button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>

//             <input
//               type="text"
//               placeholder="Title"
//               value={todoTitle}
//               onChange={(e) => setTodoTitle(e.target.value)}
//               className="input"
//             />

//             <textarea
//               placeholder="Description"
//               value={todoDescription}
//               onChange={(e) => setTodoDescription(e.target.value)}
//               className="textarea"
//             />

//             <select
//               value={todoStatus}
//               onChange={(e) =>
//                 setTodoStatus(e.target.value as Status)
//               }
//               className="select"
//             >
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">
//                 Add
//               </button>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="btn disconnect"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>

//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p>
//                 <strong>Title:</strong> {todo.title}
//               </p>
//               <p>
//                 <strong>Description:</strong> {todo.description}
//               </p>
//               <p>
//                 <strong>Status:</strong> {todo.status}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import {
//   Client,
//   AccountBalanceQuery,
//   PrivateKey,
//   AccountId,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction
// } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";
// import todoapp_icon from "../assets/todoapp_icon.png";

// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<
//     { title: string; description: string; status: Status }[]
//   >([]);

//   const navigate = useNavigate();

//   const CONTRACT_ID = "0.0.8028090";

//   const saveAccountId = (id: string) =>
//     localStorage.setItem("hedera_account_id", id);

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   const getEvmAddressFromAccountId = (id: string): string => {
//     try {
//       const parsed = AccountId.fromString(id);
//       return "0x" + parsed.toSolidityAddress();
//     } catch (err) {
//       console.error("Error converting to EVM address:", err);
//       return "";
//     }
//   };

//   // -------------------- Connect Hedera account --------------------
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(
//         parsedAccountId
//       );
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);

//       const evm = getEvmAddressFromAccountId(accountId);
//       setEvmAddress(evm);

//       // ✅ Fetch all todos on login
//       fetchTodos(client);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // -------------------- Polling for accountId changes --------------------
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id")
//         setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   // -------------------- Balance polling --------------------
//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);

//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();

//         const balanceQuery = new AccountBalanceQuery().setAccountId(
//           parsedAccountId
//         );

//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // -------------------- Masking helpers --------------------
//   const maskAccountId = (id: string) =>
//     !id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`;

//   const maskPrivateKey = (key: string) =>
//     !key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`;

//   const maskEvmAddress = (address: string) =>
//     !address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`;

  

//   // -------------------- Fetch Todos --------------------
// const fetchTodos = async (clientOverride?: Client) => {
//   if (!accountId || !privateKey) return;

//   const client =
//     clientOverride ??
//     (import.meta.env.VITE_NETWORK === "mainnet"
//       ? Client.forMainnet()
//       : Client.forTestnet());

//   const parsedAccountId = AccountId.fromString(accountId);
//   const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);
//   client.setOperator(parsedAccountId, parsedPrivateKey);

//   try {
//     // 1️⃣ Get total todos
//     const totalTodosTx = await new ContractCallQuery()
//       .setContractId(CONTRACT_ID)
//       .setGas(100000)
//       .setFunction("getTotalTodos")
//       .execute(client);

//     // const totalTodos = totalTodosTx.getUint256(0);
//     const totalTodosBig = totalTodosTx.getUint256(0);
//     const totalTodos = Number(totalTodosBig);

//     const allTodos: { title: string; description: string; status: Status }[] = [];

//     // 2️⃣ Fetch each todo
//     for (let i = 1; i <= totalTodos; i++) {
//       const todoRes = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(200000)
//         .setFunction(
//           "getTodo",
//           new ContractFunctionParameters().addUint256(i)
//         )
//         .execute(client);

//       const title = todoRes.getString(0);
//       const description = todoRes.getString(1);
//       const statusIndexBig = todoRes.getUint256(3); // Hedera returns BigNumber / Long
//       const statusIndex = Number(statusIndexBig);   // ✅ convert to number before comparison

//       const status: Status =
//         statusIndex === 0
//           ? "Active"
//           : statusIndex === 1
//           ? "Completed"
//           : "Expired";

//       allTodos.push({ title, description, status });
//     }

//     setTodos(allTodos);
//   } catch (err) {
//     console.error("Error fetching todos:", err);
//   }
// };

//   // -------------------- Add Todo --------------------
//   const AddTodo = async () => {
//     if (!todoTitle) {
//       toast.error("Title is required");
//       return;
//     }

//     try {
//       if (!accountId || !privateKey) {
//         toast.error("Wallet not connected");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//       const tx = await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500000)
//         .setFunction(
//           "addTodo",
//           new ContractFunctionParameters()
//             .addString(todoTitle)
//             .addString(todoDescription)
//             .addUint256(dueDate)
//         )
//         .execute(client);

//       const receipt = await tx.getReceipt(client);

//       console.log("Transaction status:", receipt.status.toString());
//       toast.success("Todo added on Hedera Testnet!");

//       setTodos([
//         ...todos,
//         {
//           title: todoTitle,
//           description: todoDescription,
//           status: "Active",
//         },
//       ]);

//       setTodoTitle("");
//       setTodoDescription("");
//       setTodoStatus("Active");
//       setShowModal(false);

//       // ✅ Refresh the todos after adding
//       fetchTodos(client);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add Todo on Hedera");
//     }
//   };

//   const handleTodoLink = () => {
//     navigate("/todoApp")
//   }

//   // -------------------- Render --------------------
//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         className="input"
//       />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         className="input"
//       />

//       <div className="button-group">
//         <button
//           onClick={connectAccount}
//           disabled={
//             loading || !!localStorage.getItem("hedera_account_id")
//           }
//           className="btn"
//         >
//           {loading
//             ? "Connecting..."
//             : localStorage.getItem("hedera_account_id")
//             ? "Connected"
//             : "Connect"}
//         </button>

//         <button
//           onClick={disconnect}
//           disabled={!localStorage.getItem("hedera_account_id")}
//           className="btn disconnect"
//         >
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p>
//             <strong>Account ID:</strong> {maskAccountId(accountId)}
//           </p>
//           <p>
//             <strong>Private Key:</strong> {maskPrivateKey(privateKey)}
//           </p>
//         </div>
//       )}

//       {balance && (
//         <p className="info">
//           <strong>Balance:</strong> {balance} HBAR
//         </p>
//       )}

//       {evmAddress && (
//         <p className="info">
//           <strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}
//         </p>
//       )}

//       <div className="apps-container">
//           <div className="app-box" onClick={handleTodoLink}>
              
//               <img src={todoapp_icon} alt="" className="app-image" />
//               <p className="app-title">todoApp</p>
//           </div>
//       </div>

//       {/* <div className="todo_container">
//         <button
//           type="button"
//           onClick={() => setShowModal(true)}
//           className="btn"
//         >
//           Add Todo
//         </button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>

//             <input
//               type="text"
//               placeholder="Title"
//               value={todoTitle}
//               onChange={(e) => setTodoTitle(e.target.value)}
//               className="input"
//             />

//             <textarea
//               placeholder="Description"
//               value={todoDescription}
//               onChange={(e) => setTodoDescription(e.target.value)}
//               className="textarea"
//             />

//             <select
//               value={todoStatus}
//               onChange={(e) =>
//                 setTodoStatus(e.target.value as Status)
//               }
//               className="select"
//             >
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">
//                 Add
//               </button>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="btn disconnect"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>

//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p>
//                 <strong>Title:</strong> {todo.title}
//               </p>
//               <p>
//                 <strong>Description:</strong> {todo.description}
//               </p>
//               <p>
//                 <strong>Status:</strong> {todo.status}
//               </p>
//             </div>
//           ))}
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default ConnectHederaAccount;

import { useState, useEffect } from "react";
import {
  Client,
  AccountBalanceQuery,
  PrivateKey,
  AccountId,
 
  
} from "@hashgraph/sdk";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";
import todoapp_icon from "../assets/todoapp_icon.png";

// type Status = "Active" | "Completed" | "Expired";

interface ConnectWalletProps {
  accountId: string | null;
  privateKey: string | null;
   evmAddress: string | null;
  setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
  setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
  setEvmAddress: React.Dispatch<React.SetStateAction<string | null>>; // ✅ add this
}

const ConnectHederaAccount: React.FC<ConnectWalletProps> = ({
  accountId,
  privateKey,
  evmAddress,
  setAccountId,
  setPrivateKey,
  setEvmAddress,
}) => {
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  // const [evmAddress, setEvmAddress] = useState("");
 
const [hasConnected, setHasConnected] = useState(false);
  const navigate = useNavigate();

  // const CONTRACT_ID = "0.0.8028090";

  const saveAccountId = (id: string) =>
    localStorage.setItem("hedera_account_id", id);

  const clearAccountId = () => {
    localStorage.removeItem("hedera_account_id");
    setAccountId(null);
    setPrivateKey(null);
    setBalance("");
    setEvmAddress("");
    navigate("/");
  };

  const getEvmAddressFromAccountId = (id: string): string => {
    try {
      const parsed = AccountId.fromString(id);
      return "0x" + parsed.toSolidityAddress();
    } catch (err) {
      console.error("Error converting to EVM address:", err);
      return "";
    }
  };

  // -------------------- Connect Hedera account --------------------
  const connectAccount = async () => {
    try {
      setLoading(true);

      if (!accountId || !privateKey) {
        toast.error("Please enter both Account ID and Private Key");
        return;
      }

      const parsedAccountId = AccountId.fromString(accountId.trim());
      const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();

      client.setOperator(parsedAccountId, parsedPrivateKey);

      const balanceQuery = new AccountBalanceQuery().setAccountId(
        parsedAccountId
      );
      const accountBalance = await balanceQuery.execute(client);

      setBalance(accountBalance.hbars.toString());
      saveAccountId(accountId);
      setHasConnected(true);

      const evm = getEvmAddressFromAccountId(accountId);
      setEvmAddress(evm);

      // ✅ Fetch all todos on login
      // fetchTodos(client);
    } catch (err) {
      console.error(err);
      toast.error("Invalid Account ID or Private Key");
      setBalance("");
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    clearAccountId();
    toast.error("Disconnected from account.");
  };

  
  useEffect(() => {
  const intervalId = setInterval(() => {
    const savedId = localStorage.getItem("hedera_account_id");
    if (savedId && savedId !== accountId) setAccountId(savedId);
    else if (!savedId && accountId && hasConnected) disconnect();
  }, 3000);

  return () => clearInterval(intervalId);
}, [accountId, hasConnected]);

  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "hedera_account_id") setAccountId(e.newValue || null);
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // -------------------- Balance polling --------------------
  useEffect(() => {
    if (!accountId) return;

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const parsedAccountId = AccountId.fromString(accountId);

        const client =
          import.meta.env.VITE_NETWORK === "mainnet"
            ? Client.forMainnet()
            : Client.forTestnet();

        const balanceQuery = new AccountBalanceQuery().setAccountId(
          parsedAccountId
        );

        const accountBalance = await balanceQuery.execute(client);
        setBalance(accountBalance.hbars.toString());
      } catch (err) {
        console.error(err);
        setBalance("Error fetching balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 5000);
    return () => clearInterval(intervalId);
  }, [accountId]);

  // -------------------- Masking helpers --------------------
  const maskAccountId = (id: string) =>
    !id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`;

  const maskPrivateKey = (key: string) =>
    !key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`;

  const maskEvmAddress = (address: string) =>
    !address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`;



  const handleTodoLink = () => {
    navigate("/todoApp");
  };

  const handlechatboxLink = () => {
    navigate("/chatbox")
  }

  // -------------------- Render --------------------
  return (
    <div className="container">
       <Link to="/">
            <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
      </Link>
      <h2>Connect Hedera Account</h2>

      <input
        type="text"
        placeholder="Account ID (0.0.x)"
        value={accountId ?? ""}
        onChange={(e) => setAccountId(e.target.value.trim())}
        className="input"
      />

      <input
        type="text"
        placeholder="Private Key"
        value={privateKey ?? ""}
        onChange={(e) => setPrivateKey(e.target.value.trim())}
        className="input"
      />

      <div className="button-group">
        <button
          onClick={connectAccount}
          disabled={loading}
          className="btn"
        >
          {loading ? "Connecting..." : accountId ? "Connected" : "Connect"}
        </button>

        <button
          onClick={disconnect}
          disabled={!accountId}
          className="btn disconnect"
        >
          Disconnect
        </button>
      </div>

      {accountId && (
        <div className="info">
          <p>
            <strong>Account ID:</strong> {maskAccountId(accountId)}
          </p>
          <p>
            <strong>Private Key:</strong> {maskPrivateKey(privateKey ?? "")}
          </p>
        </div>
      )}

      {balance && (
        <p className="info">
          <strong>Balance:</strong> {balance} HBAR
        </p>
      )}

      {evmAddress && (
        <p className="info">
          <strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}
        </p>
      )}

      <div className="apps-container">
        <div className="app-box" onClick={handleTodoLink}>
          <img src={todoapp_icon} alt="" className="app-image" />
          <p className="app-title">todoApp</p>
        </div>
        <div className="app-box" onClick={handlechatboxLink}>
          <img src="data:image/png;base64,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" alt="speech-bubble-with-dots--v1"></img>
          <p className="app-title">chatbox</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectHederaAccount;



// second

// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";
// // import { EvmAddress } from "@hashgraph/sdk";

// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);

//   const navigate = useNavigate();

//   const saveAccountId = (id: string) => localStorage.setItem("hedera_account_id", id);
//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   // -------------------- EVM address fetch --------------------
//   // const fetchEvmAddress = async (id: string) => {
//   //   try {
//   //     const res = await fetch(`https://api.hashscan.io/v1/account/${id}/evm-address`);
//   //     const data = await res.json();
//   //     console.log("data", data)
//   //     if (data && data.evm_address) setEvmAddress(data.evm_address);
//   //     else setEvmAddress("EVM address not found");
//   //   } catch (err) {
//   //     console.error("Error fetching EVM address:", err);
//   //     setEvmAddress("Error fetching EVM");
//   //   }
//   // };

//   // -------------------- Connect Hedera account --------------------
//   // const connectAccount = async () => {
//   //   try {
//   //     setLoading(true);
//   //     if (!accountId || !privateKey) {
//   //       toast.error("Please enter both Account ID and Private Key");
//   //       return;
//   //     }

//   //     const parsedAccountId = AccountId.fromString(accountId);
//   //     const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//   //     const client =
//   //       import.meta.env.VITE_NETWORK === "mainnet"
//   //         ? Client.forMainnet()
//   //         : Client.forTestnet();

//   //     client.setOperator(parsedAccountId, parsedPrivateKey);

//   //     const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//   //     const accountBalance = await balanceQuery.execute(client);

//   //     setBalance(accountBalance.hbars.toString());
//   //     saveAccountId(accountId);

//   //     // ✅ Fetch and set EVM address
//   //     await fetchEvmAddress(accountId);
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Invalid Account ID or Private Key");
//   //     setBalance("");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

  

// const getEvmAddressFromPrivateKey = (privateKey: string): string => {
//   try {
//     const pk = PrivateKey.fromStringECDSA(privateKey);
//     const publicKeyBytes = pk.publicKey.toBytesRaw(); // raw 33 bytes
//     // take last 20 bytes for EVM address
//     const evmBytes = publicKeyBytes.slice(-20);
//     const evmAddress = "0x" + Buffer.from(evmBytes).toString("hex");
//     return evmAddress;
//   } catch (err) {
//     console.error("Error deriving EVM address:", err);
//     return "";
//   }
// };

//   const connectAccount = async () => {
//   try {
//     setLoading(true);
//     if (!accountId || !privateKey) {
//       toast.error("Please enter both Account ID and Private Key");
//       return;
//     }

//     const parsedAccountId = AccountId.fromString(accountId);
//     const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//     const client =
//       import.meta.env.VITE_NETWORK === "mainnet"
//         ? Client.forMainnet()
//         : Client.forTestnet();

//     client.setOperator(parsedAccountId, parsedPrivateKey);

//     const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//     const accountBalance = await balanceQuery.execute(client);

//     setBalance(accountBalance.hbars.toString());
//     saveAccountId(accountId);

//     // <-- Replace fetch with local computation
//     const evm = getEvmAddressFromPrivateKey(privateKey);
//     setEvmAddress(evm);
//   } catch (err) {
//     console.error(err);
//     toast.error("Invalid Account ID or Private Key");
//     setBalance("");
//   } finally {
//     setLoading(false);
//   }
// };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // -------------------- Polling for accountId changes --------------------
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   // -------------------- Balance polling --------------------
//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);
//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();
//         const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // -------------------- Masking helpers --------------------
//   const maskAccountId = (id: string) => (!id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`);
//   const maskPrivateKey = (key: string) => (!key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`);
//   const maskEvmAddress = (address: string) => (!address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`);

//   const CONTRACT_ADDRESS = "0xe307fd0518faab84bec309f4206591ee5a6179f0";

//   // -------------------- Add Todo --------------------
//   const AddTodo = async () => {
//     if (!todoTitle) {
//       toast.error("Title is required");
//       return;
//     }

//     if (!evmAddress) {
//       toast.error("EVM Address not available");
//       return;
//     }

//     try {
//       //@ts-ignore
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();

//       const contract = new ethers.Contract(CONTRACT_ADDRESS, TODOLISTABI.abi, signer);

//       const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//       const tx = await contract.addTodo(todoTitle, todoDescription, dueDate);
//       await tx.wait();

//       setTodos([...todos, { title: todoTitle, description: todoDescription, status: "Active" }]);
//       setTodoTitle("");
//       setTodoDescription("");
//       setTodoStatus("Active");
//       setShowModal(false);

//       toast.success("Todo added on chain!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add Todo on chain");
//     }
//   };

//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input type="text" placeholder="Account ID (0.0.x)" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="input" />
//       <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} className="input" />

//       <div className="button-group">
//         <button onClick={connectAccount} disabled={loading || !!localStorage.getItem("hedera_account_id")} className="btn">
//           {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//         </button>
//         <button onClick={disconnect} disabled={!localStorage.getItem("hedera_account_id")} className="btn disconnect">
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}
//       {balance && <p className="info"><strong>Balance:</strong> {balance} HBAR</p>}
//       {evmAddress && <p className="info"><strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}</p>}

//       <div className="todo_container">
//         <button type="button" onClick={() => setShowModal(true)} className="btn">Add Todo</button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>
//             <input type="text" placeholder="Title" value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} className="input" />
//             <textarea placeholder="Description" value={todoDescription} onChange={(e) => setTodoDescription(e.target.value)} className="textarea" />
//             <select value={todoStatus} onChange={(e) => setTodoStatus(e.target.value as Status)} className="select">
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">Add</button>
//               <button onClick={() => setShowModal(false)} className="btn disconnect">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>
//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p><strong>Title:</strong> {todo.title}</p>
//               <p><strong>Description:</strong> {todo.description}</p>
//               <p><strong>Status:</strong> {todo.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";

// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);

//   const navigate = useNavigate();

//   const saveAccountId = (id: string) => localStorage.setItem("hedera_account_id", id);
//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   const fetchEvmAddress = async (accountId: string) => {
//     try {
//       const res = await fetch(`https://api.hashscan.io/v1/account/${accountId}/evm-address`);
//       const data = await res.json();
//       if (data?.evm_address) {
//         setEvmAddress(data.evm_address); // ✅ fixed
//       } else {
//         setEvmAddress("");
//         toast.warn("Account is not EVM-compatible or EVM address not found");
//       }
//     } catch (err) {
//       console.error(err);
//       setEvmAddress("");
//     }
//   };

//   const connectAccount = async () => {
//     try {
//       setLoading(true);
//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);
//       fetchEvmAddress(accountId);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);
//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();
//         const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   const maskAccountId = (id: string) => (!id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`);
//   const maskPrivateKey = (key: string) => (!key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`);
//   const maskEvmAddress = (address: string) => (!address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`);

//   const CONTRACT_ADDRESS = "0xe307fd0518faab84bec309f4206591ee5a6179f0";

//    const AddTodo = async () => {
//   if (!todoTitle) {
//     toast.error("Title is required");
//     return;
//   }

//   if (!evmAddress) {
//     toast.error("EVM Address not available");
//     return;
//   }

//   try {
//     // Connect to Hedera-compatible EVM wallet (via window.ethereum)
//     //@ts-ignore
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     const contract = new ethers.Contract(CONTRACT_ADDRESS, TODOLISTABI.abi, signer);

//     // Example: set dueDate 24h from now
//     const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//     const tx = await contract.addTodo(todoTitle, todoDescription, dueDate);
//     await tx.wait();

//     // Update local state UI
//     setTodos([...todos, { title: todoTitle, description: todoDescription, status: "Active" }]);
//     setTodoTitle("");
//     setTodoDescription("");
//     setTodoStatus("Active");
//     setShowModal(false);

//     toast.success("Todo added on chain!");
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to add Todo on chain");
//   }
// };

//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input type="text" placeholder="Account ID (0.0.x)" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="input" />
//       <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} className="input" />

//       <div className="button-group">
//         <button onClick={connectAccount} disabled={loading || !!localStorage.getItem("hedera_account_id")} className="btn">
//           {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//         </button>
//         <button onClick={disconnect} disabled={!localStorage.getItem("hedera_account_id")} className="btn disconnect">
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}
//       {balance && <p className="info"><strong>Balance:</strong> {balance} HBAR</p>}
//       {evmAddress && <p className="info"><strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}</p>}

//       <div className="todo_container">
//         <button type="button" onClick={() => setShowModal(true)} className="btn" disabled={!evmAddress}>
//           Add Todo
//         </button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>
//             <input type="text" placeholder="Title" value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} className="input" />
//             <textarea placeholder="Description" value={todoDescription} onChange={(e) => setTodoDescription(e.target.value)} className="textarea" />
//             <select value={todoStatus} onChange={(e) => setTodoStatus(e.target.value as Status)} className="select">
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">Add</button>
//               <button onClick={() => setShowModal(false)} className="btn disconnect">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>
//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p><strong>Title:</strong> {todo.title}</p>
//               <p><strong>Description:</strong> {todo.description}</p>
//               <p><strong>Status:</strong> {todo.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;