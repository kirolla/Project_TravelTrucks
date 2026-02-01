import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Location from "../../components/Location/Location";
import CamperCard from "../../components/CamperCard/CamperCard";
import CatalogEquipment from "../../components/CatalogEquipment/CatalogEquipment";
import Loader from "../../components/Loader/Loader";
import {
    fetchCampers,
    loadMore,
    clearSearchResults,
    resetSearch,
    resetVisibleCount,
} from "../../redux/slices/campersSlice";
import {
    setLocation,
    setVehicleType,
    toggleEquipment,
    resetFilters,
} from "../../redux/slices/filtersSlice";
import icons from "../../images/icons.svg";
import css from "./Catalog.module.css";

const vehicleTypes = [
    { id: "icon-bi_grid-1x2", label: "Alcove", apiValue: "alcove" },
    { id: "icon-bi_grid", label: "Van", apiValue: "panelTruck" },
    { id: "icon-bi_grid-3x3-gap", label: "Fully Integrated", apiValue: "fullyIntegrated" },
];

const Catalog = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { items: campers, visibleCount, loading, error, searchPerformed } =
        useSelector((state) => state.campers);

    const { location, vehicleType, equipment } =
        useSelector((state) => state.filters);

    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        dispatch(resetSearch());
        dispatch(fetchCampers());

        return () => {
            dispatch(resetVisibleCount());
        };
    }, [dispatch]);

    const handleSearch = async () => {
        console.log("🔍 Starting search with filters:", {
            location,
            vehicleType,
            equipment
        });

        setIsSearching(true);

        dispatch(resetVisibleCount());
        dispatch(clearSearchResults());

        const filters = {
            location: location.trim(),
            vehicleType: vehicleType,
            equipment: equipment,
        };

        console.log("📤 Applying filters for API:", filters);

        try {
            await dispatch(fetchCampers(filters)).unwrap();
            console.log("✅ Search completed successfully");
        } catch (error) {
            console.error("❌ Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            console.log("⌨️ Enter pressed, triggering search");
            handleSearch();
        }
    };

    const selectType = (typeId) => {
        const selectedType = vehicleTypes.find(t => t.id === typeId);
        const newType = vehicleType === selectedType?.apiValue ? null : selectedType?.apiValue;
        console.log("🚐 Selecting vehicle type:", newType);
        dispatch(setVehicleType(newType));
    };

    const handleLoadMore = () => {
        console.log("⬇️ Loading more campers");
        dispatch(loadMore());
    };

    const handleResetFilters = () => {
        console.log("🔄 Resetting all filters");
        dispatch(resetFilters());
        dispatch(clearSearchResults());
        dispatch(resetSearch());
        dispatch(resetVisibleCount());
        dispatch(fetchCampers());
    };

    return (
        <>
            <Header />
            <main className={css.catalog}>
                <div className={css.container}>
                    <aside className={css.filters}>
                        <Location
                            value={location}
                            onKeyPress={handleKeyPress}
                        />

                        <CatalogEquipment
                            activeEquipment={equipment}
                        />

                        <p className={`${css.sectionTitle} ${css.vehicleType}`}>
                            Vehicle type
                        </p>
                        <div className={css.divider}></div>
                        <div className={css.filtersGrid}>
                            {vehicleTypes.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`${css.filterButton} ${vehicleType === item.apiValue ? css.active : ""}`}
                                    onClick={() => selectType(item.id)}
                                >
                                    <svg className={css.filterIcon}>
                                        <use href={`${icons}#${item.id}`} />
                                    </svg>
                                    <span className={css.filterLabel}>{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className={css.searchButtonWrapper}>
                            <button
                                className={css.searchButton}
                                onClick={handleSearch}
                                disabled={loading || isSearching}
                            >
                                {isSearching ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Loader size="small" />
                                        Searching...
                                    </span>
                                ) : (
                                    "Search"
                                )}
                            </button>
                        </div>
                    </aside>

                    <section className={css.rightColumn}>
                        <div className={css.list}>
                            {(loading || isSearching) && campers.length === 0 ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                                    <Loader />
                                </div>
                            ) : error ? (
                                <p className={css.error}>{error}</p>
                            ) : searchPerformed && campers.length === 0 ? (
                                <div className={css.noResults}>
                                    <p>No campers found matching your criteria.</p>
                                    <button
                                        onClick={handleResetFilters}
                                        className={css.resetSearchButton}
                                    >
                                        Clear filters and show all
                                    </button>
                                </div>
                            ) : (
                                campers.slice(0, visibleCount).map((camper) => (
                                    <CamperCard key={camper.id} camper={camper} />
                                ))
                            )}
                        </div>

                        {visibleCount < campers.length && (
                            <div className={css.loadMoreWrapper}>
                                {loading && campers.length > 0 ? (
                                    <Loader size="small" />
                                ) : (
                                    <button
                                        className={css.loadMoreButton}
                                        onClick={handleLoadMore}
                                        disabled={loading || isSearching}
                                    >
                                        Load more
                                    </button>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};

export default Catalog;