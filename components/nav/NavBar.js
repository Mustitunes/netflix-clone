import styles from "./nav/NavBar.module.css";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import Image from "next/image";

// Entferne den direkten Import von `magic`
// import { magic } from "../../lib/magic-client";

const Navbar = () => {
    const router = useRouter();
    const [showDropDown, setShowDropDown] = useState(false);
    const [username, setUsername] = useState('');
    const [didToken, setDidToken] = useState('');
    const [magicInstance, setMagicInstance] = useState(null); // Neuer State für `magic`

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("../../lib/magic-client").then(({ magic }) => {
                setMagicInstance(magic);
            });
        }
    }, []);

    useEffect(() => {
        async function getUsername() {
            if (!magicInstance) return; // Warten, bis `magic` geladen ist
            
            try {
                const { email } = await magicInstance.user.getMetadata();
                const didToken = await magicInstance.user.getIdToken();
                if (email) {
                    setUsername(email);
                    setDidToken(didToken);
                }
            } catch (error) {
                console.error("Error retrieving email:", error);
            }
        }
        getUsername();
    }, [magicInstance]); // Hier `magicInstance` als Dependency hinzufügen

    const handleOnClickHome = (e) => {
        e.preventDefault();
        router.push('/');
    }

    const handleOnClickMyList = (e) => {
        e.preventDefault();
        router.push('/browse/my-list');
    }

    const handleShowDropDown = (e) => {
        e.preventDefault();
        setShowDropDown(!showDropDown);
    }

    const handleSignout = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${didToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response');
            }

            const res = await response.json();

            if (!response.ok) {
                throw new Error(res.message || 'Logout failed');
            }

            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error.message);
            router.push('/login');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
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
                <ul className={styles.navItems}>
                    <li className={styles.navItem} onClick={handleOnClickHome} >Home</li>
                    <li className={styles.navItem2} onClick={handleOnClickMyList} >My List</li>
                </ul>

                <nav className={styles.navContainer}>
                    <div>
                        <button className={styles.usernameBtn} onClick={handleShowDropDown}>
                            <p className={styles.username}>{username}</p>
                            <Image
                                src={'/static/expand_more.svg'}
                                alt='Expand dropdown'
                                width={24}
                                height={24}
                            />
                        </button>

                        {showDropDown &&
                            (<div className={styles.navDropdown}>
                                <div>
                                    <a onClick={handleSignout} className={styles.linkName}>Sign out</a>
                                    <div className={styles.lineWrapper}></div>
                                </div>
                            </div>
                            )}
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;
