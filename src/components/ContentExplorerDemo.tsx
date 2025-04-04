import React, { useState } from 'react';
import { Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export function ContentExplorerDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);

    useEffect(() => {
        const init = async () => {
            if (isAuthenticated) {
                // Get the access token for the component
                const token = await accessToken();
                setToken(token)
            }
            else {
                setToken(undefined);
            }
        };
        init();
    },[isAuthenticated,expriresIn,accessToken])

    return (
        <div>
            <Typography variant="h2">Welcome to the Box Content Explorer UI Widget</Typography>
        </div>
    )
}