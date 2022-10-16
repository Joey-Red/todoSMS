import React, { useState, useEffect } from "react";
import Nav from "./Components/Nav";
import Main from "./Components/Main";
function App() {
    let [bgColor, setBgColor] = useState("white");
    let [textColor, setTextColor] = useState("black");
    let [mode, setMode] = useState("lightMode");
    useEffect(() => {
        if (mode === "lightMode") {
            setBgColor("white");
            setTextColor("black");
        }
        if (mode === "darkMode") {
            setBgColor("grey");
            setTextColor("white");
        }
    }, [mode]);

    return (
        <div
            className="App"
            style={{
                background: bgColor,
                color: textColor,
                transition: "300ms linear all",
            }}
        >
            <Nav mode={mode} setMode={setMode} />
            <Main />
        </div>
    );
}

export default App;
