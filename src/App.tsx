import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadAccounts,
  saveAccounts,
  loadActiveAccount,
  saveActiveAccount
} from "./utils/storage"

import { Routes, Route } from "react-router-dom";
import DappStructure from "./Components/DappStructure.tsx";
import CreateHederaAccount from "./Components/CreateAccount.tsx";
import ConnectHederaAccount from "./Components/ConnectWallet.tsx";
import TodoApp from "./Components/TodoApp.tsx";
import Chatbox from "./Components/Chatbox.tsx";
import DexScan from "./Components/DexScan.tsx";
// import HCAIhelper from "./Components/HCAIhelper.tsx";
import HCCompanion from "./Components/TestChatbox.tsx";
// import HCAIhelper from "./Components/AI_Chatbox.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HbarAccountManager from "./Components/HbarAccountManager.tsx";
import Myapps from "./Components/Myapps.tsx";
import HederaAppsMarketplace from "./Components/HederaAppsMarketplace.tsx";
const App = () => {
  const navigate = useNavigate()
  // shared wallet state
  const [accountId, setAccountId] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [autoConnect, setAutoConnect] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([])
const [activeAccount, setActiveAccount] = useState<number | null>(null)


useEffect(() => {
  const initWallet = async () => {
    const storedAccounts = await loadAccounts()
    const activeIndex = await loadActiveAccount()

    setAccounts(storedAccounts)
    setActiveAccount(activeIndex)
  }

  initWallet()
}, [])

useEffect(() => {
  saveAccounts(accounts)
}, [accounts])

useEffect(() => {
  if (activeAccount !== null) {
    saveActiveAccount(activeAccount)
  }
}, [activeAccount])



const clearAccount = () => {
  setAccountId(null);
  setPrivateKey(null);
  setEvmAddress(null);
  localStorage.removeItem("hedera_account_id");
};

const connectAccount = async (acc?: { accountId: string; privateKey: string }) => {
    try {
      const a = acc || (activeAccount !== null ? accounts[activeAccount] : null);
      if (!a) return;

      const { AccountId, PrivateKey, Client, AccountBalanceQuery } = await import("@hashgraph/sdk");
      const parsedAccountId = AccountId.fromString(a.accountId);
      const parsedPrivateKey = PrivateKey.fromStringECDSA(a.privateKey);

      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();
      client.setOperator(parsedAccountId, parsedPrivateKey);

      const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
      const accountBalance = await balanceQuery.execute(client);

      setAccountId(a.accountId);
      setPrivateKey(a.privateKey);
      setEvmAddress("0x" + parsedAccountId.toSolidityAddress());
      console.log("Connected. Balance:", accountBalance.hbars.toString());
      localStorage.setItem("hedera_account_id", a.accountId);
    } catch (err) {
      console.error("Failed to connect account:", err);
    }
  };

  const handleUseWallet = (index: number) => {
  clearAccount();                   // disconnect old wallet
  setActiveAccount(index);          // set new active wallet
  connectAccount(accounts[index]);  // connect new wallet
  navigate('/ConnectWallet')
};

  return (
    <>
      <ToastContainer position="top-right" />
      <Routes>
         <Route 
          path="/Myapps" 
          element={
            <Myapps 
              accounts={accounts} 
              activeAccount={activeAccount} 
              connectAccount={connectAccount} 
            />
          } 
        />
        <Route path="/" element={<DappStructure />} />
        <Route path="/CreateAccount" element={<CreateHederaAccount />} />
    

      <Route
  path="/testCompanion"
  element={
    <HCCompanion
      accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
      accounts={accounts}
      activeAccount={activeAccount}
      setActiveAccount={setActiveAccount}
      connectAccount={connectAccount}
    />
  }
/>
       

            <Route
  path="/DexScan"
  element={
    <DexScan
      accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
      accounts={accounts}
      activeAccount={activeAccount}
      connectAccount={connectAccount}
    />
  }
/>
     
        <Route
  path="/ConnectWallet"
  element={
    <ConnectHederaAccount
      accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
      setAccountId={setAccountId}
      setPrivateKey={setPrivateKey}
      setEvmAddress={setEvmAddress}
      accounts={accounts}           
      activeAccount={activeAccount} 
      autoConnect={autoConnect}
      setAutoConnect={setAutoConnect}
    />
  }
/>
    

        <Route
  path="/TodoApp"
  element={
    <TodoApp
      accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
      accounts={accounts}
      activeAccount={activeAccount}
      connectAccount={connectAccount}
    />
  }
/>
       

        <Route
  path="/Chatbox"
  element={
    <Chatbox
      accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
      accounts={accounts}
      activeAccount={activeAccount}
      connectAccount={connectAccount}
    />
  }
/>
      

            { <Route
  path="/HCmanager"
  element={
    <HbarAccountManager
      accounts={accounts}
      setAccounts={setAccounts}
      activeAccount={activeAccount}
      setActiveAccount={setActiveAccount} 
      onUseWallet={handleUseWallet}       
      clearAccount={clearAccount}
      connectAccount={connectAccount}
    />
  }
/> }


      {

        <Route  path="/hederaAppsMarketplace" element={ 
        <HederaAppsMarketplace
  accountId={accountId}
  privateKey={privateKey}
  
  evmAddress={evmAddress}
/> } />
      }

      </Routes>
    </>
  );
};

export default App;