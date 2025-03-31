import { Typography, Alert, Card, Grid2, List, ListItem, ListItemIcon, Checkbox, ListItemText, Switch, FormControlLabel } from "@mui/material";
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

  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated) {
        try {
          // Get the list of temokates
          await client.auth.refreshToken();
          const templates = await client.metadataTemplates.getEnterpriseMetadataTemplates();

          // look for the contract and document template and set the state accordingly
          const contractTemplate = templates.entries?.find(template => template.templateKey === 'contract');
          const documentTemplate = templates.entries?.find(template => template.templateKey === 'contractDocument');
          setContractTemplatePresent(!!contractTemplate);
          setContractTemplateHidden(!!contractTemplate?.hidden);
          setDocumentPresent(!!documentTemplate);
          setDocumentHidden(!!documentTemplate?.hidden);
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
        <Alert severity="warning">
          You are not logged into box. Please log in to see the status of the app.
        </Alert>
      )}
      <Card>
        <Typography variant="h5" component="h2" gutterBottom>App Status</Typography>
        <Typography variant="body1" gutterBottom>The app is currently {isAuthenticated ? "logged in" : "not logged in"}.</Typography>
        {lastError && (
          <Alert severity="error">{lastError}</Alert>
        )}
        {isAuthenticated && (
          <div>
             <Typography>Expires in {Math.floor((expriresIn ?? 0) / 60)} minutes and {(expriresIn ?? 0) % 60} seconds</Typography>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </Card>
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
                {isAuthenticated && contractTemplatePresent && (
                  <ListItemText>
                    The Contract Metadata Template has been installed.  
                    This meatadata template contains properties that describe a specific contract and are applied to folders.  
                    Contract Folders contain a list of Contract Files.
                    {contractTemplateHidden && (
                      <Typography component={"span"}>
                        This template is currently <em>hidden</em>, which means it will <em>not be visaable</em> in the Box Web UI.  Use the Toggle to change that.
                      </Typography>)}
                    {!contractTemplateHidden && (
                      <Typography component={"span"}>
                        This template is currently <em>not hidden</em>, which means <em>it will be visable</em> in the Box Web UI.  Use the Toggle to change that.
                      </Typography>)}
                    </ListItemText>
                  )}
                {isAuthenticated && contractTemplatePresent && (
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
    </div>
  );
}