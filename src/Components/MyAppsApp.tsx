import { useParams } from "react-router-dom";
const MyAppsApp = () => {
    const { AppName, AppID } = useParams();

    return (
        <div className="MyAppsApp_wrapper">
            <p>App name: {AppName}</p>
            <p>App id: {AppID}</p>
        </div>
    );
};

export default MyAppsApp;