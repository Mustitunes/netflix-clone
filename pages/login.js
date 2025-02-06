import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/login.module.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";


import { magic } from "../lib/magic-client";


const Login = () => {

    const [email, setEmail] = useState('')
    const [userMsg, setUserMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const router = useRouter()

    useEffect(() => {
        const handleComplete = () => {
            setIsLoading(false);
        }
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routerChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        }
    }, [router]);



    const handleOnChangeEmail = (e) => {
        setUserMsg("")
        console.log(e);
        const email = e.target.value;
        setEmail(email);
    };


    const handleLoginWithEmail = async (e) => {
        console.log("hi");
        e.preventDefault();

        if (email) {
            if (email === "mustafa.kck@live.de") {

                //  log in a user by their email
                try {

                    setIsLoading(true);
                    const didToken = await magic.auth.loginWithMagicLink({
                        email,
                    });
                    console.log({ didToken });

                    if (didToken) {
                        const response = await fetch("/api/login", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${didToken}`,
                                "Content-Type": "application/json",
                            },
                        });

                        const loggedInResponse = await response.json();
                        if (loggedInResponse.done) {
                            router.push("/");
                        } else {
                            setIsLoading(false);
                            setUserMsg("Something went wrong logging in");
                        }
                    }
                } catch (error) {
                    // Handle errors if required!
                    setIsLoading(false)
                    console.error("Something went wrong logging in", error);
                }

            } else {
                setIsLoading(false)
                setUserMsg("Something went wrong logging in");
            }
        } else {
            // show user message
            setIsLoading(false)
            setUserMsg("Enter a valid email adress");
        }

    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Nextflix SingIn</title>
            </Head>


            <header className={styles.header}>

                <div className={styles.headerWrapper}>
                    <Link href='/' legacyBehavior>
                        <a className={styles.logoLink}>

                            <div className={styles.logoWrapper}>
                                <Image
                                    src={'/static/netflix.svg'}
                                    alt='Netflix logo'
                                    width={128}
                                    height={34}
                                />
                            </div>
                        </a>
                    </Link>
                </div>

            </header>


            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                    <h1 className={styles.signinHeader}>Sign In</h1>
                    <input
                        type="text"
                        placeholder="Email address"
                        className={styles.emailInput}
                        onChange={handleOnChangeEmail}
                    />
                    <p className={styles.userMsg}>{userMsg}</p>
                    <button
                        onClick={handleLoginWithEmail}
                        className={styles.loginBtn}
                    >
                        <p>{isLoading ? 'Loading...' : 'Sing In'}</p>
                    </button>
                </div>
            </main>

        </div>
    )
};

export default Login;