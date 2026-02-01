import { useNavigate } from "react-router-dom";
import css from "./HomePage.module.css";
import Header from "../../components/Header/Header";


const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />

            <section className={css.hero}>
                <div className={css.heroWrapper}>
                    <div className={css.container}>
                        <div className={css.content}>
                            <h1 className={css.title}>Campers of your dreams</h1>
                            <h2 className={css.subtitle}>
                                You can find everything you want in our catalog
                            </h2>
                            <button
                                type="button"
                                className={css.button}
                                onClick={() => navigate("/catalog")}
                            >
                                View Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
