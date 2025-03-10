import Head from "next/head";
import Banner from "../components/banner/banner";
import Navbar from "../components/nav/NavBar";
import SectionCards from "../components/card/section-card"
import styles from "../styles/Home.module.css";
import {
  getPopularVideos,
  getVideos,
  getWatchItAgainVideos,
} from "../lib/videos";
import { redirectUser } from "../utils/redirectUser";

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

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

  const disneyVideos = await getVideos('disney trailer');

  const travelVideos = await getVideos('indie music');
  const productivityVideos = await getVideos('productivity');

  const popularVideos = await getPopularVideos();



  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
  watchItAgainVideos, }) {

    
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Netflix</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={styles.main}>

          <Navbar />
          <Banner
            videoId="4zH5iYM4wJo"
            title='Clifford the red dog'
            subTitle='a very cute dog'
            imgUrl='/static/clifford.webp'
          />
          <div className={styles.sectionWrapper}>
            <SectionCards title="Disney" videos={disneyVideos} size="large" />
            <SectionCards
              title="Watch it again"
              videos={watchItAgainVideos}
              size="small"
            />
            <SectionCards title="Travel" videos={travelVideos} size="small" />
            <SectionCards
              title="Productivity"
              videos={productivityVideos}
              size="medium"
            />
            <SectionCards title="Popular" videos={popularVideos} size="small" />
          </div>
        </div>

      </div>
    </>
  );
}
