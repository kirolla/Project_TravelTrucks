import React from "react";
import { useDispatch } from "react-redux";
import { toggleEquipment } from "../../redux/slices/filtersSlice";
import icons from "../../images/icons.svg";
import css from "./CatalogEquipment.module.css";

const equipmentOptions = [
    { id: "AC", label: "AC", icon: "icon-ac" },
    { id: "automatic", label: "Automatic", icon: "icon-automatic" },
    { id: "kitchen", label: "Kitchen", icon: "icon-kitchen" },
    { id: "TV", label: "TV", icon: "icon-tv" },
    { id: "bathroom", label: "Bathroom", icon: "icon-bathroom" },
    { id: "radio", label: "Radio", icon: "icon-radio" },
    { id: "refrigerator", label: "Refrigerator", icon: "icon-refrigerator" },
    { id: "microwave", label: "Microwave", icon: "icon-microwave" },
    { id: "gas", label: "Gas", icon: "icon-gas" },
    { id: "water", label: "Water", icon: "icon-water" },
];

const CatalogEquipment = ({ activeEquipment, className }) => {
    const dispatch = useDispatch();

    const handleToggleEquipment = (id) => {
        dispatch(toggleEquipment(id));
    };

    return (
        <section className={`${css.section} ${className ?? ""}`}>
            {/* Заголовок фильтров */}
            <p className={css.filtersTitle}>Filters</p>

            {/* Заголовок блока оборудования */}
            <p className={css.title}>Vehicle equipment</p>
            <div className={css.divider}></div>

            {/* Сетка кнопок оборудования */}
            <div className={css.grid}>
                {equipmentOptions.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`${css.item} ${activeEquipment.includes(item.id) ? css.active : ""}`}
                        onClick={() => handleToggleEquipment(item.id)}
                    >
                        <svg className={css.icon}>
                            <use href={`${icons}#${item.icon}`} />
                        </svg>
                        <span className={css.label}>{item.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CatalogEquipment;
