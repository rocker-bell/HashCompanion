import "../Styles/Chatbox.css";
import {Link} from "react-router-dom";
const Chatbox = () => {
    return (
        <>
            <div className="chatbox-wrapper">
                    <Link to="/ConnectWallet">
                             <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
                    </Link>

                    <h3>welcome to chatbox</h3>

            </div>


        </>
    )
}

export default Chatbox;