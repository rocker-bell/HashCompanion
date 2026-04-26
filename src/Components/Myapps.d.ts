import "../Styles/Myapps.css";
interface MyappsProps {
    accountId: string;
    privateKey: string;
    evmAddress: string;
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
declare const Myapps: ({ accountId, privateKey, evmAddress, network, accounts, activeAccount, connectAccount }: MyappsProps) => import("react/jsx-runtime").JSX.Element;
export default Myapps;
