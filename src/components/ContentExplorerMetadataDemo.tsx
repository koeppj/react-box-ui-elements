import React, { useState, useRef } from 'react';
import { Card, Typography, Button, FormControlLabel, Switch, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useConfig } from '../contexts/ConfigContext';
import { useEffect } from "react";
import ContentExplorer from "box-ui-elements/es/elements/content-explorer/ContentExplorer";
import ContentPreview from "box-ui-elements/es/elements/content-preview";
import { ContentPickerPopup } from "box-ui-elements/es/elements/content-picker";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {pickerContent, pickerContentOverlay } from "./ContentExplorerDemo.module.css";
import { BoxItem } from "box-ui-elements/es/common/types/core";
import { Accordion } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { MetadataViewProps, Column, MetadataView, } from '@box/metadata-view';
import { Item } from '@box/types';
import Modal from 'react-modal';
import { modalContent, modalOverlay, modalPortal } from './ContentExplorerMetadataDemo.module.css';

interface explorerProps {
    title?: string;
    canPreview?: boolean,
    metadataQuery?: any
    metadataViewProps?: any;
    itemActions?: any[];
    features?: any;
    defaultView: "metadata";    
};

export function ContentExplorerMetadataDemo() {

    const {isAuthenticated, expriresIn, client, accessToken} = useAuth();
    const [token, setToken] = useState<string|undefined>(undefined);
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>("0");
    const {contractFields, contractMetadata } = useConfig();
    const [configLoaded, setConfigLoaded ] = useState<boolean>(false);
    const [previewItem, setPreviewItem] = useState<string | undefined>(undefined);
    const [explorerOpts, setExplorerOpts ] = useState<explorerProps | undefined>(undefined);
    const [isExpanded, setIsExpanded] = useState<string| false>(false);

    const parentRef = useRef<HTMLDivElement>(null)    

    useEffect(() => {
        const init = async () => {
            if (isAuthenticated) {
                // Get the access token for the component
                await accessToken().then((token) => {
                    setToken(token)
                    const metadataQuery = {
                        from: `${contractMetadata}`,
                        ancestor_folder_id: currentFolderId || '0',
                        fields: [`${contractFields}.externalPartyName`, 
                                `${contractFields}.contractType`,
                                `${contractFields}.endDate`,
                                `${contractFields}.autoRenew`,
                                `${contractFields}.lawyer`,
                                `${contractFields}.riskLevel`
                        ],
                        query: "item.type = :type_arg",
                        query_params: {
                            type_arg: "file"
                        }
                    };
                    const columns: Column[] = [
                        {textValue: "", id: "item.name", type: "string", minWidth: 40, maxWidth: 40, allowsSorting: false},
                        {textValue: "File Name", id: "name", type: "string", minWidth: 300, allowsSorting: true, cellRenderer: DummyRenderer},
                        {textValue: "External Party Name", id: `${contractFields}.externalPartyName`, type: "string", allowsSorting: true},
                        {textValue: "Contract Type", id: `${contractFields}.contractType`, type: "enum", allowsSorting: true},
                        {textValue: "End Date", id: `${contractFields}.endDate`, type: "date", allowsSorting: true},
                        {textValue: "Auto Renew", id: `${contractFields}.autoRenew`, type: "enum", allowsSorting: true},
                        {textValue: "Lawyer", id: `${contractFields}.lawyer`, type: "string", allowsSorting: true},   
                        {textValue: "Risk Level", id: `${contractFields}.riskLevel`, type: "enum", allowsSorting: true},  
                    ];
                    setExplorerOpts({
                        title: "Contract Documents",
                        defaultView: "metadata",
                        canPreview: true,
                        features: {
                            contentExplorer: {
                                metadataViewV2: true
                            }
                        },
                        metadataQuery: metadataQuery,
                        metadataViewProps: {
                            columns: columns,
                            isSelectionEnabled: true,
                            actionBarProps: {
                                isAllFiltersDisabled: true,
                            }
                        }
                    });
                    setConfigLoaded(true);
                })
            }
            else {
                setToken(undefined);
                setConfigLoaded(false)
            }
        };
        init();
    },[isAuthenticated,setCurrentFolderId])

    function onChooseCurrentFolder(items: BoxItem[]) {
        setCurrentFolderId(items[0].id);
    }

    function handleAccordianChange(panelId: string) {
        return (event: React.SyntheticEvent, isExpanded: boolean) => {
            setIsExpanded(isExpanded ? panelId : false);
        }
    };

    function DummyRenderer(item: Item, column: Column): React.ReactNode {
        console.log("DummayRenderer Item:", item);
        return (
            <Button
                variant="text"
                onClick={(e) => { e.stopPropagation(); onPreview(item); }}
                sx={{ textTransform: 'none', padding: 0, minWidth: 0 }}
            >
                {item.name}
            </Button>
        );
    }

    function onPreview(item: any): void {
        setPreviewItem(item.id);
    }

    function onClosePreview(): void {
        setPreviewItem(undefined);
    }

    return (
        <Card sx={{ my: 2, padding: 2,flexGrow: 1, display: 'flex', flexDirection: 'column', height: '90vh'}} id="content-explorer-demo">
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
            <div id="demo-explorer" 
                ref={parentRef} 
                style={{
                    position: "relative",
                    height: "100%",          // or 100%, with ancestors also sized
                    overflow: "hidden",   // clip overlay to parent if needed
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {configLoaded && (
                <ContentExplorer 
                    key={explorerOpts} // Add a key to force rerender when rootFolderId changes
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column'}}
                    token={token}
                    logoUrl="box"
                    {...explorerOpts}

                />
                )}
                {configLoaded && previewItem && (
                <Modal 
                    isOpen={previewItem}
                    parentSelector={() => parentRef.current!}
                    style={{
                    // key: prevent page-wide coverage
                    overlay: { position: "absolute", inset: 0, zIndex: 6000, background: "rgba(0,0,0,0.4)" },
                    content: {
                        position: "absolute",
                        inset: 0,           // fills entire overlay area
                        margin: 0,
                        padding: 0,
                        background: "white",
                        border: "none",
                        outline: "none",
                        zIndex: 11,                    },
                    }}                    
                    onRequestClose={() => onClosePreview()}
                >
                    <ContentPreview 
                            key={previewItem} // Add a key to force rerender when options change
                            sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                            token={token}
                            fileId={previewItem}
                            autoFocus={true}
                            hasHeader={true}
                            canDownload={true}
                            onClose={onClosePreview}
                            showAnnotations={true}
                            contentSidebarProps={{
                                hasActivityFeed: true,
                                hasMetadata: true,
                                hasSkills: true,
                                hasVersions: true,
                                detailsSidebarProps: {
                                    hasProperties: true,
                                    hasAccessStats: true,
                                    hasVersions: true,
                                    hasNotices: true,
                                }
                            }}
                        />
                </Modal>
                )}
            </div>
        </Card>
    )
}