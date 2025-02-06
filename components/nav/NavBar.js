import styles from "../nav/navbar.module.css";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import Image from "next/image";
import { magic } from "../../lib/magic-client";



const Navbar = () => {

    const router = useRouter()

    const [showDropDown, setShowDropDown] = useState(false);
    const [username, setUsername] = useState('');
    const [didToken, setDidToken] = useState('');

    useEffect(() => {
        async function getUsername() {
            try {
                const { email } = await magic.user.getMetadata();
                const didToken = await magic.user.getIdToken();
                console.log({ didToken })
                if (email) {
                    console.log(email);
                    setUsername(email);
                    setDidToken(didToken);
                }
            } catch {
                console.error("Error retrieving email");
            }
        }
        getUsername();
    })


    const handleOnClickHome = (e) => {
        e.preventDefault()
        router.push('/')
    }

    const handleOnClickMyList = (e) => {
        e.preventDefault()
        router.push('/browse/my-list')
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
    
            // Überprüfen, ob die Antwort JSON ist
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response');
            }
    
            // Antwort als JSON parsen
            const res = await response.json();
    
            if (!response.ok) {
                // Fehlerbehandlung für Server-Fehler (z.B. 400, 500)
                throw new Error(res.message || 'Logout failed');
            }
    
            // Erfolgsfall
            console.log('Logout successful:', res.message);
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
                            {/*expand user name*/}
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




    )
}

export default Navbar;