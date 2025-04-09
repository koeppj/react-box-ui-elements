import React, { useState } from 'react';
import { Accordion,  Card, CardContent, Typography } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import ContentExplorer from "box-ui-elements/es/elements/content-explorer";
import { ContentPickerPopup } from "box-ui-elements/es/elements/content-picker/index";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { css } from "@emotion/react";

export function ContentExplorerDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);
    const [rootFolderId, setRootFolderId] = useState<string | undefined>("0");
    const [isExpanded, setIsExpanded] = useState<string| false>(false);

    const pickerContent = css`
        width: 50%;
        height: 50%;
        position: absolute;
        border: 1px solid black;
        background-color: white;
        z-index: 1000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);`


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

    function onChooseFolder(items: any[]) {
        console.debug("onChooseFolder", items);
    }

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
                        <AccordionDetails id='folder-picker-details'>
                            <ContentPickerPopup 
                                token={token}
                                canUpload={false}
                                type="folder"
                                onChoose={onChooseFolder}
                                onCancel={() => setIsExpanded(false)}
                                rootFolderId={rootFolderId}
                                canCreateNewFolder={false}
                                canSetShareAccess={false}
                                maxSelectable={1}
                                modal={{
                                    buttonLabel:"Select",
                                    modalClassName: {pickerContent}
                                }}
                                isHeaderLogoVisible={false} />
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