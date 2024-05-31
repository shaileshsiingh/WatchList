


import classes from './Signup.module.css';
import React, { Fragment, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAction } from '../../storeRedux/authReducer';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPass, setConfPass] = useState('');
    const [isCursorAllow, setIsCursorAllow] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const redirect = useNavigate();
    const dispatch = useDispatch();

    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    };

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
        setIsCursorAllow(false);
    };

    const confPassChangeHandler = (e) => {
        setConfPass(e.target.value);
        setIsCursorAllow(false);
    };

    const switchAuthModeHandler = () => {
        setIsLogin((prev) => !prev);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!isLogin && confPass !== password) {
            return alert('Confirm password and password do not match');
        }
        let url;
        if (isLogin) {
          url =
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCGU_Jh9DkFE0kC10gMbuAFtAM1Sz33lvM';
        } else {
          url =
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCGU_Jh9DkFE0kC10gMbuAFtAM1Sz33lvM';
        }

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            alert(data.error.message);
        } else {
            const data = await response.json();
            localStorage.setItem('token', data.idToken); // Store authentication token in localStorage
            localStorage.setItem('userEmail', email); // Store user's email in localStorage
            redirect('/'); // Redirect to home page after successful signup/login
            dispatch(authAction.login({ email: email }));
        }
    };

    return (
        <Fragment>
            <section className={classes.auth}>
                <h1>{isLogin ? 'Login' : 'Create new account'}</h1>
                <form onSubmit={submitHandler}>
                    <div className={classes.control}>
                        <label htmlFor='email'>Your Email</label>
                        <input type='text' onChange={emailChangeHandler} value={email} />
                    </div>
                    <div className={classes.control}>
                        <label htmlFor='password'>Your Password</label>
                        <input type='password' onChange={passwordChangeHandler} value={password} />
                    </div>
                    {!isLogin && (
                        <div className={classes.control}>
                            <label htmlFor='confpassword'>Confirm Password</label>
                            <input type='password' onChange={confPassChangeHandler} value={confPass} />
                        </div>
                    )}
                    <div className={classes.actions}>
                        
                        <button type='submit' style={{ cursor: isCursorAllow ? 'not-allowed' : 'pointer' }}>
                            {isLogin ? 'Login' : 'Create Account'}
                        </button>
                        <button type='button' className={classes.toggle} onClick={switchAuthModeHandler}>
                            {isLogin ? "Don't have an account? Sign Up" : 'Login with an existing account'}
                        </button>
                    </div>
                </form>
            </section>
        </Fragment>
    );
};

export default SignUp;
