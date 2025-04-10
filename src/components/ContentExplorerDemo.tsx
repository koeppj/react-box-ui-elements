import React, { useState } from 'react';
import { Card, Typography, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import ContentExplorer from "box-ui-elements/es/elements/content-explorer";
import { ContentPickerPopup } from "box-ui-elements/es/elements/content-picker";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {pickerContent, pickerContentOverlay } from "./ContentExplorerDemo.module.css";
import { BoxItem } from "box-ui-elements/es/common/types/core";

interface explorerProps {
    canCreateNewFolder?: boolean,
    canDelete?: boolean,
    canDownload?: boolean,
    canPreview?: boolean,
    canRename?: boolean,
    canSetShareAccess?: boolean,
    canShare?: boolean,
    canUpload?: boolean,
    caurrentFolderId?: string,
    defaultView?: string,
    rootFolderId?: string,
};

export function ContentExplorerDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>("0");
    const [ explorerOpts, setExplorerOpts ] = useState<explorerProps>({
        canCreateNewFolder: false,
        canDelete: false,
        canDownload: false,
        canPreview: false,
        canRename: false,
        canSetShareAccess: false,
        canShare: false,
        canUpload: false,
        caurrentFolderId: "0",
        defaultView: "file",    
    });

    useEffect(() => {
        const init = async () => {
            if (isAuthenticated) {
                // Get the access token for the component
                await accessToken().then((token) => {
                    setToken(token)
                })
            }
            else {
                setToken(undefined);
            }
        };
        init();
    },[isAuthenticated])

    function pickerButtons(options: {
        currentFolderId: string,
        currentFolderName: string,
        onCancel: () => void,
        onChoose: () => void,
        selectedCount: number,
        selectedItems: any[],
    }): React.ReactNode {
        return (
            <div>
                <Button onClick={options.onCancel}>Cancel</Button>
                <Button disabled={options.selectedCount === 0} onClick={options.onChoose}>Choose</Button>
            </div>
        );}

    function onChooseFolder(items: BoxItem[]) {
        console.debug("Selected items: ", items[0].id);
        setCurrentFolderId(items[0].id);
    }

    return (
        <Card sx={{ my: 2, padding: 2,flexGrow: 1, display: 'flex', flexDirection: 'column', height: '80vh'}} id="content-explorer-demo">
          <Typography variant="h5" component="h2" gutterBottom>Basic Content Explorer</Typography>
            {token && (
            <ContentPickerPopup 
                    token={token}
                    canUpload={false}
                    type="folder"
                    currentFolderId={currentFolderId}
                    onChoose={onChooseFolder}
                    canCreateNewFolder={false}
                    canSetShareAccess={false}
                    maxSelectable= {1}
                    showSelectedButton={false}
                    renderCustomActionButtons={pickerButtons}
                    modal={{
                    buttonLabel:"Select",
                    modalClassName: pickerContent,
                    overlayClassName: pickerContentOverlay
                    }}
                    isHeaderLogoVisible={false} />
            )}        
            {token && (
            <ContentExplorer 
                key={currentFolderId} // Add a key to force rerender when rootFolderId changes
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                token={token}
                currentFolderId={currentFolderId}

            />
            )}
        </Card>
    )
}