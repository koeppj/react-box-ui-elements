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
    expriresIn: number | null;
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
    const [expiresIn, setExpiresIn] = useState<number | null>(null);
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
        const init = async () => {
            const token = await tokenStorage.tokenPresent();
            if (token) {
                // Previously logged in.  Refresh if necessary and set the props
            }
            else {
                // Not logged in.  Run the login flow
                await runLoginFlow();
            }
        };
        init();
    }, []);

    const getToken = useCallback(async (): Promise<string| null> => {
        // If the token is expired, refresh it

        // return the token
        return Promise.resolve("test");
    }, []);

    const runLoginFlow = async () => {
        const authUrl = boxOAuth.getAuthorizeUrl({redirectUri: `${window.location.origin}/auth`});
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;

        const popup = window.open(authUrl, 'boxauth', `width=${width},height=${height},left=${left},top=${top}`);

        if (!popup) {
            setLastError('Popup blocked');
            return Promise.resolve();
        }
  
        return Promise.resolve();
    }

    const login = useCallback(async () => {
        return runLoginFlow();
    }, []);

    const logout = useCallback(async () => {
        setIsAuthenticated(false);  
        setAccessToken(null);
        setExpiresIn(null);
        setLastError("Loggedf Out");
        setClient(null);
        tokenStorage.clear(); 
    }, []);

    const contextValue:AuthContextType = useMemo(() => ({
        isAuthenticated,
        accessToken: getToken,
        client: client!,
        lastError,
        expriresIn: expiresIn,
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
