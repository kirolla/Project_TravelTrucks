import { NavLink, useLocation } from "react-router-dom";
import css from "./Header.module.css";

const Header = () => {
    const location = useLocation();

    const isCamperDetailsPage = location.pathname.includes("/camper/");

    return (
        <header className={css.header}>
            <NavLink to="/" className={css.logo}>
                <span>T</span>
                <span>r</span>
                <span>a</span>
                <span>v</span>
                <span>e</span>
                <span>l</span>
                <span className={css.trucks}>T</span>
                <span className={css.trucks}>r</span>
                <span className={css.trucks}>u</span>
                <span className={css.trucks}>c</span>
                <span className={css.trucks}>k</span>
                <span className={css.trucks}>s</span>
            </NavLink>

            <nav className={css.nav}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? `${css.link} ${css.active}` : css.link
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/catalog"
                    className={`${css.link} ${isCamperDetailsPage || location.pathname === "/catalog" ? css.active : ""
                        }`}
                >
                    Catalog
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;