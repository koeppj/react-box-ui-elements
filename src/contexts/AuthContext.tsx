import React, {
    createContext,
    useState,
    useMemo,
    useContext,
    useCallback,
    useEffect,
    ReactNode
  } from 'react';
import { BoxTokenStorageService } from '../utils/BoxLocalStorage';
import { OAuthConfig, BoxOAuth, BoxClient } from 'box-typescript-sdk-gen';
import { environment } from '../environment/environment';


interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: () => Promise<string | null>;
    client: BoxClient;
    lastError: string | null;
    login: () => Promise<void>;
    logout: () => void;
};

interface AuthProviderProps {
    children: ReactNode;
}; 

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [lastError, setLastError] = useState<string | null>(null);
    const [client, setClient] = useState<BoxClient | null>(null);

    const tokenStorage = new BoxTokenStorageService();
    const oauthConfig: OAuthConfig = {
        clientId: environment.BoxClientID,
        clientSecret: environment.BoxClientSecret,
        tokenStorage: tokenStorage,
    };
    const boxOAuth = new BoxOAuth({config: oauthConfig});

    useEffect(() => {
    }, []);

    const getToken = useCallback(async (): Promise<string| null> => {
        return Promise.resolve("test");
    }, []);

    const login = useCallback(async () => {
        return Promise.resolve();
    }, []);

    const logout = useCallback(async () => {
        setIsAuthenticated(false);  
        setAccessToken(null);
        setClient(null);
        tokenStorage.clear(); 
    }, []);

    const contextValue:AuthContextType = useMemo(() => ({
        isAuthenticated,
        accessToken: getToken,
        client: client!,
        lastError,
        login,
        logout
    }), [isAuthenticated, getToken, client, lastError, login, logout]);
        
    return (<div></div>);
    // return (
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
