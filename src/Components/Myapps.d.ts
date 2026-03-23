interface MyappsProps {
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
declare const Myapps: ({ accounts, activeAccount, connectAccount }: MyappsProps) => import("react/jsx-runtime").JSX.Element;
export default Myapps;
