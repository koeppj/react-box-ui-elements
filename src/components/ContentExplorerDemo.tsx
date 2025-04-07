import React, { useState } from 'react';
import { Accordion,  Card, CardContent, Typography } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import ContentExplorer from "box-ui-elements/es/elements/content-explorer";
import ContentPicker from "box-ui-elements/es/elements/content-picker";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function ContentExplorerDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);
    const [rootFolderId, setRootFolderId] = useState<string | undefined>("0");
    const [isExpanded, setIsExpanded] = useState<string| false>(false);

    useEffect(() => {
        const init = async () => {
            if (isAuthenticated) {
                // Get the access token for the component
                accessToken().then((token) => {
                    setToken(token)
                })
            }
            else {
                setToken(undefined);
            }
        };
        init();
    },[isAuthenticated])

    function handleAccordianChange(panelId: string) {
        return (event: React.SyntheticEvent, isExpanded: boolean) => {
            setIsExpanded(isExpanded ? panelId : false);
        }
    };

    return (
        <Card sx={{ my: 2, padding: 2,flexGrow: 1, display: 'flex', flexDirection: 'column', height: '80vh'}} id="content-explorer-demo">
          <Typography variant="h5" component="h2" gutterBottom>App Status</Typography>
            {token && (
                <div>
                    <Accordion expanded={isExpanded === "folder-picker"} 
                               onChange={handleAccordianChange("folder-picker")} >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                            <Typography>Folder Picker</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ContentPicker 
                                token={token}
                                type="folder"
                                canUpload={false} />
                        </AccordionDetails>
                    </Accordion>
                </div>
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