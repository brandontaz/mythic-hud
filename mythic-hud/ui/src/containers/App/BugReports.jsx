import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@mui/styles";
import { Button, TextField, Typography, Box, Divider, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

import Nui from '../../util/Nui';

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    position: 'absolute',
    display: "flex",
    flexDirection: "column",
    background: theme.palette.secondary.main,
    padding: "20px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "600px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    margin: "0 auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    zIndex: 50,
  },
  header: {
    lineHeight: '38px',
    background: theme.palette.primary.main,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    width: '15vw',
    marginLeft: '-60px',
    marginTop: '-30px',
    height: '11.5%',
    fontSize: '25px',
    marginBottom: '10px',
    borderRadius: '.5vh',
    userSelect: 'none'
  },
  description: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "10px",
    textAlign: 'center',
    userSelect: 'none'
  },
  subsection: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    marginLeft: 'auto',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

const BugReportForm = () => {
  const classes = useStyles();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [clips, setClips] = useState("");
  const isVisible = useSelector((state) => state.app.bugsvisible);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.show) {
        setTitle("");
        setDescription("");
        setClips("");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleSubmit = () => {
    if (title && description && category) {
      const data = {
        title,
        category,
        description,
        clips,
      };

      Nui.send('BugReport:Submit', data)
        .then((result) => {
          console.log("Submitted successfully:", result);
        //   toast.success("Report submitted successfully!");
          handleClose();
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        //   toast.error("Error submitting report."); 
        });
    } else {
      console.error("All required fields (Title, Category, Description) must be filled");
    //   toast.error("Please fill all required fields.");
    }
  };

  const handleClose = () => {
    Nui.send('BugReport:Close');
  };

  const reportTypes = ['UI', 'Gameplay', '3D Models/Clothing', 'Performance', 'Exploit', 'Other'];

  if (!isVisible) return null;

  return (
    <Box className={classes.flexContainer}>
      <Box className={classes.header}>Report Form</Box>
      <Typography className={classes.description}>
        Please be descriptive, it will help resolve the issue!
      </Typography>
      <Divider style={{ backgroundColor: '#ccc', marginBottom: '15px' }} />
      <Box className={classes.subsection}>
        <TextField
          className={classes.textField}
          label="Title"
          placeholder='eg: UwU has no floor'
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{ maxLength: 50 }}
          required
        />
      </Box>
      <Box className={classes.subsection}>   
        <FormControl className={classes.selectField} variant="outlined" required>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            MenuProps={{
              classes: { paper: classes.paper },
            }}
          >
            {reportTypes.map((type) => (
              <MenuItem key={type} className={classes.menuItem} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box className={classes.subsection}>
        <TextField
          className={classes.textField}
          label="Description"
          placeholder='If possible - repro steps'
          variant="outlined"
          multiline
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Box>
      <Box className={classes.subsection}>
        <TextField
          className={classes.textField}
          label="Clips (optional)"
          placeholder='Clips, screenshots URLs (separated by a new line) include scrolling of F8 window if possible'
          variant="outlined"
          multiline
          rows={3}
          value={clips}
          onChange={(e) => setClips(e.target.value)}
        />
      </Box>
      <Box className={classes.actions}>
        <Button className={classes.button} variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
        <Button className={classes.cancelButton} onClick={handleClose}>
          Cancel
        </Button>
      </Box>
      {/* <ToastContainer />  */}
    </Box>
  );
};

export default BugReportForm;