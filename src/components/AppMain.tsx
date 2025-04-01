import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Dashboard, Folder, Group, Assessment, AccountCircle } from '@mui/icons-material';
import AppStatus from './AppStatus';
import OAuthCallback from './OAuthCallback';
import { useAuth } from "../contexts/AuthContext";

function AppMain() {

  const authContext = useAuth();

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
              <ListItem component={Link} to="/projects">
                <ListItemButton disabled={!authContext.isAuthenticated}>
                  <ListItemIcon><Folder /></ListItemIcon>
                  <ListItemText primary="Contracts (UI Elements)" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Switch>
            <Route path="/auth" component={OAuthCallback} />
            <Route path="/">
              <AppStatus />
            </Route>
``              </Switch>
        </Box>
      </Box>
    </Router>
  );
}

export default AppMain;
