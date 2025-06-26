import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Dashboard, Folder, AccountCircle } from '@mui/icons-material';
import AppStatus from './AppStatus';
import OAuthCallback from './OAuthCallback';
import { useConfig } from "../contexts/ConfigContext";
import { ContentExplorerDemo } from "./ContentExplorerDemo";
import { ContentPreviewDemo } from './ContentPreviewDemo';
import { useAuth } from '../contexts/AuthContext';
import { FolderEmbedDemo } from './FolderEmbedDemo';

function AppMain() {

  const configContext = useConfig();
  const AuthContext = useAuth();

  const drawerWidth = 240;

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Box Demo App
            </Typography>
            <AccountCircle />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem component={Link} to="/">
                <ListItemButton>
                  <ListItemIcon><Dashboard /></ListItemIcon>
                  <ListItemText primary="App Status" />
                </ListItemButton>
              </ListItem>
              <ListItem component={Link} to="/explorer">
                <ListItemButton disabled={!AuthContext.isAuthenticated}>
                  <ListItemIcon><Folder /></ListItemIcon>
                  <ListItemText primary="Content Explorer" />
                </ListItemButton>
              </ListItem>
              <ListItem component={Link} to="/preview">
                <ListItemButton disabled={!AuthContext.isAuthenticated}>
                  <ListItemIcon><Folder /></ListItemIcon>
                  <ListItemText primary="Content Preview" />
                </ListItemButton>
              </ListItem>
              <ListItem component={Link} to="/embed">
                <ListItemButton disabled={!AuthContext.isAuthenticated}>
                  <ListItemIcon><Folder /></ListItemIcon>
                  <ListItemText primary="Folder Embed" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: 'calc(100% - 240px)' }}>
          <Toolbar />
          <Switch>
            <Route path="/auth"><OAuthCallback /></Route>
            <Route path="/explorer"><ContentExplorerDemo /></Route>
            <Route path ="/preview"><ContentPreviewDemo /></Route>
            <Route path="/embed"><FolderEmbedDemo /></Route>
            <Route path="/"><AppStatus /></Route>
          </Switch>
        </Box>
      </Box>
    </Router>
  );
}

export default AppMain;
