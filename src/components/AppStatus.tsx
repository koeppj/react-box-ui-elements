import { Typography, Alert, Card, List, ListItem, ListItemIcon, Checkbox, ListItemText, Switch, Link } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useConfig } from "../contexts/ConfigContext";

export default function AppStatus() {

  const { isAuthenticated, accessToken, client, expriresIn, login, logout } = useAuth();
  const { rootFolderId, contractTemplatePresent, contractTemplateHidden, 
          documentTemplateHidden, documentTemplatePresent, createRootFolder,
          toggleContractTemplateHidden, toggleDocumentTemplateHidden} = useConfig();
  const { enqueueSnackbar } = useSnackbar();

  const [ userName , setUserName ] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated) {
        try {
          // Refresh the access token if required
          await accessToken();

          // Get the current user name
          const user = await client.users.getUserMe();
          setUserName(user.name);
        } catch (error) {
          console.error("Error fetching templates: ", error);
          enqueueSnackbar(`Error fetching data: ${error}`, { variant: 'error' });
        }
      }
    };
    checkStatus();
  }, [isAuthenticated]);

  return (
    <div>
      {!isAuthenticated && (
        <Card>
          <Alert severity="warning">
            You are not logged into box. Please <Link component="button" variant="body2" onClick={login}>Login</Link> to see the status of the app.
          </Alert>
        </Card>
      )}
      {isAuthenticated && (
        <Card sx={{ my: 2, padding: 2}}>
          <Typography variant="h5" component="h2" gutterBottom>App Status</Typography>
          <Typography variant="body1" gutterBottom>The app is currently login in as {userName}. To forget login <Link component="button" onClick={logout}>Logout</Link></Typography>
          <div>
             <Typography>Current Acccess Token will exprise in {Math.floor(((expriresIn ?? 0)-Date.now())/1000/60)} minutes and {(expriresIn ?? 0) % 60} seconds</Typography>
          </div>
        </Card>
      )}
      {isAuthenticated && (
        <Card sx={{ my: 2, padding: 2}}>
          <Typography variant="h5" component="h2" gutterBottom>Template Status</Typography>
          <Typography variant="body1" gutterBottom>Templates are used to create documents and contracts.</Typography>
          <List sx={{ alignItems: 'flex-start' }}>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={contractTemplatePresent}
                  tabIndex={-1}
                  disableRipple
                  readOnly={true}
                />
              </ListItemIcon>
              {contractTemplatePresent && (
                <ListItemText>
                  The Contract metadata template has been installed.  
                  This metadata template contains properties that describe a specific contract and are applied to folders.  
                  Contract Folders contain a list of Contract Files.
                  {contractTemplateHidden && (
                    <Typography component={"span"}>
                      This template is currently <em>hidden</em>, which means it will <em>not be visable</em> in the Box Web UI.  Use the Toggle to change that.
                    </Typography>)}
                  {!contractTemplateHidden && (
                    <Typography component={"span"}>
                      This template is currently <em>not hidden</em>, which means <em>it will be visable</em> in the Box Web UI.  Use the Toggle to change that.
                    </Typography>)}
                  </ListItemText>
                )}
              {contractTemplatePresent && (
                <Switch
                edge="end"
                checked={contractTemplateHidden}
                onChange={toggleContractTemplateHidden}
                />
              )}
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={documentTemplatePresent}
                  tabIndex={-1}
                  disableRipple
                  readOnly={true}
                />
              </ListItemIcon>
              {documentTemplatePresent && (
                <ListItemText>
                  The Documennt Contract metadata yemplate has been installed.  
                  This metadata template contains properties that describe files associated with a contract.  
                  {documentTemplateHidden && (
                    <Typography component={"span"}>
                      This template is currently <em>hidden</em>, which means it will <em>not be visable</em> in the Box Web UI.  Use the Toggle to change that.
                    </Typography>)}
                  {!documentTemplateHidden && (
                    <Typography component={"span"}>
                      This template is currently <em>not hidden</em>, which means <em>it will be visable</em> in the Box Web UI.  Use the Toggle to change that.
                    </Typography>)}
                  </ListItemText>
                )}
              {!documentTemplatePresent && (
                <ListItemText>
                  The Document metadata template is not installed.  This metadata template contains properties that describe files associated with a contract.  
                  To install this template, please contact your Box administrator.
                </ListItemText>
                )}
              {documentTemplatePresent && (
                <Switch
                edge="end"
                checked={documentTemplateHidden}
                onChange={toggleDocumentTemplateHidden}
                />
              )}
            </ListItem>
          </List>
        </Card>
      )}
      {isAuthenticated && (
        <Card sx={{ my:2, padding:2 }}>
          <Typography variant="h5" component="h2" gutterBottom>Folder Status</Typography>
          <Typography variant="body1" gutterBottom>Certain folders should be present for proper app functioning.</Typography>
          <List sx={{ alignItems: 'flex-start' }}>
          <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={!(rootFolderId === undefined)}
                  tabIndex={-1}
                  disableRipple
                  readOnly={true}
                />
              </ListItemIcon>
              {rootFolderId && (
                <ListItemText>
                  The Application Root Folder has been created.
                  </ListItemText>
                )}
              {(rootFolderId === undefined) && (
                <ListItemText>
                  The Application Root Folder has not been created.
                  </ListItemText>
                )}
            </ListItem>
          </List>
        </Card>
      )}
    </div>
  );
}