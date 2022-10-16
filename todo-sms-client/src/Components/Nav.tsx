import React from "react";
function Nav(props: any) {
    let { bgColor, mode, setMode } = props;
    // console.log(typeof bgColor);
    let darkMode = () => {
        setMode("darkMode");
    };
    let lightMode = () => {
        setMode("lightMode");
    };
    return (
        <div className="main" style={{ backgroundColor: bgColor }}>
            <h2>Your friendly Reminder Web-App with SMS Updates.</h2>
            <div className="menu">
                {mode === "default" && <button>Dark Mode</button>}
                {mode === "lightMode" && (
                    <button onClick={darkMode}>Dark Mode</button>
                )}
                {mode === "darkMode" && (
                    <button onClick={lightMode}>Light Mode</button>
                )}
                <button>Sign in For SMS</button>
            </div>
        </div>
    );
}

export default Nav;
