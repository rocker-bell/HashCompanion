import {Link} from "react-router-dom";
import "../Styles/HederaAppsMarketplace.css"
const HederaAppsMarketplace = () => {
    return (
        <>
            <div className="hederaAppsMarketplace_wrapper">
                <div className="MarketplaceHeader_container">
                     <Link to="/">
                        <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
                    </Link>
                </div>
                    

                <h1>Welcome to Hedera Apps marketplace - store</h1>

                <h3><strong>still in developpement</strong></h3>

                <p>it is an app marketplace from where you can add apps to your HashCompanion! built on the Hashgraph on hedera for hedera</p>
            </div>
        
        </>
    )
}

export default HederaAppsMarketplace;