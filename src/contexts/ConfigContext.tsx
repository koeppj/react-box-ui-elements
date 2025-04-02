import React, { ReactNode, use, useCallback } from "react";
import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useSnackbar } from "notistack";
import { contractTemplateSrc, documentTemplateSrc, rootFolderName } from "../config/appConfigConstants";
import { useEffect, useState } from "react";
import { SearchForContentQueryParams } from "box-typescript-sdk-gen/lib/managers/search.generated";
import { FileFullOrFolderFullOrWebLink } from "box-typescript-sdk-gen/lib/schemas/fileFullOrFolderFullOrWebLink.generated";
import { serializeFileOrFolderOrWebLink } from "box-typescript-sdk-gen/lib/schemas/fileOrFolderOrWebLink.generated";
import { FolderFull } from "box-typescript-sdk-gen/lib/schemas/folderFull.generated";
import { SearchResultsWithSharedLinks } from "box-typescript-sdk-gen/lib/schemas/searchResultsWithSharedLinks.generated";


interface ConfigContextType {
    rootFolderId: string | undefined;
    contractTemplatePresent: true | false;
    contractTemplateHidden: true | false;
    documentTemplatePresent: true | false;
    documentTemplateHidden: true | false;
    createRootFolder: () => Promise<void>;
    toggleContractTemplateHidden: () => Promise<void>;
    toggleDocumentTemplateHidden: () => Promise<void>;
    createContractTemplate: () => Promise<void>;
    createDocumentTemplate: () => Promise<void>;
    configValid: () => boolean;
}

interface ConfigProviderProps {
    children: ReactNode;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {

    const { enqueueSnackbar } = useSnackbar();
    const { isAuthenticated, client, accessToken } = useAuth();

    const [ contractTemplatePresent, setContractTemplatePresent ] = useState(false);
    const [ contractTemplateHidden, setContractTemplateHidden ] = useState(false);
    const [ documentTemplatePresent, setDocumentTemplatePresent ] = useState(false);
    const [ documentTemplateHidden, setDocumentTemplateHidden ] = useState(false);
    const [ rootFolderId, setRootFolderId ] = useState<string | undefined>(undefined);

    useEffect(() => {
        const checkStatus = async () => {
            if (isAuthenticated) {
                try {
                    // Refresh the access token if required
                    await accessToken();

                    // Get the templates for the EID
                    const templates = await client.metadataTemplates.getEnterpriseMetadataTemplates();

                    // look for the contract and document template and set the state accordingly
                    const contractTemplate = templates.entries?.find(template => template.templateKey === contractTemplateSrc?.templateKey);
                    const documentTemplate = templates.entries?.find(template => template.templateKey === documentTemplateSrc?.templateKey);
                    setContractTemplatePresent(!!contractTemplate);
                    setContractTemplateHidden(!!contractTemplate?.hidden);
                    setDocumentTemplatePresent(!!documentTemplate);
                    setDocumentTemplateHidden(!!documentTemplate?.hidden);

                    // Look for the app's root folder in "All Files".  Be sure to check for an object
                    // of type "folder" with a name that is an exaxt match.
                    const allFiles = await client.search.searchForContent({
                        ancestorFolderIds: ['0'],
                        type: "folder",
                        contentTypes: ['name'],
                        query: `"${rootFolderName}"`,
                    });
                    const rootFolder = (allFiles as SearchResultsWithSharedLinks).entries?.[0]?.item?.id;
                    setRootFolderId(rootFolder);
                } catch (error) {
                    console.error("Error fetching templates and root folder: ", error);
                    enqueueSnackbar(`Error fetching data and root folder: ${error}`, { variant: 'error' });
                }
            }
        };
        checkStatus();
    }, [isAuthenticated]);

    const createRootFolder = useCallback(async () => {
        if (isAuthenticated && !rootFolderId) {
            try {
                // Refresh the access token if required
                await accessToken();
                // Create the root folder
            } catch (error) {
            }
        } else if (rootFolderId) {
            enqueueSnackbar("Root folder already exists", { variant: 'info' });
        } else {
            enqueueSnackbar("Not authenticated", { variant: 'error' });
        }
    },[isAuthenticated]);

    const toggleContractTemplateHidden = useCallback(async () => {
        if (isAuthenticated && contractTemplatePresent) {
            try {
                // Refresh the access token if required
                await accessToken();
                setContractTemplateHidden(!contractTemplateHidden);
            } catch (error) {
            }
        } else if (contractTemplatePresent) {
            enqueueSnackbar("Contract template already exists", { variant: 'info' });
        } else {
            enqueueSnackbar("Not authenticated", { variant: 'error' });
        }
    }, [isAuthenticated]);

    const toggleDocumentTemplateHidden = useCallback(async () => {
        if (isAuthenticated && documentTemplatePresent) {
            try {
                // Refresh the access token if required
                await accessToken();
                setDocumentTemplateHidden(!documentTemplateHidden);
            } catch (error) {
            }
        } else if (documentTemplatePresent) {
            enqueueSnackbar("Document template already exists", { variant: 'info' });
        } else {
            enqueueSnackbar("Not authenticated", { variant: 'error' });
        }
    }, [isAuthenticated]);

    const createContractTemplate = useCallback(async () => {
        if (isAuthenticated && !contractTemplatePresent) {
            try {
                // Refresh the access token if required
                await accessToken();
                // Create the contract template
            } catch (error) {
            }
        } else if (contractTemplatePresent) {
            enqueueSnackbar("Contract template already exists", { variant: 'info' });
        } else {
            enqueueSnackbar("Not authenticated", { variant: 'error' });
        }
    }, [isAuthenticated]);

    const createDocumentTemplate = useCallback(async () => {
        if (isAuthenticated && !documentTemplatePresent) {
            try {
                // Refresh the access token if required
                await accessToken();
                // Create the document template
            } catch (error) {
            }
        } else if (documentTemplatePresent) {
            enqueueSnackbar("Document template already exists", { variant: 'info' });
        } else {
            enqueueSnackbar("Not authenticated", { variant: 'error' });
        }
    }, [isAuthenticated, documentTemplatePresent, accessToken, enqueueSnackbar]);   

    const configValid = useCallback(() => {
        if (rootFolderId && contractTemplatePresent && documentTemplatePresent) {
            return true;
        }
        return false;
    }, [rootFolderId, contractTemplatePresent, documentTemplatePresent]);  

    const value = {
        rootFolderId,
        contractTemplatePresent,
        contractTemplateHidden,
        documentTemplatePresent,
        documentTemplateHidden,
        createRootFolder,
        toggleContractTemplateHidden,
        toggleDocumentTemplateHidden,
        createContractTemplate,
        createDocumentTemplate,
        configValid
    };
        
    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
}

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
}
