import React, { ChangeEvent, useState } from 'react';
import { Card, Typography, Button, FormControlLabel, Switch, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import ContentExplorer from "box-ui-elements/es/elements/content-explorer";
import { ContentPickerPopup } from "box-ui-elements/es/elements/content-picker";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {pickerContent, pickerContentOverlay } from "./FolderEmbedDemo.module.css";
import { BoxItem } from "box-ui-elements/es/common/types/core";
import { Accordion } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { UpdateFolderByIdOptionalsInput } from 'box-typescript-sdk-gen/lib/managers/folders.generated';

interface folderEmbedProps {
    showItemFeedActions?: boolean,
    showParentPath?: boolean,
    sortColum?: string,
    sortDirection?: string,
    view?: string,
};

export function FolderEmbedDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>("0");
    const [embedUrl, setEmbedUrl] = useState<string | undefined>("https://app.box.com/embed/folder/0");
    const [folderEmbedOpts, setFolderEmbedOpts ] = useState<folderEmbedProps>({
        showItemFeedActions: true,
        showParentPath: false,
        sortColum: "date",
        sortDirection: "ASC",
        view: "list",
    });
    const [isExpanded, setIsExpanded] = useState<string| false>(false);

    useEffect(() => {
        const init = async () => {
            if (isAuthenticated) {
                // Get the access token for the component
                await accessToken().then((token) => {
                    setToken(token)
                })
                // Update embed URL when folder ID or options change
                if (currentFolderId) {
                    const params = new URLSearchParams();
                    if (folderEmbedOpts.showItemFeedActions !== undefined) params.append('showItemFeedActions', String(folderEmbedOpts.showItemFeedActions));
                    if (folderEmbedOpts.showParentPath !== undefined) params.append('showParentPath', String(folderEmbedOpts.showParentPath));
                    if (folderEmbedOpts.sortColum) params.append('sortColumn', folderEmbedOpts.sortColum);
                    if (folderEmbedOpts.sortDirection) params.append('sortDirection', folderEmbedOpts.sortDirection);
                    if (folderEmbedOpts.view) params.append('view', folderEmbedOpts.view);
                    let baseUrl = `https://app.box.com/embed/folder/${currentFolderId}`;
                    if (currentFolderId != "0") {
                        const folder = await client.folders.getFolderById(currentFolderId
                            ,{
                                queryParams: {
                                    fields: ["shared_link"]}
                            });
                        // If the folder has a shared link, use that as the base URL
                        if (folder.sharedLink && folder.sharedLink.url) {
                            baseUrl = folder.sharedLink.url.replace("box.com/s", "box.com/embed/s");
                        }
                        // otherwise create a new shared link
                        else {
                            const options: UpdateFolderByIdOptionalsInput = {
                                queryParams: {
                                    fields: ["shared_link"]
                                },
                                requestBody: {
                                    sharedLink: {
                                        access: "collaborators",
                                    }
                                }
                            };
                            const folderUpdated = await client.folders.updateFolderById(currentFolderId, options);
                            if (folderUpdated.sharedLink && folderUpdated.sharedLink.url) {
                                baseUrl = folderUpdated.sharedLink.url.replace("box.com/s", "box.com/embed/s");
                            } else {
                                console.error("Failed to create shared link for folder");
                            }
                        }
                    }
                    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
                    setEmbedUrl(url);
                }
            } else {
                setToken(undefined);
            }
        };
        init();
    }, [isAuthenticated, currentFolderId, folderEmbedOpts])

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
        // Remove currentFolderId from folderEmbedOpts, as it's no longer part of the interface
        setCurrentFolderId(items[0].id);
    }

    function handleAccordianChange(panelId: string) {
        return (event: React.SyntheticEvent, isExpanded: boolean) => {
            setIsExpanded(isExpanded ? panelId : false);
        }
    };

    return (
        <Card sx={{ my: 2, padding: 2,flexGrow: 1, display: 'flex', flexDirection: 'column', height: '80vh'}} id="content-explorer-demo">
          <Typography variant="h5" component="h2" gutterBottom>Folder Embed</Typography>
            {token && (
                <div>
                    <Accordion expanded={isExpanded === "folder-picker"} 
                                onChange={handleAccordianChange("folder-picker")} >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                            <Typography>Folder Embed Config</Typography>
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
                                    renderCustomActionButtons={pickerButtons}
                                    modal={{
                                        buttonLabel:"Set Current Folder",
                                        modalClassName: pickerContent,
                                        overlayClassName: pickerContentOverlay
                                    }}
                                    isHeaderLogoVisible={false} />

                            </FormControl>
                            <FormControlLabel 
                                control={<Switch checked={folderEmbedOpts.showItemFeedActions} onChange={() => setFolderEmbedOpts({...folderEmbedOpts, showItemFeedActions: !folderEmbedOpts.showItemFeedActions})} />}
                                label="Show Item Feed Actions"/>
                            <FormControlLabel
                                control={<Switch checked={folderEmbedOpts.showParentPath} onChange={() => setFolderEmbedOpts({...folderEmbedOpts, showParentPath: !folderEmbedOpts.showParentPath})} />}
                                label="Show Parent Path" />
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} size='small'>
                                <InputLabel id="sort-column-label">Sort Column</InputLabel>
                                <Select
                                    label="Sort Column"
                                    labelId="sort-column-label"
                                    value={folderEmbedOpts.sortColum}
                                    onChange={(e) => setFolderEmbedOpts({...folderEmbedOpts, sortColum: e.target.value})}>
                                        <MenuItem value="date">Date</MenuItem>
                                        <MenuItem value="name">Name</MenuItem>
                                        <MenuItem value="size">Size</MenuItem>
                                    </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} size='small'>
                                <InputLabel id="sort-direction-label">Sort Direction</InputLabel>
                                <Select
                                    label="Sort Direction"
                                    labelId="sort-direction-label"
                                    value={folderEmbedOpts.sortDirection}
                                    onChange={(e) => setFolderEmbedOpts({...folderEmbedOpts, sortDirection: e.target.value})}>
                                        <MenuItem value="ASC">Ascending</MenuItem>
                                        <MenuItem value="DESC">Descending</MenuItem>
                                    </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} size='small'>
                                <InputLabel id="view-label">View</InputLabel>
                                <Select
                                    label="View"
                                    labelId="view-label"
                                    value={folderEmbedOpts.view}
                                    onChange={(e) => setFolderEmbedOpts({...folderEmbedOpts, view: e.target.value})}>
                                        <MenuItem value="list">List</MenuItem>
                                        <MenuItem value="icon">Icon</MenuItem>
                                    </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                </div>
            )}        
            {token && (
            <iframe
                key={embedUrl}
                src={embedUrl}
                title="Box Folder Embed"
                style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
            />
            )}
        </Card>
    )
}