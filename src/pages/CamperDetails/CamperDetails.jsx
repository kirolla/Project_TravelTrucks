import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import icons from "../../images/icons.svg";
import css from "./CamperDetails.module.css";

const CamperDetails = () => {
    const { id } = useParams();

    const [camper, setCamper] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("features");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bookingDate, setBookingDate] = useState(null);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ ДОБАВЛЕНО для Loader в форме

    useEffect(() => {
        const fetchCamper = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await axios.get(
                    `https://66b1f8e71ca8ad33d4f5f63e.mockapi.io/campers/${id}`
                );
                setCamper(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load camper details");
            } finally {
                setLoading(false);
            }
        };

        fetchCamper();
    }, [id]);

    const formatPrice = (price) => {
        return Number(price || 0).toFixed(2).replace('.', ',');
    };

    const formatFormType = (formType) => {
        if (!formType) return "";
        switch (formType) {
            case "panelTruck":
                return "Panel truck";
            case "fullyIntegrated":
                return "Fully integrated";
            case "alcove":
                return "Panel truck";
            default:
                return formType.charAt(0).toUpperCase() + formType.slice(1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const latinNameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!latinNameRegex.test(name)) {
            alert("Name must be in Latin letters only (no Cyrillic)");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Email must be in Latin letters and a valid email format");
            return;
        }

        if (!bookingDate) {
            alert("Please select a booking date");
            return;
        }

        setIsSubmitting(true);

        try {

            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log({ name, email, bookingDate, comment });
            alert("Booking submitted successfully!");

            setName("");
            setEmail("");
            setBookingDate(null);
            setComment("");
        } catch (error) {
            alert("Failed to submit booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (error) return <p>{error}</p>;
    if (!camper) return null;

    return (
        <>
            <Header />
            <main className={css.details}>
                <div className={css.container}>

                    <h1 className={css.title}>{camper.name}</h1>

                    <div className={css.meta}>
                        <div className={css.rating}>
                            <svg className={css.star}>
                                <use href={`${icons}#icon-Star`} />
                            </svg>
                            <span className={css.ratingText}>
                                {camper.rating} ({camper.reviews?.length} Reviews)
                            </span>
                        </div>
                        <div className={css.location}>
                            <svg className={css.mapIcon}>
                                <use href={`${icons}#icon-map`} />
                            </svg>
                            <span>{camper.location}</span>
                        </div>
                    </div>


                    <p className={css.price}>€{formatPrice(camper?.price)}</p>

                    {camper.gallery?.length > 0 && (
                        <div className={css.gallery}>
                            {camper.gallery.map((img, idx) => (
                                <div key={idx} className={css.galleryItem}>
                                    <img
                                        src={img.original}
                                        alt={`${camper.name} ${idx + 1}`}
                                        className={css.galleryImage}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {camper.description && (
                        <p className={css.description}>{camper.description}</p>
                    )}

                    <div className={css.tabsWrapper} style={{ marginTop: "60px" }}>
                        <div className={css.tabs} style={{ gap: "40px" }}>
                            <div
                                className={`${css.tab} ${activeTab === "features" ? css.active : ""
                                    }`}
                                onClick={() => setActiveTab("features")}
                            >
                                Features
                            </div>
                            <div
                                className={`${css.tab} ${activeTab === "reviews" ? css.active : ""
                                    }`}
                                onClick={() => setActiveTab("reviews")}
                            >
                                Reviews
                            </div>
                        </div>

                        <div className={css.tabLineWrapper} style={{ marginTop: "24px" }}>
                            <div className={css.tabLine} />
                            <div
                                className={css.activeTabLine}
                                style={{
                                    left: activeTab === "features" ? "0" : "calc(100% + 40px)",
                                }}
                            />
                        </div>
                    </div>

                    <div className={css.vehicleWrapper} style={{ marginTop: "44px", display: "flex" }}>
                        <div className={activeTab === "features" ? css.vehicleLeft : css.vehicleLeftReviews}>
                            {activeTab === "features" && (
                                <>
                                    <div className={css.vehicleIcons}>
                                        {[
                                            { key: "AC", label: "AC", icon: "icon-ac" },
                                            {
                                                key: "transmission",
                                                label: "Automatic",
                                                icon: "icon-automatic",
                                                condition: camper.transmission === "automatic",
                                            },
                                            { key: "kitchen", label: "Kitchen", icon: "icon-kitchen" },
                                            { key: "TV", label: "TV", icon: "icon-tv" },
                                            { key: "bathroom", label: "Bathroom", icon: "icon-bathroom" },
                                            { key: "radio", label: "Radio", icon: "icon-radio" },
                                            { key: "refrigerator", label: "Refrigerator", icon: "icon-refrigerator" },
                                            { key: "microwave", label: "Microwave", icon: "icon-microwave" },
                                            { key: "gas", label: "Gas", icon: "icon-gas" },
                                            { key: "water", label: "Water", icon: "icon-water" },
                                        ].map((eq) => {
                                            const show = eq.condition ?? camper[eq.key];
                                            if (!show) return null;
                                            return (
                                                <div key={eq.key} className={css.vehicleIcon}>
                                                    <svg className={css.icon}>
                                                        <use href={`${icons}#${eq.icon}`} />
                                                    </svg>
                                                    <span>{eq.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className={css.vehicleInfoWrapper}>
                                        <h3 className={css.vehicleTitle}>Vehicle details</h3>
                                        <div className={css.vehicleLine} />

                                        <div className={css.vehicleInfo}>
                                            <div className={css.infoLeft}>
                                                <p className={css.infoLabel}>Form</p>
                                                <p className={css.infoLabel}>Length</p>
                                                <p className={css.infoLabel}>Width</p>
                                                <p className={css.infoLabel}>Height</p>
                                                <p className={css.infoLabel}>Tank</p>
                                                <p className={css.infoLabel}>Consumption</p>
                                            </div>

                                            <div className={css.infoRight}>
                                                <p className={css.infoValue}>
                                                    {formatFormType(camper.form)}
                                                </p>
                                                <p className={css.infoValue}>{camper.length}</p>
                                                <p className={css.infoValue}>{camper.width}</p>
                                                <p className={css.infoValue}>{camper.height}</p>
                                                <p className={css.infoValue}>{camper.tank}</p>
                                                <p className={css.infoValue}>{camper.consumption}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === "reviews" && camper.reviews && (
                                <div className={css.reviewsContainer}>
                                    {camper.reviews.map((review, index) => (
                                        <div
                                            key={index}
                                            className={css.reviewItem}
                                            style={{ marginBottom: index < camper.reviews.length - 1 ? "44px" : "0" }}
                                        >
                                            <div className={css.reviewHeader}>
                                                <div className={css.reviewAvatar}>
                                                    {review.reviewer_name.charAt(0)}
                                                </div>
                                                <div className={css.reviewNameRating}>
                                                    <div className={css.reviewName}>
                                                        {review.reviewer_name}
                                                    </div>
                                                    <div className={css.reviewStars}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={css.starIcon}
                                                                style={{
                                                                    fill: i < review.reviewer_rating ? "#FFC531" : "#F2F4F7"
                                                                }}
                                                            >
                                                                <use href={`${icons}#icon-Star`} />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={css.reviewComment}>
                                                {review.comment}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={css.vehicleRight}>
                            <div className={css.bookingWrapper}>
                                <h3 className={css.bookingTitle}>Book your campervan now</h3>
                                <p className={css.bookingSubtitle}>
                                    Stay connected! We are always ready to help you.
                                </p>

                                <form className={css.bookingForm} onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Name*"
                                        className={css.bookingInput}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email*"
                                        className={css.bookingInput}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <DatePicker
                                        selected={bookingDate}
                                        onChange={(date) => setBookingDate(date)}
                                        placeholderText="Booking date*"
                                        minDate={new Date()}
                                        className={css.bookingInput}
                                        required
                                    />
                                    <textarea
                                        placeholder="Comment"
                                        className={css.bookingTextarea}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={4}
                                    />
                                    <button
                                        type="submit"
                                        className={css.sendButton}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}>
                                                <Loader size="small" inline={true} />
                                                Sending...
                                            </span>
                                        ) : (
                                            "Send"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CamperDetails;