import React, { useState } from 'react';
import { Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import ContentExplorer from "box-ui-elements/es/elements/content-explorer";


export function ContentExplorerDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);

    useEffect(() => {
        const init = async () => {
            if (isAuthenticated) {
                // Get the access token for the component
                const token = await accessToken();
                console.debug("token", token);
                setToken(token)
            }
            else {
                setToken(undefined);
            }
        };
        init();
    },[isAuthenticated])

    return (
        <div>
            <Typography variant="h2">Welcome to the Box Content Explorer UI Widget</Typography>
            {token && (
                <ContentExplorer
                    token={token}
                    rootFolderId="0"
                />
            )}
        </div>
    )
}