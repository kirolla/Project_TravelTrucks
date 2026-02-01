import React, { useState } from "react";
import { Link } from "react-router-dom";
import icons from "../../images/icons.svg";
import css from "./CamperCard.module.css";

const CamperCard = ({ camper }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    if (!camper) return null;

    const toggleFavorite = () => setIsFavorite(!isFavorite);

    const hasAutomaticTransmission = camper.transmission === "automatic";

    const formatPrice = (price) => {
        return Number(price || 0).toFixed(2).replace('.', ',');
    };

    return (
        <div className={css.card}>
            <div className={css.imageWrapper}>
                <img
                    src={camper.gallery?.[0]?.thumb || "https://via.placeholder.com/292x320"}
                    alt={camper.name}
                    className={css.image}
                />
            </div>

            <div className={css.info}>
                <div className={css.contentContainer}>
                    <div className={css.topRow}>
                        <div className={css.nameWrapper}>
                            <h2 className={css.name}>{camper.name}</h2>
                        </div>

                        <div className={css.priceFavorite}>
                            <p className={css.price}>€{formatPrice(camper.price)}</p>
                            <button
                                className={`${css.favorite} ${isFavorite ? css.favorited : ""}`}
                                onClick={toggleFavorite}
                                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <svg>
                                    <use href={`${icons}#icon-like`} />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={css.ratingLocationRow}>
                        <div className={css.ratingContainer}>
                            <svg className={css.starIcon} width="16" height="16">
                                <use href={`${icons}#icon-Star`} />
                            </svg>
                            <span className={css.ratingText}>
                                {camper.rating || "0.0"} ({camper.reviews?.length || 0} Reviews)
                            </span>
                        </div>

                        <div className={css.locationContainer}>
                            <svg className={css.locationIcon} width="16" height="16">
                                <use href={`${icons}#icon-location`} />
                            </svg>
                            <span className={css.locationText}>
                                {camper.location || "Location not specified"}
                            </span>
                        </div>
                    </div>

                    <div className={css.descriptionLine}>
                        {camper.description || "No description available."}
                    </div>

                    <div className={css.equipment}>
                        {camper.AC && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-ac`} />
                                </svg>
                                <span>AC</span>
                            </div>
                        )}
                        {hasAutomaticTransmission && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-automatic`} />
                                </svg>
                                <span>Automatic</span>
                            </div>
                        )}
                        {camper.kitchen && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-kitchen`} />
                                </svg>
                                <span>Kitchen</span>
                            </div>
                        )}
                        {camper.TV && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-tv`} />
                                </svg>
                                <span>TV</span>
                            </div>
                        )}
                        {camper.bathroom && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-bathroom`} />
                                </svg>
                                <span>Bathroom</span>
                            </div>
                        )}
                        {camper.radio && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-radio`} />
                                </svg>
                                <span>Radio</span>
                            </div>
                        )}
                        {camper.refrigerator && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-refrigerator`} />
                                </svg>
                                <span>Refrigerator</span>
                            </div>
                        )}
                        {camper.microwave && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-microwave`} />
                                </svg>
                                <span>Microwave</span>
                            </div>
                        )}
                        {camper.gas && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-gas`} />
                                </svg>
                                <span>Gas</span>
                            </div>
                        )}
                        {camper.water && (
                            <div className={css.equipmentItem}>
                                <svg className={css.icon}>
                                    <use href={`${icons}#icon-water`} />
                                </svg>
                                <span>Water</span>
                            </div>
                        )}
                    </div>
                </div>

                <a
                    href={`/catalog/${camper.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className={css.showMoreButton}
                >
                    Show more
                </a>
            </div>
        </div>
    );
};

export default CamperCard;