import React, { useState } from 'react';
import { Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import ContentExplorer from "box-ui-elements/es/elements/content-explorer";
import ContentPickerPopup from "box-ui-elements/es/elements/content-picker";

export function ContentExplorerDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);
    const [rootFolderId, setRootFolderId] = useState<string | undefined>("0");

    useEffect(() => {
        const init = async () => {
            if (isAuthenticated) {
                // Get the access token for the component
                accessToken().then((token) => {
                    // Set the token in the state;
                    console.debug("token", token);
                    setToken(token)
                })
            }
            else {
                setToken(undefined);
            }
        };
        init();
    },[isAuthenticated])

    return (
        <Card sx={{ my: 2, padding: 2,flexGrow: 1, display: 'flex', flexDirection: 'column', height: '80vh'}} id="content-explorer-demo">
          <Typography variant="h5" component="h2" gutterBottom>App Status</Typography>
            {token && (
                <ContentPickerPopup 
                    token={token}
                    type="folder"
                    canUpload={false}
                    modal={{
                        buttonLabel: "Select Folder",
                    }} />
            )}        
            {token && (
                <ContentExplorer sx= {{ lexGrow: 1, display: 'flex', flexDirection: 'column',}}
                    token={token}
                    rootFolderId={rootFolderId}
                />
            )}
        </Card>
    )
}