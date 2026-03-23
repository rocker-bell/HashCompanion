import "../Styles/TodoApp.css";
interface TodoAppProps {
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
declare const TodoApp: ({ accountId, privateKey, evmAddress, accounts, activeAccount, connectAccount }: TodoAppProps) => import("react/jsx-runtime").JSX.Element;
export default TodoApp;
