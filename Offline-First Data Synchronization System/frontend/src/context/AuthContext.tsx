import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { User } from "../types/auth";

import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from "../services/authService";


interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (
    username: string,
    password: string
  ) => Promise<void>;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
}


const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    async function restoreSession() {
      const token =
        localStorage.getItem(
          "access_token"
        );

      const savedUser =
        localStorage.getItem(
          "current_user"
        );


      /*
       * No token = definitely logged out.
       */
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }


      /*
       * Immediately restore the cached user.
       * This prevents the Dashboard from briefly
       * thinking the user is unauthenticated.
       */
      if (savedUser) {
        try {
          const parsedUser =
            JSON.parse(savedUser);

          setUser(parsedUser);
        } catch {
          localStorage.removeItem(
            "current_user"
          );
        }
      }


      /*
       * Verify the token with backend.
       */
      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);

        localStorage.setItem(
          "current_user",
          JSON.stringify(currentUser)
        );
      } catch (error: any) {
        console.error(
          "Session restore failed:",
          error
        );


        /*
         * Token is invalid/expired.
         */
        if (
          error?.response?.status === 401
        ) {
          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "current_user"
          );

          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }


    restoreSession();
  }, []);


  async function login(
    username: string,
    password: string
  ) {
    const response =
      await loginRequest({
        username,
        password,
      });


    /*
     * Save token.
     */
    localStorage.setItem(
      "access_token",
      response.access_token
    );


    /*
     * Save authenticated user.
     */
    if (response.user) {
      localStorage.setItem(
        "current_user",
        JSON.stringify(response.user)
      );

      setUser(response.user);
    } else {
      /*
       * If backend doesn't return user,
       * fetch it from /me.
       */
      const currentUser =
        await getCurrentUser();

      localStorage.setItem(
        "current_user",
        JSON.stringify(currentUser)
      );

      setUser(currentUser);
    }
  }


  async function register(
    username: string,
    email: string,
    password: string
  ) {
    await registerRequest({
      username,
      email,
      password,
    });


    /*
     * Automatically login after
     * successful registration.
     */
    await login(
      username,
      password
    );
  }


  function logout() {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "current_user"
    );

    setUser(null);
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context =
    useContext(AuthContext);


  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }


  return context;
}