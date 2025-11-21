import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
  showCheckbox?: boolean;
  checkboxLabel?: string;
  checkboxValue?: boolean;
  onCheckboxChange?: (value: boolean) => void;
}

const styleConfirm = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  onClose,
  onSubmit,
  loading = false,
  showCheckbox = false,
  checkboxLabel = "Mark as Document Collected",
  checkboxValue = false,
  onCheckboxChange,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styleConfirm}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "grey.600",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {showCheckbox && (
          <FormControlLabel
            control={
              <Checkbox
                checked={checkboxValue}
                onChange={(e) => onCheckboxChange?.(e.target.checked)}
                color="primary"
              />
            }
            label={checkboxLabel}
          />
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: "bold", minWidth: "100px" }}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;



// how to use it
// with check box-----------

//   <ConfirmationModal
//         open={isMdlOpen}
//         title="Are you sure you want to save?"
//         onClose={handleMdlClose}
//         onSubmit={handleFinalSubmit}
//         loading={isButtonLoading}
//         showCheckbox={true}
//         checkboxLabel="Mark as Document Collected"
//         checkboxValue={markDocumentCollected}
//         onCheckboxChange={setMarkDocumentCollected}
//       />


// without check box------


{/* <ConfirmationModal
  open={isDeleteOpen}
  title="Are you sure you want to delete this record?"
  onClose={handleDeleteClose}
  onSubmit={handleDeleteConfirm}
  loading={isDeleteLoading}
/> */}
