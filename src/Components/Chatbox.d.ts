import "../Styles/Chatbox.css";
interface ChatboxProps {
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
declare const Chatbox: ({ accountId, privateKey, evmAddress, accounts, activeAccount, connectAccount }: ChatboxProps) => import("react/jsx-runtime").JSX.Element;
export default Chatbox;
