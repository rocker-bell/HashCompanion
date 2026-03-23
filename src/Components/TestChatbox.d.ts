import "../Styles/HCAIHelper.css";
type HCCompanionProps = {
    evmAddress: string | null;
    privateKey: string | null;
    accountId: string | null;
    accounts: {
        accountId: string;
        privateKey: string;
        evmAddress?: string;
    }[];
    activeAccount: number | null;
    setActiveAccount: React.Dispatch<React.SetStateAction<number | null>>;
    connectAccount: (acc?: {
        accountId: string;
        privateKey: string;
    }) => Promise<void>;
};
declare const HCCompanion: ({ evmAddress, privateKey, accountId, accounts, activeAccount, connectAccount }: HCCompanionProps) => import("react/jsx-runtime").JSX.Element;
export default HCCompanion;
