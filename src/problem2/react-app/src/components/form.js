import logo from '../assets/6187637.jpg'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useEffect, useState} from 'react';
import { FormControl, Select, InputLabel, MenuItem, TextField, Modal, Box, backdropClasses} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack';
import { Button, Typography } from '@mui/material';
import SVG from 'react-inlinesvg';
import ETHLogo from '../assets/tokens/ETH.svg';
import BUSDLogo from'../assets/tokens/BUSD.svg';
import IRISLogo from '../assets/tokens/IRIS.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Backdrop from '@mui/material/Backdrop';
import PasswordModal from './passwordModal';


function Form() {

    const [fromCurrency, setFromCurrency] = useState('ETH');
    const [toCurrency, setToCurrency] = useState('BLUR');
    const [fromValue, setFromValue] = useState(0);
    const [toValue, setToValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [chosenWallet, setChosenWallet] = useState("");
    const [data, setData] = useState([]);
    const [ratioFromTo, setRatioFromTo] = useState(0);
    const [walletDict, setWalletDict] = useState({});

    const logos = [ETHLogo, BUSDLogo, IRISLogo];

    const currencies = [];

    // Create a dictionary to store the highest prices for each currency, assuming that we will follow the highest price for currencies with multiple entries
    const priceDict = {};
    
    //some very simplified data for fun!
    const walletData = [{"name": "Wallet A", "balance": 11, "currency": "ETH"}, {"name": "Wallet B", "balance": 1999, "currency": "BUSD"}, {"name": "Wallet C", "balance": 2100, "currency": "IRIS"}]

    let currencyIdx = 0;

    // Iterate through data to find highest price for each currency
    data.forEach(item => {
        const currency = item.currency;
        const price = item.price;

        if (!currencies.includes(currency)) {
            currencies[currencyIdx] = currency;
            currencyIdx++;
        }
        // if record does not exist or existing record is lower than the current
        if (priceDict[currency] === undefined || price > priceDict[currency]) {
            priceDict[currency] = price;
        }
    });

    const handleFromCurrencyChange = (event) => {
        setFromCurrency(event.target.value);
    }

    const handleToCurrencyChange = (event) => {
        setToCurrency(event.target.value);
    }

    // this method checks if the value keyed into the from box is valid
    const handleFromChange = (e) => {
        //use regex pattern
        const regex = /^[0-9\b]+$/;

        // if value is not null, then we test
        if (e.target.value === '' || regex.test(e.target.value)) {
            //only update value if it is numeric
            setFromValue(e.target.value);
        }
    }

    // this method calculates the number of tokens as a result of the swap
    const calculateToValue = () => {
        //update to value
        setRatioFromTo(priceDict[fromCurrency] / priceDict[toCurrency]);
        const returnVal = fromValue * ratioFromTo;
        setToValue(returnVal);
        return returnVal;
    }

    const deductBalance  = (name) => {
        const remaining = walletDict[name] -fromValue;

        setWalletDict((prev) => ({
            ...prev,
            [name]: remaining 
        }))
    }

    //invoked after user selects which wallet to use
    const handleWalletClick = async (name, currency, balance) => {
        setLoading(true);
        setOpen(false);
        setChosenWallet(name);

        if (currency === fromCurrency && balance >= fromValue && fromValue > 0) {
            // we ask the user for their password to authenticate the transfer
            setLoading(false);
            handleOpenPasswordModal();
        } 

        setTimeout(() => {
            setLoading(false);
           
            if (fromValue === 0) {
                toast('Error occured... Trading value must be more than 0.', {   
                    type:'error',            
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",})
            } else if (balance < fromValue) {
                toast('Error occured... You have insufficient units to trade', {   
                    type:'error',            
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",})
            }
        }, 2000);
    }

    // should cause the password modal to appear for the input of password to confirm
    const handleOpenPasswordModal = () => {
        setOpenPasswordModal(true);
    }

    const handleClosePasswordModal = () => {
        setOpenPasswordModal(false);
    }

    const wallets = walletData.map((wallet, index) => {
        return (
            <Button sx={{'backgroundColor': 'info.main', 'width': '100%', 'minHeight': '10vh' ,'marginY': '1vh', 
            'borderBottom': '2px solid', 'borderLeft': '2px solid', 'borderColor':'secondary.main', 'borderRadius': '8px',
            'color': 'secondary.main'}} onClick={() => handleWalletClick(wallet.name, wallet.currency, walletDict[wallet.name])}>
                <img src={logos[index]} height={40} width={40} style={{marginRight:'20px'}}/>
                <div>
                    <Typography sx={{'fontSize': 18, 'fontWeight': 'bold'}}>
                        {wallet.name}
                    </Typography>
                    <Typography>
                        Currency: {wallet.currency}
                    </Typography>
                    <Typography>
                        Balance: {walletDict[wallet.name]} units
                    </Typography>
                </div>
            </Button>
        )
    })

    const fromCurrencyOptions = currencies.map((currency) => {
        // I tried displaying the icons but couldnt get it to work :/
        const imageSrc = `../assets/tokens/${currency}.svg`;

        if (currency === toCurrency) {
            return (
                <MenuItem key={currency} value={currency} disabled>
                    <SVG
                        src={imageSrc}
                        width={20}
                        height="auto"
                    />
                    {currency}
                </MenuItem>
            )
        } else {
            return (
                <MenuItem key={currency} value={currency} >
                    <SVG
                        src={imageSrc}
                        width={20}
                        height="auto"
                    />
                    {currency}
                </MenuItem>
            )
        }
    })

    const toCurrencyOptions = currencies.map((currency) => {
        const imageSrc = `../assets/tokens/${currency}.svg`;
        
        if (currency === fromCurrency) {
            return (
                <MenuItem key={currency} value={currency} disabled>
                    <SVG
                        src={imageSrc}
                        width={20}
                        height="auto"
                    />
                    {currency}
                </MenuItem>
            )
        } else {
            return (
                <MenuItem key={currency} value={currency}>
                    <SVG
                        src={imageSrc}
                        width={20}
                        height="auto"
                    />
                    {currency}
                </MenuItem>
            )
        }
    })

    const openModal = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        calculateToValue(); // Calculate toValue whenever fromValue changes
    }, [fromValue, toValue, fromCurrency, toCurrency, data]);

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch('https://interview.switcheo.com/prices.json');
    
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const jsonData = await response.json();
            setData(jsonData);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
          }
        }
    
        fetchData();

        // update wallet data into a dictionary for easier retrieval
        walletData.forEach(item => {
            const balance = item.balance;
            const name = item.name;
            const currency = item.currency;

            //in this case name would be like the ID
            setWalletDict((prev) => ({
                ...prev,
                [name]: balance 
            }))
        })
    },[]);
    

    return (
        <div>
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />

        <div style={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems:'center', height: '100vh', width: '100vw'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <img src={logo} style={{width: "15vw", marginTop:"4vh"}}></img>
            </div>

        <div className={{display: 'flex', flexDirection: 'column'}}>
            <form onSubmit={(e) => e.preventDefault()}>
                <Card sx={{minWidth: '30vw', boxShadow: 0, borderRadius: '8px', borderBottom: '2px solid #6663DE', borderLeft: '2px solid #6663DE', backgroundColor:"info.main"}}>
                    <CardContent>
                        <Button sx={{backgroundColor: 'secondary.main', color: 'white', marginBottom: 4}}>
                            <Typography sx={{fontSize: 12}}>
                                Swap
                            </Typography>
                        </Button>
                        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" alignContent={'center'}>
                            <Typography sx={{fontSize: 12, color: 'secondary.main', marginRight: '8px'}}>
                                Swap from
                            </Typography>

                            <FormControl style={{minWidth: 120,}} size='small' color={'secondary'}>
                                <InputLabel id="fromCurrency" sx={{fontSize: 12}}>Currency</InputLabel>
                                <Select
                                    labelId="fromCurrency"
                                    id="fromCurrencySelect"
                                    value={fromCurrency}
                                    onChange={handleFromCurrencyChange}
                                    style={{backgroundColor: '#6663DE60', borderColor: 'transparent'}}
                                >
                                    {fromCurrencyOptions}
                                </Select>
                            </FormControl>
                        </Stack>

                        <FormControl fullWidth size='small' style={{borderRadius: 5 ,marginTop: '3vh', borderColor: "transparent", backgroundColor: '#6663DE60'}}>
                            <InputLabel sx={{fontSize: 12}}>
                                Amount to trade
                            </InputLabel>
                            <TextField value={fromValue} variant='standard'onChange={handleFromChange} InputProps={{ disableUnderline: true, }} sx={{minHeight: '8vh', paddingX: '2vh', paddingY: '3vh', fontSize: 12}}>
                            </TextField>
                        </FormControl>

                        <Typography style={{fontSize: 12, color: 'grey'}}>
                            1 {fromCurrency} = ${priceDict[fromCurrency]}
                        </Typography>

                        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" alignContent={'center'} style={{marginTop: '3vh'}}>
                            <Typography sx={{fontSize: 12, color: 'secondary.main', marginRight: '8px'}}>
                                Swap to
                            </Typography>

                            <FormControl style={{minWidth: 120,}} size='small' color={'secondary'}>
                                <InputLabel id="toCurrency" sx={{fontSize: 12}}>Currency</InputLabel>
                                <Select
                                    labelId="toCurrency"
                                    id="toCurrencySelect"
                                    value={toCurrency}
                                    onChange={handleToCurrencyChange}
                                    style={{backgroundColor: '#6663DE60', borderColor: 'transparent'}}
                                >
                                    {toCurrencyOptions}
                                </Select>
                            </FormControl>
                        </Stack>

                        <FormControl fullWidth size='small' style={{borderRadius: 5 ,marginTop: '3vh', borderColor: "transparent", backgroundColor: '#6663DE60'}}>
                            <InputLabel sx={{fontSize: 12}}>
                                Amount received
                            </InputLabel>
                            <TextField value={toValue} variant='standard' InputProps={{ disableUnderline: true, }} sx={{minHeight: '8vh', paddingX: '2vh', paddingY: '3vh', fontSize: 12}} disabled />
                        </FormControl>
                        
                        <Typography style={{fontSize: 12, color: 'grey'}}>
                            1 {toCurrency} = ${priceDict[toCurrency]}
                        </Typography>

                        <div style={{backgroundColor: "#6663DE30",padding: "1vh", marginTop: "2vh", borderRadius: '5px'}}>
                            <Typography style={{fontSize: 12, backgroundColor:'secondary.main'}}>
                                1 {fromCurrency} = {ratioFromTo} {toCurrency}
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
        
        <div style={{paddingTop: '3vh'}}>
            <Button onClick={openModal} sx={{backgroundColor: 'secondary.main',color: 'white', marginBottom: 4, minWidth: '10vw', ':hover': {
            bgcolor: '#F79421',
            color: 'white',
            boxShadow: 2,
            },}}>
                <Typography sx={{fontSize: 16}}>
                    Trade
                </Typography>
            </Button>
        </div>

        <div style={{ position: 'relative' }}>

            {/* Progress Indicator */}
            {loading && (
                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            )}

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400,
                    border: '3px solid #6663DE', borderRight: 0, borderTop: 0, p: 3, backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ 'marginBottom': '2vh' }} sx={{ 'fontSize': 20 }}>
                        Choose a Wallet
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignContent: "start" }}>
                        {wallets}
                    </div>
                </Box>
            </Modal>

            <PasswordModal handleOpen={handleOpenPasswordModal} handleClose={handleClosePasswordModal} deductBalance={deductBalance} isOpen={openPasswordModal} chosen={chosenWallet} isLoading={loading} setIsLoading={setLoading}></PasswordModal>
            </div>
    </div>
    </div>
    )
}

export default Form;
