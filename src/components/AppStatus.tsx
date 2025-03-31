import { Typography, Alert, Card, Grid2, List, ListItem, ListItemIcon, Checkbox, ListItemText, Switch, FormControlLabel, Link } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

export default function AppStatus() {

  const { isAuthenticated, accessToken, client, lastError, expriresIn, login, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [ contractTemplatePresent, setContractTemplatePresent ] = useState(false);
  const [ contractTemplateHidden, setContractTemplateHidden ] = useState(false);
  const [ documentPresent, setDocumentPresent ] = useState(false);
  const [ documentHidden, setDocumentHidden ] = useState(false);
  const [ userName , setUserName ] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated) {
        try {
          // Refresh the access token if required
          await accessToken();

          // Get the templates for hte EID
          const templates = await client.metadataTemplates.getEnterpriseMetadataTemplates();

          // look for the contract and document template and set the state accordingly
          const contractTemplate = templates.entries?.find(template => template.templateKey === 'contract');
          const documentTemplate = templates.entries?.find(template => template.templateKey === 'contractDocument');
          setContractTemplatePresent(!!contractTemplate);
          setContractTemplateHidden(!!contractTemplate?.hidden);
          setDocumentPresent(!!documentTemplate);
          setDocumentHidden(!!documentTemplate?.hidden);

          // Get the current user name
          const user = await client.users.getUserMe();
          setUserName(user.name);
        } catch (error) {
          console.error("Error fetching templates: ", error);
          enqueueSnackbar(`Error fetching data: ${error}`, { variant: 'error' });
        }
      }
      else {
        setContractTemplatePresent(false);
        setDocumentPresent(false);
      }
    };
    checkStatus();
  }, [isAuthenticated]);


  const togglecontractTemplateHidden = async () => {
    setContractTemplateHidden(!contractTemplateHidden);
  }


  const toggleDocumentTemplateHidden = async () => {
  }


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
        <Card>
          <Typography variant="h5" component="h2" gutterBottom>App Status</Typography>
          <Typography variant="body1" gutterBottom>The app is currently login in as {userName}.</Typography>
          <div>
             <Typography>Current Acccess Token will exprise in {Math.floor(((expriresIn ?? 0)-Date.now())/1000/60)} minutes and {(expriresIn ?? 0) % 60} seconds</Typography>
          </div>
        </Card>
      )}
      {isAuthenticated && (
        <Card>
          <Typography variant="h5" component="h2" gutterBottom>Template Status</Typography>
          <Typography variant="body1" gutterBottom>Templates are used to create documents and contracts.</Typography>
          <Grid2 container spacing={2}>
            <Grid2>
              <List sx={{ alignItems: 'flex-start' }}>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={contractTemplatePresent}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  {contractTemplatePresent && (
                    <ListItemText>
                      The Contract Metadata Template has been installed.  
                      This meatadata template contains properties that describe a specific contract and are applied to folders.  
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
                    onChange={togglecontractTemplateHidden}
                    />
                  )}
                </ListItem>
              </List>
            </Grid2>
          </Grid2>
        </Card>
      )}
    </div>
  );
}