import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Typewriter from "typewriter-effect";
import { v4 as uuidv4 } from "uuid";
import RemLayout from "./RemLayout";
function Main() {
    let [newField, setNewField] = useState(false);
    let [currEvent, setCurrEvent] = useState({ text: "", id: "" });
    let [active, setActive] = useState(false);
    let [reminderArray, setReminderArray] = useState<
        { text: string; id: string }[]
    >([]);

    let todo = JSON.parse(localStorage.getItem("todo") || "[]");

    useEffect(() => {
        let updatedArr: { text: string; id: string }[] = [];

        todo.forEach(function (rem: { text: string; id: string }) {
            updatedArr.push(rem);
        });
        setReminderArray(updatedArr);
    }, []);

    let style = {
        transform: "rotate(-45deg)",
        color: "#49ad49",
        transition: "300ms linear all",
    };
    let nostyle = {
        transition: "300ms linear all",
    };
    // Create account would allow you to get your notes from any device.
    let handleClick = (e: any) => {
        if (e.target !== null && !e.target.classList.contains("active")) {
            e.target.classList.add("active");
            setNewField(true);
            setActive(true);
        } else if (e.target !== null && e.target.classList.contains("active")) {
            e.target.classList.remove("active");
            setActive(false);
            setNewField(false);
        }
    };
    let keyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrEvent({ text: e.target.value, id: uuidv4() });

        // localStorage.setItem([...localArr, currEvent]);
    };
    let handleClickDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        let newArr = [...reminderArray];
        let newTodo = [...todo];
        for (var i = newArr.length - 1; i >= 0; --i) {
            if (newArr[i].id === e.currentTarget.value) {
                newArr.splice(i, 1);
            }
        }
        for (var j = newTodo.length - 1; j >= 0; --j) {
            if (newTodo[j].id === e.currentTarget.value) {
                newTodo.splice(j, 1);
            }
        }
        setReminderArray([...newArr]);
        localStorage.setItem("todo", JSON.stringify(newTodo));
    };
    // let handleClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     setShowMenu(!showMenu);
    //     // console.log(e.currentTarget.value);
    // };
    return (
        <div className="main">
            <div className="animContainer">
                <div className="faIconContainer">
                    <FontAwesomeIcon
                        icon={faCirclePlus}
                        className="navFa"
                        size="xl"
                    />
                </div>
                <div className="animText">
                    <Typewriter
                        options={{
                            strings: [
                                "Walk the dog!",
                                "Take out the trash.",
                                "Mow the lawn.",
                                "Pack lunches for the kids.",
                            ],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div>
            </div>
            {reminderArray.map((item) => {
                // console.log(item);
                return (
                    <div className="animContainer" key={item.id}>
                        <div className="faIconContainer">
                            <button
                                onClick={handleClickDelete}
                                value={item.id}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "1em",
                                }}
                                className="deleteButton"
                            >
                                <FontAwesomeIcon
                                    icon={faCirclePlus}
                                    className="navFa toggle"
                                    size="xl"
                                    // style={active ? style : nostyle}
                                />
                            </button>
                        </div>

                        <div className="animText">
                            {item.text}{" "}
                            <div style={{ position: "absolute", right: "4px" }}>
                                <RemLayout item={item} />
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="animContainer">
                <div className="faIconContainer">
                    <FontAwesomeIcon
                        icon={faCirclePlus}
                        className="navFa toggle"
                        size="xl"
                        onClick={handleClick}
                        style={active ? style : nostyle}
                    />
                </div>
                <div className="animText">
                    {newField && (
                        <input
                            type="text"
                            placeholder="Get gas on the way home."
                            onChange={keyInput}
                            value={currEvent.text}
                            onKeyUp={(
                                e: React.KeyboardEvent<HTMLDivElement>
                            ) => {
                                if (
                                    e.key === "Enter" &&
                                    currEvent.text !== ""
                                ) {
                                    setReminderArray([
                                        ...reminderArray,
                                        currEvent,
                                    ]);
                                    setCurrEvent({ text: "", id: "" });
                                    todo.push(currEvent);
                                    // console.log("Added todo #" + todo);
                                    // console.log(todo);
                                    // Saving
                                    localStorage.setItem(
                                        "todo",
                                        JSON.stringify(todo)
                                    );
                                }
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Main;
