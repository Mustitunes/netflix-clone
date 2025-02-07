import Head from "next/head";
import NavBar from "../../components/nav/Navbar";
import SectionCards from "../../components/card/section-card";
import styles from "../../styles/MyList.module.css";
import { redirectUser } from "../../utils/redirectUser";
import { getMyList } from "../../lib/videos";

export async function getServerSideProps(context) {
    const { userId, token } = await redirectUser(context);

    if (!userId) {
        return {
            props: {},
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    const videos = await getMyList(userId, token);
    return {
        props: {
            myListVideos: videos,
        },
    };
}
const MyList = ({ myListVideos }) => {
    return (
        <div>
            <Head>
                <title>My list</title>
            </Head>
            <main className={styles.main}>
                <NavBar />
                <div className={styles.sectionWrapper}>
                    <SectionCards
                        title="My List"
                        videos={myListVideos}
                        size="small"
                        shouldWrap
                        shouldScale={false}
                    />
                </div>
            </main>
        </div>
    );
};
export default MyList;