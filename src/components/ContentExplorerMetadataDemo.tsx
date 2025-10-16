import React, { ChangeEvent, useState } from 'react';
import { Card, Typography, Button, FormControlLabel, Switch, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useConfig } from '../contexts/ConfigContext';
import { useEffect } from "react";
import ContentExplorer from "box-ui-elements/es/elements/content-explorer/ContentExplorer";
import { ContentPickerPopup } from "box-ui-elements/es/elements/content-picker";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {pickerContent, pickerContentOverlay } from "./ContentExplorerDemo.module.css";
import { BoxItem } from "box-ui-elements/es/common/types/core";
import { Accordion } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { MetadataQuery } from 'box-ui-elements/es/elements/metadata-based-viewer/types';
import { MetadataDisplayProps } from 'box-ui-elements/es/elements/metadata-based-viewer/MetadataDisplay';

interface explorerProps {
    title?: string;
    metadataQuery?: MetadataQuery;
    metadataViewProps?: MetadataDisplayProps
    columns?: any[];
    defaultView: "metadata";    
};

export function ContentExplorerMetadataDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>("0");
    const { metadataTemplate, metadataSource } = useConfig();
    const fieldsToShow = {

    };
    const fieldsToReturn = [
        "taskDueDate",
        "taskStatus",
    ];



    const [ explorerOpts, setExplorerOpts ] = useState<explorerProps>({
        title: "Content Explorer - Metadata View",
        defaultView: "metadata",
    });
    const [isExpanded, setIsExpanded] = useState<string| false>(false);

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

    function onChooseCurrentFolder(items: BoxItem[]) {
        setExplorerOpts({
            ...explorerOpts,
        })
        setCurrentFolderId(items[0].id);
    }

    function handleAccordianChange(panelId: string) {
        return (event: React.SyntheticEvent, isExpanded: boolean) => {
            setIsExpanded(isExpanded ? panelId : false);
        }
    };

    return (
        <Card sx={{ my: 2, padding: 2,flexGrow: 1, display: 'flex', flexDirection: 'column', height: '80vh'}} id="content-explorer-demo">
          <Typography variant="h5" component="h2" gutterBottom>Basic Content Explorer</Typography>
            {token && (
                <div>
                    <Accordion expanded={isExpanded === "folder-picker"} 
                                onChange={handleAccordianChange("folder-picker")} >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                            <Typography>Content Explorer Config</Typography>
                        </AccordionSummary>
                        <AccordionDetails id='folder-picker-details'>
                            <FormControl>
                                <ContentPickerPopup 
                                    token={token}
                                    canUpload={false}
                                    type="folder"
                                    currentFolderId={currentFolderId}
                                    onChoose={onChooseCurrentFolder}
                                    canCreateNewFolder={false}
                                    canSetShareAccess={false}
                                    maxSelectable= {1}
                                    showSelectedButton={false}
//                                    renderCustomActionButtons={pickerButtons}
                                    modal={{
                                        buttonLabel:"Set Current Folder",
                                        modalClassName: pickerContent,
                                        overlayClassName: pickerContentOverlay
                                    }}
                                    isHeaderLogoVisible={false} />

                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                </div>
            )}        
            {token && (
            <ContentExplorer 
                key={explorerOpts} // Add a key to force rerender when rootFolderId changes
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                token={token}
                logoUrl="box"
                {...explorerOpts}

            />
            )}
        </Card>
    )
}