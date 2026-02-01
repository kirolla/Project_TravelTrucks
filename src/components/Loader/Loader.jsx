import React from "react";
import css from "./Loader.module.css";

const Loader = ({ size = "medium", inline = false }) => {
    const sizes = {
        small: {
            width: "30px",
            height: "30px",
            borderWidth: "3px"
        },
        medium: {
            width: "50px",
            height: "50px",
            borderWidth: "5px"
        },
        large: {
            width: "70px",
            height: "70px",
            borderWidth: "6px"
        }
    };

    const currentSize = sizes[size] || sizes.medium;

    return (
        <div className={`${css.loader} ${inline ? css.inline : ''}`}>
            <div
                className={css.spinner}
                style={{
                    width: currentSize.width,
                    height: currentSize.height,
                    borderWidth: currentSize.borderWidth
                }}
            ></div>
        </div>
    );
};

export default Loader;