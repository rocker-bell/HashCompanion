import "../Styles/hashcompanionStore.css";
interface Props {
    accountId: string;
    privateKey: string;
    evmAddress: string;
    network?: "testnet" | "mainnet";
}
declare const HashCompanionStoreApp: ({ accountId, privateKey, evmAddress, network }: Props) => import("react/jsx-runtime").JSX.Element;
export default HashCompanionStoreApp;
