import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
function RemLayout(props: any) {
    let [showMenu, setShowMenu] = useState(false);
    let [newDate, setNewDate] = useState(false);
    let { item } = props;
    let handleClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowMenu(!showMenu);
        // console.log(e.currentTarget.value);
    };

    // React.MouseEvent<HTMLButtonElement>
    let addDate = () => {
        setNewDate(!newDate);
        setShowMenu(false);
        console.log("date");
    };

    let addAudio = () => {
        setShowMenu(false);
        console.log("audio");
    };

    let addPhoto = () => {
        setShowMenu(false);
        console.log("photo");
    };
    return (
        <div style={{ zIndex: "999" }}>
            {showMenu && (
                <div
                    style={{
                        position: "absolute",
                        right: "1rem",
                        top: "0",
                        backgroundColor: "red",
                        padding: "8px",
                        minHeight: "fit-content",
                    }}
                >
                    <ul style={{ listStyle: "none", minWidth: "max-content" }}>
                        <li>
                            {" "}
                            <button onClick={addDate} className="mediaButton">
                                Add Date
                            </button>
                        </li>
                        <li>
                            <button onClick={addAudio} className="mediaButton">
                                Add Audio
                            </button>
                        </li>
                        <li>
                            <button onClick={addPhoto} className="mediaButton">
                                Add Photo
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            {newDate && <input type="date" />}
            <button
                style={{
                    background: "none",
                    border: "none",
                }}
                onClick={handleClickMenu}
                value={item.id}
            >
                <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    className="navFa toggle"
                    size="xl"
                    // style={active ? style : nostyle}
                />
            </button>
        </div>
    );
}

export default RemLayout;
