import "../Styles/HederaAppsMarketplace.css";
interface Props {
    accountId: string | null;
    privateKey: string | null;
    evmAddress: string | null;
    network?: "testnet" | "mainnet";
    accounts: {
        accountId: string;
        privateKey: string;
        evmAddress?: string;
    }[];
    activeAccount: number | null;
    connectAccount: (acc?: {
        accountId: string;
        privateKey: string;
    }) => Promise<void>;
}
declare const HederaAppsMarketplace: ({ accountId, privateKey, network, accounts, activeAccount, connectAccount }: Props) => import("react/jsx-runtime").JSX.Element;
export default HederaAppsMarketplace;
