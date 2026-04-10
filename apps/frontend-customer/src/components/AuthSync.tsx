import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../store/slices/authSlice';

export const AuthSync: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken();
                dispatch(
                    setUser({
                        user: {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                        },
                        idToken,
                    })
                );
            } else {
                dispatch(setUser({ user: null, idToken: null }));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return null;
};
