import {Link} from "react-router-dom";
interface MyappsProps {
  accounts: { accountId: string; privateKey: string; evmAddress?: string }[];
  activeAccount: number | null;
  connectAccount: (acc?: { accountId: string; privateKey: string }) => Promise<void>;
}

const Myapps = ({ accounts, activeAccount, connectAccount }: MyappsProps) => {
  return (
    <div className="Myapps_wrapper">
      <Link
        to="/ConnectWallet"
        onClick={() => activeAccount !== null && connectAccount(accounts[activeAccount])}
      >
        <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
      </Link>
      <h2>Welcome to my APPS</h2>
    </div>
  );
};

export default Myapps;