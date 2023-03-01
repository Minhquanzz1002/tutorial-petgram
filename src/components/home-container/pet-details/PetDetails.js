import React, { useState, useEffect } from 'react'
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
// import Web3 from 'web3'
// import MyPet from './abis/Pet.json'


function PetDetails({ account, contractData }) {

  const { petId } = useParams()
  // Add state variables
  const [image, setPetImage] = useState('')
  const [petName, setPetName] = useState('')
  const [petOwner, setOwnerName] = useState('')
  const [petCategory, setPetCategory] = useState('')
  const [input, setInput] = useState('')
  const [comment, setComment] = useState('')
  const [codeHash, setCodeHash] = useState('')

  // const web3 = window.web3
  // const accounts = await web3.eth.getAccounts()
  // setAccount(accounts[0])
  // const networkId = await web3.eth.net.getId()
  // const networkData = MyPet.networks[networkId]

  // if (networkData) {
  //   const abi = MyPet.abi
  //   console.log(abi)
  //   const address = MyPet.networks[networkId].address
  //   console.log(address)
  //   const myContract = new web3.eth.Contract(abi, address)
  //   console.log(myContract)
  //   setContractData(myContract)
  // } else {
  //   window.alert(
  //     'Contract is not deployed to the detected network. Connect to the correct network!',
  //   )
  // }

  useEffect(() => {
    if (petId) {
      getMetadata()
      getImage()
    }
  }, [petId, contractData])

  const getImage = (ipfsURL) => {
    if (!ipfsURL) return
    ipfsURL = ipfsURL.split('://')
    return 'https://ipfs.io/ipfs/' + ipfsURL[1]
  }

  const getMetadata = async () => {
    // let data = await fetch(`https://ipfs.io/ipfs/${petId}/metadata.json`)
    let url_metadata = `https://${petId}.ipfs.nftstorage.link/metadata.json`;
    let data = await fetch(url_metadata,)
    data = await data.json()
    const [petOwner, petCategory] = data.description.split(',')
    const imageFormated = getImage(data.image)
    setPetImage(imageFormated)
    setPetName(data.name)
    setOwnerName(petOwner)
    setPetCategory(petCategory)
  }

  const mintNFT = async () => {

    console.log(account)
    try {
      console.log(contractData)
      const data = await contractData.methods.mintPetNFT(`https://${petId}`)
      // .mintPetNFT(`ipfs://bafyreidjljqxypr2ppupogr5g3sr5xxgfdyojwclcvk27wlye4eyaxyzx4/metadata.json`)
        // .mintPetNFT(`https://${petId}`)
        .send({ from: account })

      setCodeHash(data)
      console.log("loi")
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (event) => {
    setInput(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setComment(input)
    setInput('')
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
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>

                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </div>

                <Typography variant="body1" color="primary">
                  0 Likes
                </Typography>
              </div>

              <Typography gutterBottom variant="subtitle1" className="details-text">
                Pet's Details
              </Typography>

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

              {/* Add form */}
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
              <Button type="submit" variant="contained" onClick={handleSubmit}>
                Add comment
              </Button>

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
