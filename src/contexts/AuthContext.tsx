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
import { useSnackbar } from 'notistack';

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: () => Promise<string | undefined>;
    client: BoxClient;
    lastError: string | null;
    expriresIn: number | undefined;
    eid: string | null;
    login: () => Promise<void>;
    logout: () => void;
};

interface AuthProviderProps {
    children: ReactNode;
}; 

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [expiresAt, setexpiresAt] = useState<number | undefined>(undefined);
    const [lastError, setLastError] = useState<string | null>(null);
    const [client, setClient] = useState<BoxClient | null>(null);
    const [eid, setEid] = useState<string | null>(null);

    const tokenStorage = new BoxTokenStorageService();
    const oauthConfig: OAuthConfig = {
        clientId: environment.BoxClientID,
        clientSecret: environment.BoxClientSecret,
        tokenStorage: tokenStorage,
    };
    const boxOAuth = new BoxOAuth({config: oauthConfig});

    useEffect(() => {
        const init = async () => {
            const token = await tokenStorage.get();
            if (token) {
                try {
                    setClient(new BoxClient({ auth: boxOAuth }));
                    setIsAuthenticated(true);
                    setexpiresAt(tokenStorage.getExpiresAt());
                    setEid(environment.BoxEnterpriseId);
                }
                catch (error) {
                    console.error('Error refreshing token', error);
                    setLastError("Error refreshing token");
                    enqueueSnackbar("Error refreshing token", { variant: 'error' });
                }
            }
        };
        init();
    }, []);

    const getToken = useCallback(async (): Promise<string| undefined> => {
        const lastExpiresAt = tokenStorage.getExpiresAt();
        if (lastExpiresAt && (Date.now() > lastExpiresAt)) {
            const token = await boxOAuth.refreshToken().then((token) => {;
                setexpiresAt(tokenStorage.getExpiresAt());
                setIsAuthenticated(true);
                setEid(environment.BoxEnterpriseId);
                return Promise.resolve(token.accessToken);
            }).catch((error) => {
                console.error('Error refreshing token', error);
                setLastError("Error refreshing token");
                enqueueSnackbar("Error refreshing token", { variant: 'error' });
                return Promise.resolve(undefined);
            })
        }
        else if (lastExpiresAt) {
            const token = await boxOAuth.tokenStorage.get();
            if (token) {
                return Promise.resolve(token.accessToken);
            } else {
                enqueueSnackbar("Token not found", { variant: 'error' });
                return Promise.reject("Token not found");
            }
        }
        else {
            enqueueSnackbar("Not Logged In", { variant: 'error' });
            return Promise.reject("Not Logged In");
        }
    }, []);

    const runLoginFlow = async () => {
        console.debug('AuthContext: Running login flow');
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

        const interval = async (event: MessageEvent) => {
            console.debug(`AuthContext: Message received from ${event.origin}`);
            if (event.origin !== window.location.origin) {
                return Promise.resolve();
            }
            const { type, code } = event.data;
            if (type === 'oauth-code') {
                window.removeEventListener('message', interval);
                try {
                    await boxOAuth.getTokensAuthorizationCodeGrant(code);
                    setClient(new BoxClient({ auth: boxOAuth }));
                    setIsAuthenticated(true);
                    return Promise.resolve();
                } catch (error: any) {
                    console.error(error);
                    setLastError(error.message);
                    return Promise.reject(error);
                }
           }
        };
        window.addEventListener('message', interval);
    }

    const login = useCallback(async () => {
        return runLoginFlow();
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);  
        setexpiresAt(undefined);
        setLastError("Loggedf Out");
        setClient(null);
        tokenStorage.clear(); 
    }, []);

    const contextValue:AuthContextType = useMemo(() => ({
        isAuthenticated,
        accessToken: getToken,
        client: client!,
        lastError,
        expriresIn: expiresAt,
        eid: eid,
        login,
        logout
    }), [isAuthenticated, getToken, client, lastError, expiresAt, eid, login, logout]);
        
    return (
        <AuthContext.Provider value={contextValue}>
          {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
