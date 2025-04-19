import React, { useState } from 'react'
import styles from './signupPage.module.css'
import { useAuthStore } from '../store/useAuthStore'
import { Navigate, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [seePass, setSeePass] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [showError, setShowError] = useState(false);

    const { authError, signup } = useAuthStore();
    const navigate = useNavigate();




    const handleSignup = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !pass) {
            setShowError(true);
            setTimeout(() => setShowError(false), 500);
            return;
        }

        const result = await signup({ fullName, email, password: pass });

        if (result && result.success) {
            console.log("Signup successful:", result);
            setShowError(false);
            return <Navigate to="/dashboard" />;
        } else {
            setShowError(true);
            setPass('');
            console.error("Signup failed:", authError || result?.error);
        }
    };

    const toggleSeePass = (e) => {
        setSeePass(!seePass);
    }

    return (
        <div className={styles.container} >

            <div className={styles.leftSide}>
                <img src="/signupImg.jpg" alt="STUDIFY Logo" />

            </div>
            <div className={styles.rightSide}>

                <form onSubmit={handleSignup}>
                    <div className={styles.formTitle}>
                        <h2>Welcome To</h2>
                        <div className={styles.logo}>STUDIFY</div>
                    </div>


                    <div className={showError ? `${styles.inputField} ${styles.shake}` : styles.inputField}>

                        <div className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                            </svg>

                        </div>



                        <div className={styles.field}>
                            
                            <input placeholder='Name' type='text'
                                value={fullName} onChange={(e) => setFullName(e.target.value)} />

                        </div>
                    </div>

                    <div className={showError ? `${styles.inputField} ${styles.shake}` : styles.inputField}>

                        <div className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" stroke="white" strokeWidth="1.5" >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        </div>



                        <div className={styles.field}>
                            <input placeholder='Email' type='email'
                                value={email} onChange={(e) => setEmail(e.target.value)} />

                        </div>
                    </div>
                    <div className={showError ? `${styles.inputField} ${styles.shake}` : styles.inputField}>
                        <div className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" stroke='white' strokeWidth="1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                            </svg>
                        </div>

                        <div className={styles.field}>
                            <input placeholder='Password' type={seePass ? "text" : "password"}
                                value={pass} onChange={(e) => setPass(e.target.value)} />

                        </div>
                        <div className={styles.icon} onClick={toggleSeePass}>
                            {
                                seePass ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                            }


                        </div>
                    </div>

                    <div className={styles.errorZone}>
                        {showError && (
                            <div className={styles.error}>
                                No field must be empty.
                            </div>
                        )}
                    </div>

                    <button className={styles.btn} type='submit'>Sign Up</button>

                    <p onClick={() => navigate('/login')}>Already have an account? Login</p>
                </form>

            </div>



        </div>
    )
}

export default SignupPage;