import "../Styles/HederaAppsMarketplace.css";
interface Props {
    accountId: string | null;
    privateKey: string | null;
    evmAddress: string | null;
    network?: "testnet" | "mainnet";
}
declare const HederaAppsMarketplace: ({ accountId, privateKey, network }: Props) => import("react/jsx-runtime").JSX.Element;
export default HederaAppsMarketplace;
