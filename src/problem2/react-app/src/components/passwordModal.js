import { Modal, Box, Typography, TextField, FormControl, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';

function PasswordModal (props) {

    const [password, setPassword] = useState("");
    const [wrongPassword, setWrongPassword] = useState(false);
    // hardcoded value for password
    const correctPassword = "password";

    useEffect(() => {
        
    }, [password]);

    const textInput = () => {
        if (wrongPassword) {
            return (
                <div>
                    <FormControl size='small' style={{borderRadius: 5, borderColor: "transparent", marginTop: "1vh"}}>
                        <TextField value={password} error helperText="Wrong password." onChange={(e) => setPassword(e.target.value)} type='password' InputProps={{ disableUnderline: true, }} 
                        sx={{ fontSize: 12, borderRadius: "5px"}} style={{backgroundColor:'', borderColor: 'transparent'}} >
                        </TextField>
                    </FormControl>
                </div>
            )
        } else {
            return (
                <div>
                    <FormControl size='small' style={{borderRadius: 5, borderColor: "transparent", marginTop: "1vh"}}>
                        <TextField value={password} onChange={(e) => setPassword(e.target.value)} type='password' InputProps={{ disableUnderline: true, }} 
                        sx={{ fontSize: 12, borderRadius: "5px"}} style={{backgroundColor:'', borderColor: 'transparent'}} >
                        </TextField>
                    </FormControl>
                </div>
            )
        }
    }

    const submitForm = () => {
        //validate password
        if (password === correctPassword) {
            props.setIsLoading(true);
            props.deductBalance(props.chosen)
            props.handleClose();
            setWrongPassword(false);
            setTimeout(() => {
                props.setIsLoading(false);
                // success condition
                toast('The swap was a success!', {     
                    type: 'success',          
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
                setPassword("")
            }, 3000)
        } else {
            setWrongPassword(true)
        }
    }

    return (
        <Modal open={props.isOpen} onClose={props.handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400,
                    border: '3px solid #6663DE', borderRight: 0, borderTop: 0, p: 3, backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
                <Typography variant="h6" style={{ 'marginBottom': '2vh' }} sx={{ 'fontSize': 20 }}>
                    Enter password
                </Typography>
                <div style={{ display: "flex", flexDirection: "column", alignContent: "start" }}>
                    <Typography>
                        Please enter your password for {props.chosen}
                    </Typography>

                    {textInput()}
                
                    <div style={{paddingTop: '2vh'}}>
                        <Button onClick={submitForm} sx={{backgroundColor: 'secondary.main',color: 'white', minWidth: '10vw', ':hover': {
                        bgcolor: '#F79421', // theme.palette.primary.main
                        color: 'white',
                        boxShadow: 2,
                        },}}>
                            <Typography sx={{fontSize: 16}}>
                                Submit
                            </Typography>
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default PasswordModal;