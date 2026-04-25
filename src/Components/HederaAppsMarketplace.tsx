import { Link, useNavigate } from "react-router-dom";
import "../Styles/HederaAppsMarketplace.css";
import { useState, useEffect } from "react";

import { Search, ChevronLeft, ChevronRight, Home } from "lucide-react";

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
  accounts: { accountId: string; privateKey: string; evmAddress?: string }[];
   activeAccount: number | null;
  connectAccount: (acc?: { accountId: string; privateKey: string }) => Promise<void>;
}

const HederaAppsMarketplace = ({
  accountId,
  privateKey,
  network = "testnet",
  accounts, 
  activeAccount,
  connectAccount 
}: Props) => {

  const contractId = "0.0.8454022";

  const navigate = useNavigate()

  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 search states
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 📄 pagination
  const [currentPage, setCurrentPage] = useState(1);
  const APPS_PER_PAGE = 6;

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
      let emptyStreak = 0;

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

          emptyStreak = 0;
                console.log(results);

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

        } catch {
          emptyStreak++;
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

  // 🔍 trigger search only on click / enter
  const handleSearch = () => {
    setSearchTerm(inputValue);
    setCurrentPage(1);
  };

  // 🔍 filter apps
  const filteredApps = apps.filter((app) =>
    app.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.appDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 pagination logic
  const totalPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);
  const startIndex = (currentPage - 1) * APPS_PER_PAGE;
  const paginatedApps = filteredApps.slice(
    startIndex,
    startIndex + APPS_PER_PAGE
  );


 

  const handleCheckApp = (AppName: string, AppId: number) => {
  navigate(`/App/${AppName}/${AppId}`);
};

  return (
    <div className="hederaAppsMarketplace_wrapper">

      {/* HEADER */}
      <div className="MarketplaceHeader_container">
        <div className="MarketplaceHeader_header">

          <Link
        to="/ConnectWallet"
        onClick={() => activeAccount !== null && connectAccount(accounts[activeAccount])}
      >
        <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
      </Link>

                    <Link
                to="/hederaAppsMarketplace"
                className="home-btn"
                onClick={() => {
                    setInputValue("");
                    setSearchTerm("");
                    setCurrentPage(1);
                }}
                >
                <Home size={22} />
                </Link>

          {/* SEARCH */}
          <div className="MarketplaceHeader_search_container">
            <input
              type="text"
              placeholder="Search apps..."
              className="MarketplaceHeader_search_input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />

            <button className="search-btn" onClick={handleSearch}>
              <Search size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="content" >
      {loading ? (
        <p>Loading apps...</p>
      ) : filteredApps.length === 0 ? (
        <p>No apps found.</p>
      ) : (
        <>
          <div className="apps-grid">
            {paginatedApps.map((app) => (
              <div key={app.appId} className="app-card" onClick={() => handleCheckApp(app.appName, app.appId)}>
                {app.appImage && (
                  <img src={app.appImage} alt={app.appName} />
                )}
                <h3>{app.appName}</h3>
                {/* <p>{app.appDescription}</p> */}
                <p><strong>Type:</strong> {app.appType}</p>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
        
        </>
      )}
      </div>
       <div className="pagination">

                <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    <ChevronLeft size={18} />
                </button>

                <span className="pagination-info">
                    {currentPage} / {totalPages || 1}
                </span>

                <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((p) => p + 1)}
                >
                    <ChevronRight size={18} />
                </button>

            </div>
    </div>
  );
};

export default HederaAppsMarketplace;