import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db, storage } from "./firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore/lite";
import { useEffect, useRef, useState } from "react";
import { em } from "@mantine/core";

const formatAuthUser = (user) => ({
    uid: user.uid,
    email: user.email,
    username: user.displayName, 
    urlPhoto: user.photoURL 
});

export default function useFirebaseAuth(){
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState([])
    const savedProduct = useRef([]);
    
    const authStateChanged = async(authState) => {
        if (!authState) {
            setUser(null);
            setIsAuthenticated(false);
            return;
        }
        console.log("AUTHSTATE", authState)
        var formatUser = formatAuthUser(authState)
        setUser(formatUser);
        setIsAuthenticated(true);
        console.log("USER", user, isAuthenticated)
    }

    const signInWithGoogle = async() => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log("USER DATA", user)
            AddUserData(user.uid, user.displayName, user.email, user.photoURL)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
    }

    const signInWithEmail = async(values) => {
        console.log("ISINYA", values)
        const email = values.email;
        const password = values.password;
        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            console.log("USER", user)
        }).catch((error)=>{
            console.log("ERROR SIGNIN", error)
        })
    }

    const createUserWithEmail = async(values)=>{
        console.log("values", values);
        const name = values.name;
        const email = values.email;
        const password = values.password;
        await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            console.log("USER", userCredential)
            AddUserData(user.uid, name, user.email, null)
        }).catch((error) =>{
            console.log("ERROR", error)
        })
    }

    const SendPasswordResetEmail = async(values) => {
        const email = values.email;
        await sendPasswordResetEmail(auth, email).then(()=>{
            console.log("Email has been sent!")
        }).catch((error)=>{
            console.log("ERROR Send email ", error.message)
        })
    } 

    const signOut = () =>
        auth.signOut(auth).then(() => {
        console.log("sign out");
        setUser(null);
        
        }).catch((error) => {
        console.log(error);
    });

    const AddUserData = async(uid, displayName, email, urlPhoto ) => {
        await setDoc(doc(db, "UserData", uid), {
            username: displayName,
            uid: uid,
            email: email, 
            photoUrl: urlPhoto
        }).then(()=>{
            console.log("SUCCESS");
        }).catch((error) => {
            console.log("ERROR", error)
        })
    }

    
    const fetchInitialProducts = async () => {
        const productsCollection = collection(db, "ProductData"); // Ganti dengan nama koleksi produk Anda
        const querySnapshot = await getDocs(productsCollection);
        const productsData = [];

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            productsData.push(product);
        });

        setProducts(productsData);
        savedProduct.current =productsData;
        console.log("PRO", productsData, savedProduct.current)
        // return productsData;
    };

    useEffect(() => {
        fetchInitialProducts();
        const unsubscribe = auth.onAuthStateChanged(authStateChanged);
        return () => unsubscribe();
    }, []);
    
    return {
        signInWithGoogle, 
        signOut,
        user, 
        products,
        savedProduct,
        isAuthenticated,
        createUserWithEmail, 
        signInWithEmail,
        SendPasswordResetEmail,
        fetchInitialProducts
    }
}
