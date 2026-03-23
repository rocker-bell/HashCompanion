import "../Styles/DexScan.css";
interface DexScanProps {
    accountId: string | null;
    privateKey: string | null;
    evmAddress: string | null;
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
declare const DexScan: ({ accountId, evmAddress, accounts, activeAccount, connectAccount }: DexScanProps) => import("react/jsx-runtime").JSX.Element;
export default DexScan;
