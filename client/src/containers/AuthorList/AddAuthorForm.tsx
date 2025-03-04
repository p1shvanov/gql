import { FC, useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material'; // Updated MUI imports
import { useMutation } from '@apollo/client';
import ErrorComponent from '../../components/Error';
import { ADD_AUTHOR_MUTATION } from './graphql';

const AddAuthorForm: FC<{
  open: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}> = ({ open, handleClose, onSuccess }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [bio, setBio] = useState('');

  const [addAuthor, { data, error, loading }] =
      useMutation(ADD_AUTHOR_MUTATION);

  const addAuthorCallback = useCallback(() => {
    addAuthor({
      variables: {
        author: {
          firstname,
          lastname,
          middlename,
          bio,
        },
      },
    });
  }, [firstname, lastname, middlename, bio, addAuthor]);

  useEffect(() => {
    if (data) {
      onSuccess();
      handleClose();
    }
  }, [data, handleClose, onSuccess]);

  return (
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          fullWidth
          maxWidth="sm"
      >
        <DialogTitle>Add Author</DialogTitle>
        <DialogContent>
          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
                <CircularProgress />
              </Box>
          ) : error ? (
              <ErrorComponent error={error} />
          ) : (
              <Box sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Last Name"
                    type="text"
                    fullWidth
                    value={lastname}
                    onChange={(event) => setLastname(event.target.value)}
                />
                <TextField
                    margin="dense"
                    label="First Name"
                    type="text"
                    fullWidth
                    value={firstname}
                    onChange={(event) => setFirstname(event.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Middle Name"
                    type="text"
                    fullWidth
                    value={middlename}
                    onChange={(event) => setMiddlename(event.target.value)}
                />
                <TextField
                    label="Bio"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                />
              </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addAuthorCallback} color="primary" disabled={loading}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default AddAuthorForm;