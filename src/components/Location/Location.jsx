import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "../../redux/slices/filtersSlice";
import icons from "../../images/icons.svg";
import css from "./Location.module.css";


const cities = [
    "Kyiv, Ukraine", "Lviv, Ukraine", "Kharkiv, Ukraine", "Odesa, Ukraine",
    "Dnipro, Ukraine", "Donetsk, Ukraine", "Zaporizhzhia, Ukraine", "Vinnytsia, Ukraine",
    "Chernihiv, Ukraine", "Cherkasy, Ukraine", "Chernivtsi, Ukraine", "Ivano-Frankivsk, Ukraine",
    "Kherson, Ukraine", "Khmelnytskyi, Ukraine", "Kropyvnytskyi, Ukraine", "Luhansk, Ukraine",
    "Mykolaiv, Ukraine", "Poltava, Ukraine", "Rivne, Ukraine", "Sumy, Ukraine",
    "Ternopil, Ukraine", "Uzhhorod, Ukraine", "Zhytomyr, Ukraine", "Volyn, Ukraine"
];

const Location = ({ value, onKeyPress }) => {
    const dispatch = useDispatch();
    const [suggestions, setSuggestions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef();
    const suggestionRefs = useRef([]);

    const handleFocus = () => {
        if (value === "") dispatch(setLocation(""));
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!inputRef.current?.contains(document.activeElement)) {
                setSuggestions([]);
                setHighlightedIndex(-1);
                if (value.trim() === "") dispatch(setLocation(""));
            }
        }, 100);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        dispatch(setLocation(val));
        const filtered = cities.filter(c =>
            c.toLowerCase().includes(val.toLowerCase())
        );
        setSuggestions(filtered);
        setHighlightedIndex(-1);
    };

    const handleSelect = (city) => {
        dispatch(setLocation(city));
        setSuggestions([]);
        setHighlightedIndex(-1);

    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && onKeyPress) {
            onKeyPress(e);
        }

        if (suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex(prev => {
                const next = prev < suggestions.length - 1 ? prev + 1 : 0;
                suggestionRefs.current[next]?.scrollIntoView({ block: "nearest" });
                return next;
            });
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex(prev => {
                const next = prev > 0 ? prev - 1 : suggestions.length - 1;
                suggestionRefs.current[next]?.scrollIntoView({ block: "nearest" });
                return next;
            });
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0) handleSelect(suggestions[highlightedIndex]);
        } else if (e.key === "Escape") {
            setSuggestions([]);
            setHighlightedIndex(-1);
        }
    };

    const isPlaceholder = value === "";

    return (
        <div className={css.location} ref={inputRef}>
            <p className={css.label}>Location</p>
            <div className={css.locationField}>
                <svg
                    className={css.icon}
                    style={{ fill: isPlaceholder ? "#6C717B" : "#101828" }}
                >
                    <use href={`${icons}#icon-location`} />
                </svg>
                <input
                    type="text"
                    className={css.locationInput}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="City"
                    style={{ color: value === "" ? "#6C717B" : "#101828" }}
                />
                {suggestions.length > 0 && (
                    <div className={css.suggestions}>
                        {suggestions.map((s, index) => (
                            <div
                                key={s}
                                ref={el => suggestionRefs.current[index] = el}
                                className={`${css.suggestionItem} ${highlightedIndex === index ? css.highlighted : ""}`}
                                onMouseDown={() => handleSelect(s)}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Location;