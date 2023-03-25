import React, { useState, useEffect } from 'react'      // Hooks 
import { useParams } from 'react-router'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Grid,
  Container,
  Typography,
  Button,
  Card,
  StylesProvider,
} from '@material-ui/core'
import './PetDetails.css'
import { apiKey } from '../../../APIKEYS'


function PetDetails({ account, contractData }) {

  const { petId } = useParams()
  // local state (using Hook)
  const [image, setPetImage] = useState('')
  const [petName, setPetName] = useState('')
  const [petOwner, setOwnerName] = useState('')
  const [petCategory, setPetCategory] = useState('')
  const [input, setInput] = useState('')              // value of TextField comment
  const [comment, setComment] = useState('')  
  const [codeHash, setCodeHash] = useState('')        // transaction hash. Ex: 0x140d9421443d17b30c91325b693835e5ed0085d159cd1a8268368c3272f79502

  useEffect(() => {
    // Callback
    if (petId) {
      getMetadata()
      getImage()
    }
  }, [petId, contractData]) // dependency array: Callback khi petId hoặc contractData thay đổi


  const getImage = (ipfsURL) => {
    if (!ipfsURL) return
    ipfsURL = ipfsURL.split('://')
    return 'https://ipfs.io/ipfs/' + ipfsURL[1]
  }

  // get metadata from IPFS
  const getMetadata = async () => {
    let url_metadata = `https://${petId}.ipfs.nftstorage.link/metadata.json`;
    let data = await fetch(url_metadata,)     // get metadata
    data = await data.json()
    const [petOwner, petCategory] = data.description.split(',')
    const imageFormated = getImage(data.image)
    setPetImage(imageFormated)
    setPetName(data.name)
    setOwnerName(petOwner)
    setPetCategory(petCategory)
  }

  const mintNFT = async () => {
    try {
      const data = await contractData.methods.mintPetNFT(`https://${petId}.ipfs.nftstorage.link/metadata.json`).send({ from: account })
      setCodeHash(data)
    } catch (err) {
      console.error(err)
    }
  }

  // event onChange for TextField comment
  // onChange occurs when the element loses focus
  const handleChange = (event) => {
    // get value from TextField -> set value for input
    setInput(event.target.value)
  }

  // event add comment
  const handleSubmit = (event) => {
    event.preventDefault()
    setComment(input)
    setInput('')            // reset value TextField comment
  }



  return (
    <StylesProvider injectFirst>
      <Container
        className="root-pet-details"
        style={{ minHeight: '50vh', paddingBottom: '3rem' }}
      >
        <div className="">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} className="grid-container">
              {/* Add pet details */}
              <div className="flex-container">
                <h2>{`${petName} the ${petCategory}`}</h2>
                <Button
                  variant="contained"
                  className="wallet-btn"
                  color="primary"
                  onClick={mintNFT}
                >
                  Mint NFT
                </Button>
              </div>

              <img className="img" src={image} alt="pet" />
              <div className="flex-container">
                <div>
                  <IconButton aria-label="add to favorites"><FavoriteIcon /></IconButton>
                  <IconButton aria-label="share"><ShareIcon /></IconButton>
                </div>

                <Typography variant="body1" color="primary">0 Likes</Typography>
              </div>

              <Typography gutterBottom variant="subtitle1" className="details-text">Pet's Details</Typography>

              <Typography variant="body2" gutterBottom className="details-text">
                Full rights and credits to the owner @{petOwner}...
              </Typography>

            </Grid>

            <Grid item xs={12} sm={6}>
              {/*Add Transaction Confirmation: */}

              {codeHash ? (
                <Card className="code-hash">
                  <Typography gutterBottom variant="subtitle1">
                    Confirmation Transaction:
                  </Typography>
                  <p>

                    TransactionHash: <span>{codeHash.transactionHash}</span>{" "}
                  </p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      "https://mumbai.polygonscan.com/tx/" +
                      codeHash.transactionHash
                    }
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      className="wallet-btn"
                    >
                      See transaction
                    </Button>
                  </a>
                </Card>
              ) : (
                ""
              )}

              {/* Add form comment*/}
              <form noValidate autoComplete="off">
                <TextField
                  id="outlined-basic"
                  label="Comment"
                  variant="outlined"
                  value={input}
                  onChange={handleChange}
                  className="text-field"
                />
              </form>
              <Button type="submit" variant="contained" onClick={handleSubmit}>Add comment</Button>

              {/* Display comments  */}
              {
                comment ? (
                  <ListItem style={{ paddingLeft: '0px' }}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className="inline"
                            color="textPrimary"
                          >
                            {account}:
                          </Typography>
                          {` ${comment}`}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ) : (
                  <h2>No comments</h2>
                )
              }
            </Grid>
          </Grid>
        </div>
      </Container>
    </StylesProvider>
  )
}

export default PetDetails
