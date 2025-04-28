import React, { ChangeEvent, useState } from 'react';
import { Card, Typography, Button, FormControlLabel, Switch, FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import ContentPreview from "box-ui-elements/es/elements/content-preview";
import { ContentPickerPopup } from "box-ui-elements/es/elements/content-picker";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {pickerContent, pickerContentOverlay } from "./ContentExplorerDemo.module.css";
import { BoxItem } from "box-ui-elements/es/common/types/core";
import { Accordion } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import LabelBox from './LabelBox';

interface previewProps {
    fileId: string | undefined,
    hasHeader?: boolean,
    canDownload?: boolean,
    showAnnotations?: boolean,
    contentSidebarProps?: {
        hasActivityFeed?: boolean,
        hasMetadata?: boolean,
        hasSkills?: boolean,
        hasVersions?: boolean,
        detailsSidebarProps?: {
            hasProperties?: boolean,
            hasAccessStats?: boolean,
            hasVersions?: boolean,
            hasNotices?: boolean,
        }  
    }  

};

export function ContentPreviewDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>("0");
    const [ previewOpts, setPreviweOpts ] = useState<previewProps>({
        fileId: undefined,
        hasHeader: true,
        canDownload: true,
        showAnnotations: true,
        contentSidebarProps: {
            hasActivityFeed: true,
            hasMetadata: true,
            hasSkills: false,
            hasVersions: false,

        }
    });
    const [isExpanded, setIsExpanded] = useState<string| false>(false);

    useEffect(() => {
        const init = async () => {
            if (isAuthenticated) {
                // Get the access token for the component
                await accessToken().then((token) => {
                    setToken(token)
                }).catch((error) => {
                    console.error("Error getting access token: ", error);
                    setToken(undefined);
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

    function onChooseCurrentFileId(items: BoxItem[]) {
        setPreviweOpts({
            ...previewOpts,
            fileId: items[0].id,
        });
    }

    function handleAccordianChange(panelId: string) {
        return (event: React.SyntheticEvent, isExpanded: boolean) => {
            setIsExpanded(isExpanded ? panelId : false);
        }
    };

    return (
        <Card sx={{ my: 2, padding: 2,flexGrow: 1, display: 'flex', flexDirection: 'column', height: '80vh'}} id="content-explorer-demo">
          <Typography variant="h5" component="h2" gutterBottom>Content Preview</Typography>
            {token && (
                <div>
                    <ContentPickerPopup 
                        token={token}
                        canUpload={false}
                        type="file"
                        currentFolderId={currentFolderId}
                        onChoose={onChooseCurrentFileId}
                        canCreateNewFolder={false}
                        canSetShareAccess={false}
                        maxSelectable= {1}
                        showSelectedButton={false}
                        renderCustomActionButtons={pickerButtons}
                        modal={{
                            buttonLabel:"Select File",
                            modalClassName: pickerContent,
                            overlayClassName: pickerContentOverlay
                        }}
                        isHeaderLogoVisible={false} />
                    <Accordion expanded={isExpanded === "folder-picker"} 
                                onChange={handleAccordianChange("folder-picker")} >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                            <Typography>Content Preview Config</Typography>
                        </AccordionSummary>
                        <AccordionDetails id='folder-picker-details'>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <LabelBox label="Content Preview Options" sx={{ flex: '1 1 300px' }}>         
                                    <FormControlLabel control={<Switch checked={previewOpts.hasHeader} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setPreviweOpts({
                                            ...previewOpts,
                                            hasHeader: e.target.checked,
                                        })
                                    }} />} label="Show Header" />
                                    <FormControlLabel control={<Switch checked={previewOpts.canDownload} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setPreviweOpts({
                                            ...previewOpts,
                                            canDownload: e.target.checked,
                                        })
                                    }} />} label="Can Download" />
                                    <FormControlLabel control={<Switch checked={previewOpts.showAnnotations} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setPreviweOpts({
                                            ...previewOpts,
                                            showAnnotations: e.target.checked,
                                        })
                                    }} />} label="Show Annotations" />     
                                </LabelBox>
                                <LabelBox label="Content Sidebar Options" sx={{ flex: '1 1 300px' }}>
                                    <FormControlLabel control={<Switch checked={previewOpts.contentSidebarProps?.hasActivityFeed} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setPreviweOpts({
                                            ...previewOpts,
                                            contentSidebarProps: {
                                                ...previewOpts.contentSidebarProps,
                                                hasActivityFeed: e.target.checked,
                                            }
                                        })
                                    }} />} label="Has Activity Feed" />
                                    <FormControlLabel control={<Switch checked={previewOpts.contentSidebarProps?.hasMetadata} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setPreviweOpts({
                                            ...previewOpts,
                                            contentSidebarProps: {
                                                ...previewOpts.contentSidebarProps,
                                                hasMetadata: e.target.checked,
                                            }
                                        })
                                    }} />} label="Has Metadata" />
                                    <FormControlLabel control={<Switch checked={previewOpts.contentSidebarProps?.hasSkills} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setPreviweOpts({
                                            ...previewOpts,
                                            contentSidebarProps: {
                                                ...previewOpts.contentSidebarProps,
                                                hasSkills: e.target.checked,
                                            }
                                        })
                                    }} />} label="Has Skills" />
                                </LabelBox>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </div>
            )}        
            {token && previewOpts.fileId && (
                <ContentPreview 
                    key={previewOpts} // Add a key to force rerender when options change
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                    token={token}
                    fileId={previewOpts.fileId}
                    hasHeader={previewOpts.hasHeader}
                    canDownload={previewOpts.canDownload}
                    showAnnotations={previewOpts.showAnnotations}
                    contentSidebarProps={{
                        hasActivityFeed: previewOpts.contentSidebarProps?.hasActivityFeed,
                        hasMetadata: previewOpts.contentSidebarProps?.hasMetadata,
                        hasSkills: previewOpts.contentSidebarProps?.hasSkills,
                        hasVersions: previewOpts.contentSidebarProps?.hasVersions,
                        detailsSidebarProps: {
                            hasProperties: true,
                            hasAccessStats: true,
                            hasVersions: true,
                            hasNotices: true,
                        }
                    }}
                />
            )}
        </Card>
    )
}