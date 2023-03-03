import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import API from 'src/services/api';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function DeleteLog(props) {
  const {id, open, handleClose} = props;
  const router = useRouter();

  const handleDelete = async () => {
    try {
        const response = await API.delete("log/"+ id);
        toast.success("Log deleted successfully", {
            position: toast.POSITION.TOP_CENTER,
        });
        router.push('/logs');
    } catch (err) {
        console.log(err)
        toast.error("Failed to delete log", {
            position: toast.POSITION.TOP_CENTER,
        });
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you sure, you want to Delete this Log?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Once you delete this log, you will not be able to recover it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}>
            No
        </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}>
            Yes, Delete
        </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
