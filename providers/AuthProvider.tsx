import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getUser,
  signInWithEmailAndPassword,
  signInWithGoogle,
  signOut,
  signUpWithEmailAndPassword,
} from "../services/userApi";
import { useSnackbars } from "./SnackbarProvider";

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isPremium: boolean;
  isEmailVerified: boolean;
  lastLogin: Date;
}

type AuthStatus = "loading" | "connected" | "not-connected" | "error";

type AuthValue = {
  user: User | null;
  status: AuthStatus;
  logout: () => void;
  login: (email: string, password: string, cb: Function) => void;
  register: (
    name: string,
    email: string,
    password: string,
    cb: Function
  ) => void;
  loginWithGoogle: (token: string, cb: Function) => void;
  fetchCurrentUser: () => void;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const snackbarsService = useSnackbars();

  const router = useRouter();

  useEffect(() => {
    setStatus("loading");
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = () => {
    getUser((user: User) => {
      setUser(user);
      setStatus("connected");
    }).catch((err: Error) => {
      setStatus("not-connected");

      // TODO: there is probably a better way to get NotSignedInRoutes
      if (
        router.route !== "/" &&
        router.route !== "/auth/sign-in" &&
        router.route !== "/auth/sign-up" &&
        router.route !== "/auth/reset-password"
      ) {
        snackbarsService?.addAlert({
          message: "An error occured while fetching user.",
          severity: "error",
        });
      }
    });
  };

  const logout = async () => {
    await signOut(() => {
      setUser(null);
      setStatus("not-connected");
      router.push("/");
    }).catch((err: Error) => {
      setStatus("not-connected");
      snackbarsService?.addAlert({
        message: "An error occured while signing out",
        severity: "error",
      });
    });
  };

  const login = async (email: string, password: string, cb: Function) => {
    setStatus("loading");

    await signInWithEmailAndPassword(email, password, (user: User) => {
      cb();
      setUser(user);
      setStatus("connected");
      snackbarsService?.addAlert({
        message: !user.lastLogin ? "Welcome to ImLazy app !" : "Welcome back !",
        severity: "success",
      });

      router.push("/dashboard");
    }).catch((err: Error) => {
      cb();

      setUser(null);
      setStatus("not-connected");
      //TODO: add internet connection checker and customize message error
      snackbarsService?.addAlert({
        message:
          "Check your internet connection or email/password might be invalid",
        severity: "error",
      });
    });
  };

  const loginWithGoogle = async (token: string, cb: Function) => {
    setStatus("loading");
    await signInWithGoogle(token, (user: User) => {
      cb();
      setUser(user);
      setStatus("connected");

      snackbarsService?.addAlert({
        message: !user.lastLogin ? "Welcome to ImLazy app !" : "Welcome back !",
        severity: "success",
      });

      router.replace("/dashboard");
    }).catch((err: Error) => {
      cb();
      setUser(null);
      setStatus("not-connected");
      snackbarsService?.addAlert({
        message: "An error occured while signing in with Google",
        severity: "error",
      });
    });
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    cb: Function
  ) => {
    setStatus("loading");

    await signUpWithEmailAndPassword(name, email, password, (user: User) => {
      cb();
      setUser(user);
      setStatus("connected");
      snackbarsService?.addAlert({
        message: "Welcome to ImLazy app !",
        severity: "success",
      });

      router.replace("/dashboard");
    }).catch((err: Error) => {
      cb();

      setUser(null);
      setStatus("not-connected");

      snackbarsService?.addAlert({
        message:
          "An error occured while signing up. This email might be used already",
        severity: "error",
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        logout,
        login,
        loginWithGoogle,
        register,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
