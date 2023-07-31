import { createContext, useState } from "react";
import { User } from "@/types/user.type";
import { getAccessTokenFromLS, getProfileFromLS } from "src/utils/auth";

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  userInfo: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  reset: () => void
}

export const getInitialAppContext: () => AppContextInterface = () => {
  const userInLS = getProfileFromLS();
  return {
    isAuthenticated: Boolean(getAccessTokenFromLS()),
    setIsAuthenticated: () => null,
    userInfo: userInLS?.data?.data,
    setProfile: () => null,
    extendedPurchases: [],
    setExtendedPurchases: () => null,
    reset: () => null
  };
};

const initialAppContext = getInitialAppContext();

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({
  children,
  defaultValue = initialAppContext
}: {
  children: React.ReactNode
  defaultValue?: AppContextInterface
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultValue.isAuthenticated);
  const [userInfo, setProfile] = useState<User | null>(defaultValue.userInfo);

  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userInfo,
        setProfile,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
