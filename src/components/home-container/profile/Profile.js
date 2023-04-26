import React, { createRef, useRef, useEffect, useState } from 'react'
import {
    Grid,
    Typography,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListSubheader,
    ListItemText,
    SvgIcon,
    IconButton,
    Button,
    ImageListItemBar,
    ImageListItem,
    Paper,
    Tabs,
    Tab,
    TextField,
    Box,
    MenuItem,
    FormControl,
    Snackbar,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import { apiKey } from '../../../APIKEYS'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Link } from 'react-router-dom'
import sha1 from 'sha1';
import './Profile.css'
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        height: "8rem",
        width: "8rem",
    },

    avatar: {
        height: "11vw",
        width: "11vw",
    },
}));


function Profile({ account, contractData }) {
    const classes = useStyles();
    const [petsData, setPetsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [value, setValue] = useState(0);
    const [user, setUser] = useState('')
    const [nfts, setNFTs] = useState([])
    const [image, setImage] = useState(null)
    const inputFileRef = createRef(null)
    const [fullname, setFullname] = useState('')
    const refFullname = useRef('')
    const [bio, setBio] = useState('')
    const [gender, setGender] = useState(null)
    const [facebook, setFacebook] = useState('')
    const [instagram, setInstagram] = useState('')
    const [open, setOpen] = useState(false);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        getUserData()
        loadPets()
        loadNFTs()
    }, [account])

    const getUserData = async () => {
        let user_hash = sha1(account);
        let data = await fetch(`http://localhost:8000/api/user/getOne/${user_hash}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let userAccount = await data.json();
        setUser(userAccount);
        if (userAccount) {
            setBio(userAccount.bio);
            setFullname(userAccount.fullname);
            setGender(userAccount.gender);
            setFacebook(userAccount.facebook);
            setInstagram(userAccount.instagram);
        }
    }

    const loadPets = async () => {
        try {
            setLoading(true)
            let cids = await fetch('https://api.nft.storage', {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            })
            cids = await cids.json()
            const temp = []
            for (let cid of cids.value) {
                if (cid?.cid) {
                    let data2 = await fetch(`http://localhost:8000/api/getOne/${cid.cid}`,{
                        headers: {
                        'Content-Type': 'application/json',
                        },
                    });
                    data2 = await data2.json();
                    if (data2.created != account) {
                        continue;
                    }

                    let url_metadata = `https://${cid.cid}.ipfs.nftstorage.link/metadata.json`;
                    let data = await fetch(url_metadata,)
                    data = await data.json()

                    const getImage = (ipfsURL) => {
                        if (!ipfsURL) return
                        ipfsURL = ipfsURL.split('://')
                        return 'https://ipfs.io/ipfs/' + ipfsURL[1]
                    }


                    data.image = await getImage(data.image)
                    data.cid = cid.cid
                    data.created = cid.created
                    temp.push(data)
                }
            }
            setPetsData(temp)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const loadNFTs = async () => {
        try {
            let totalSupply = await contractData.methods.totalSupply().call({ from: account });
            let temp = []
            for (let i = 1; i <= totalSupply; i++) {
                let owner = await contractData.methods.ownerOf(i).call({ from: account });
                if (owner == account) {
                    let uri = await contractData.methods.tokenURI(i).call({ from: account });
                    let data = await fetch(uri)
                    data = await data.json()

                    const getImage = (ipfsURL) => {
                        if (!ipfsURL) return
                        ipfsURL = ipfsURL.split('://')
                        return 'https://ipfs.io/ipfs/' + ipfsURL[1]
                    }


                    data.image = await getImage(data.image)
                    data.cid = uri.slice(8, -35)
                    temp.push(data)
                }
            }
            setNFTs(temp)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const handleOnChangeImage = (event) => {
        const newImage = event.target?.files?.[0];
        if (newImage) {
            setImage(URL.createObjectURL(newImage))
        }
    }

    const setAvatar = (newImage) => {
        if (image) {
            URL.revokeObjectURL(image);
            inputFileRef.current.value = null;
        }
        setImage(newImage);
    }

    const handleOnClickUploadProfile = (event) => {
        event.preventDefault();
        console.log(bio)
        console.log(fullname)
        console.log(gender)
        console.log(typeof gender)
        console.log(facebook)
        console.log(instagram)
        fetch(`http://localhost:8000/api/user/update/${sha1(account)}`, {
            method: 'PATCH', body: JSON.stringify({ fullname: fullname, bio: bio, facebook: facebook, instagram: instagram, gender : gender}),
            headers: { 'Content-type': 'application/json; charset=UTF-8', }
        }).then(() => {
            getUserData()
            setOpen(true);
        })
    }


    return (
        <Container
            className="root-pet-details"
            style={{ minHeight: '100vh - 84px - 143px', paddingBottom: '3rem' }}
        >
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}
                        direction="column"
                        container
                        alignItems="center"
                        style={{ backgroundColor: "#F0F8FF", borderRadius: "3%" }}
                    >
                        <div className="avatar" id="avatar">
                            <div id="preview">
                                <img src={image ? image : user ? user.avatar : ''} id="avatar-image" className="avatar_img" />
                            </div>
                            <div className="avatar_upload">
                                <label className="upload_label">Upload
                                    <input type="file" id="upload" accept="image/*" onChange={handleOnChangeImage} />
                                </label>
                            </div>
                        </div>
                        <Typography variant='h5' noWrap style={{ marginTop: '0.5rem' }}>{user ? user.fullname : 'Unnamed'}<CheckCircleIcon style={{ color: "blue" }} /></Typography>
                        <Typography variant='h6' noWrap style={{ marginTop: '0.5rem', color: "rgb(169, 169, 169)", fontSize: "15px" }}>{user ? user.bio : 'bio'}</Typography>

                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader" style={{ fontSize: "20px", fontWeight: "bold" }}>About</ListSubheader>
                            }
                        >
                            <ListItem>
                                <ListItemIcon>
                                    <SvgIcon viewBox="0 0 16 16" fontSize="large">
                                        <path d="M11.5 1a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-3.45 3.45A4 4 0 0 1 8.5 10.97V13H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V14H6a.5.5 0 0 1 0-1h1.5v-2.03a4 4 0 1 1 3.471-6.648L14.293 1H11.5zm-.997 4.346a3 3 0 1 0-5.006 3.309 3 3 0 0 0 5.006-3.31z" fill-rule="evenodd" />
                                    </SvgIcon>
                                </ListItemIcon>
                                <ListItemText primary={user ? user.gender == true ? 'Male' : 'Female' : 'Unknown'} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <LocationOnIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Vietnamese" />
                            </ListItem>
                            <ListItem onClick={() => window.open(user ? user.facebook : "https://www.facebook.com/", "_blank")} style={{ cursor: "pointer" }}>
                                <ListItemIcon>
                                    <FacebookIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Facebook.com" />
                            </ListItem>
                            <ListItem onClick={() => window.open(user ? user.instagram : "https://www.instagram.com/", "_blank")} style={{ cursor: "pointer" }}>
                                <ListItemIcon>
                                    <InstagramIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primary="Instagram.com" />
                            </ListItem>

                        </List>
                    </Grid>

                    <Grid item xs={12} sm={9} container spacing={1}>
                        <Grid item xs={12} sm={12}>
                            <Paper>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                >
                                    <Tab label="Pet Created" {...a11yProps(0)} />
                                    <Tab label="NFT's" {...a11yProps(1)} />
                                    <Tab label="Update Profile" {...a11yProps(2)} />
                                </Tabs>
                            </Paper>
                            <TabPanel value={value} index={0}>
                                <Grid item xs={12} sm={12} container spacing={1}>
                                    {petsData.length ? (
                                        petsData.map((pet, index) => (
                                            <Grid item xs={6} sm={4} key={index}>
                                                <ImageListItem style={{ height: '450px', listStyle: 'none' }}>
                                                    <img src={pet.image} alt={pet.name} />
                                                    <ImageListItemBar
                                                        title={pet.name}
                                                        subtitle={<span>by: {pet.description}</span>}
                                                        actionIcon={
                                                            <IconButton
                                                                aria-label={`info about ${pet.name}`}
                                                                className="icon"
                                                            >
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    component={Link}
                                                                    to={`/pet-details/${pet.cid}`}
                                                                    className="view-btn"
                                                                >
                                                                    View
                                                                </Button>
                                                            </IconButton>
                                                        }
                                                    />
                                                </ImageListItem>
                                            </Grid>
                                        ))
                                    ) : (
                                        <h2>No Pets Yet...</h2>
                                    )}
                                </Grid>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Grid item xs={12} sm={12} container spacing={1}>
                                    {nfts.length ? (
                                        nfts.map((pet, index) => (
                                            <Grid item xs={6} sm={4} key={index}>
                                                <ImageListItem style={{ height: '450px', listStyle: 'none' }}>
                                                    <img src={pet.image} alt={pet.name} />
                                                    <ImageListItemBar
                                                        title={pet.name}
                                                        subtitle={<span>by: {pet.description}</span>}
                                                        actionIcon={
                                                            <IconButton
                                                                aria-label={`info about ${pet.name}`}
                                                                className="icon"
                                                            >
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    component={Link}
                                                                    to={`/pet-details/${pet.cid}`}
                                                                    className="view-btn"
                                                                >
                                                                    View
                                                                </Button>
                                                            </IconButton>
                                                        }
                                                    />
                                                </ImageListItem>
                                            </Grid>
                                        ))
                                    ) : (
                                        <h2>No Pets Yet...</h2>
                                    )}
                                </Grid>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <form method='patch'>
                                    <FormControl fullWidth margin="normal" focused>
                                        <TextField
                                            type="text"
                                            required
                                            fullWidth
                                            ref={refFullname}
                                            id="outlined-basic"
                                            label="Fullname"
                                            variant="outlined"
                                            defaultValue={user ? user.fullname : "Unnamed"}
                                            onChange={(e) => setFullname(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <TextField
                                            required
                                            fullWidth
                                            id="outlined-select-currency-native"
                                            label="Gender"
                                            select
                                            variant="outlined"
                                            defaultValue={user ? user.gender ? "true" : "false" : "true"}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <MenuItem value="true">Male</MenuItem>
                                            <MenuItem value="false">Female</MenuItem>
                                        </TextField>
                                    </FormControl>
                                    <FormControl fullWidth margin="normal" focused>
                                        <TextField
                                            type="text"
                                            fullWidth
                                            id="outlined-basic"
                                            label="Bio"
                                            variant="outlined"
                                            defaultValue={user ? user.bio : "Unknown"}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin="normal" focused>
                                        <TextField
                                            type="url"
                                            fullWidth
                                            id="outlined-basic"
                                            label="Facebook"
                                            variant="outlined"
                                            defaultValue={user ? user.facebook : "Unknown"}
                                            onChange={(e) => setFacebook(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin="normal" focused>
                                        <TextField
                                            type="url"
                                            fullWidth
                                            id="outlined-basic"
                                            label="Instagram"
                                            variant="outlined"
                                            defaultValue={user ? user.instagram : "Unknown"}
                                            onChange={(e) => setInstagram(e.target.value)}
                                        />
                                    </FormControl>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Button variant="contained" type="submit" color='primary' style={{ width: "17rem", marginTop: "20px" }} onClick={handleOnClickUploadProfile}>Save</Button>
                                    </div>
                                </form>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>

                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Update profile successfully
                    </Alert>
                </Snackbar>
            </div>
        </Container>
    )
}

export default Profile
