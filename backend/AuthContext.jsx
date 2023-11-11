import React, { createContext, useContext } from "react";
import useFirebaseAuth from "../lib/Authentication";

const AuthContext = createContext({
    // signInWithGoogle: async () => {},
    // signOut: async () => {},
     user:null, 
    //  TryCalling:async() => {}
});

export function AuthProvider({ children }) {
  const auth = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
}

// Buat custom hook untuk mengakses konteks autentikasi
export const useAuth = () => useContext(AuthContext);
 