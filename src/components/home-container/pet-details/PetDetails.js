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
  Tooltip,
  SvgIcon,
  Chip,
} from '@material-ui/core'
import './PetDetails.css'
import { apiKey } from '../../../APIKEYS'


function PetDetails({ account, contractData }) {

  const { petId } = useParams()
  const [image, setPetImage] = useState('')
  const [petName, setPetName] = useState('')
  const [petOwner, setOwnerName] = useState('')
  const [petCategory, setPetCategory] = useState('')
  const [petType, setPetType] = useState('')
  const [petFur, setPetFur] = useState('')
  const [input, setInput] = useState('')              // value of TextField comment
  const [comments, setComments] = useState([])  
  const [codeHash, setCodeHash] = useState('')        // transaction hash. Ex: 0x140d9421443d17b30c91325b693835e5ed0085d159cd1a8268368c3272f79502
  const [favourite, setFavourite] = useState(false)
  const [favouriteNumber, setFavouriteNumber] = useState(0)
  const [minted, setMinted] = useState(true)
  const [tokenId, setTokenId] = useState('')
  const openSeaURL = "https://testnets.opensea.io/assets/mumbai/0x2f93332702fe932ebdf0e339f210ab63435a3184";
  // const [edit, setEdit] = useState(false)

  useEffect(() => {
    // Callback
      if (petId) {
        getMetadata()
        getImage()
        getTokenId()
        getMinted()
        setComments([])
        getData();
      }
  }, [])

  useEffect(() => {
      getMinted()
  }, [codeHash])

  const getImage = (ipfsURL) => {
    if (!ipfsURL) return
    ipfsURL = ipfsURL.split('://')
    return 'https://ipfs.io/ipfs/' + ipfsURL[1]
  }

  const getData = async () => {
    try {
      let data = await fetch(`http://localhost:8000/api/getOne/${petId}`,{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      data= await data.json();
      let commentsTemp = []
      for (let j = 0; j < data.comments.length; j++){
        commentsTemp.push({user_id: data.comments[j].user_id , comment:  data.comments[j].comment});
      }
      setComments(commentsTemp)
      setFavouriteNumber(data.favourites.length)
      for (let i = 0; i < data.favourites.length; i++) {
        if (data.favourites[i] == account) {
          setFavourite(true);
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
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
    setPetType(data.attributes[0].value)
    setPetFur(data.attributes[1].value)
    setOwnerName(petOwner)
    setPetCategory(petCategory)
  }

  const getTokenId = async () => {
    try{
      let url_metadata = `https://${petId}.ipfs.nftstorage.link/metadata.json`
      let length = await contractData.methods.totalSupply().call({from: account})
      for (let i = 1; i <= length; i++) {
        let data = await contractData.methods.tokenURI(i).call({from: account})
        if (data === url_metadata){
          setTokenId(i)
          break;
        }
      }
    } catch(err) {
      console.log(err)
    }
  }

  const renderComments = comments.map(comment =>  (
    <ListItem style={{paddingLeft: '15px'}}>
    <ListItemAvatar>
      <Avatar alt="Remy Sharp" src="https://raw.githubusercontent.com/Minhquanzz1002/tutorial-petgram/8dbc5eaf96cdc068acf98e82fd81c9f040b12301/src/images/avatar.png" />
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
            {comment.user_id}:
          </Typography>
          {comment.comment}
        </React.Fragment>
      }
    />
    </ListItem>
  ))

  const getMinted = async () => {
    try {
      let data2 = await fetch(`http://localhost:8000/api/getOne/${petId}`,{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      data2 = await data2.json();
      console.log(data2.created)
      console.log(account)
      if (data2.created != account) {
        setMinted(true);
        return;
      }
      let url_metadata = `https://${petId}.ipfs.nftstorage.link/metadata.json`;
      let data = await contractData.methods.checkTokenURI(url_metadata).call({ from: account });
      if (data == true) {
        setMinted(false);
      }
      if (data == false) {
        setMinted(true);
      }

      
    }catch (err) {
      console.error(err)
    }
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
  const handleComment = async (event) => {
    event.preventDefault()
    comments.push({user_id: account, comment: input});
    await fetch(`http://localhost:8000/api/insert/comment/${petId}`, {method: 'PATCH', body: JSON.stringify({user_id: account, comment: input}), 
        headers: {'Content-type': 'application/json; charset=UTF-8',}
    });
    setInput('')            // reset value TextField comment
  }

  // Event favourite / unfavorite
  const handleFavourite = async () => {
    if (favourite) {
      await fetch(`http://localhost:8000/api/update/unfavourite/${petId}`, {method: 'PATCH', body: JSON.stringify({user_id: account}), 
        headers: {'Content-type': 'application/json; charset=UTF-8',}
      });
    }else{
      await fetch(`http://localhost:8000/api/update/favourite/${petId}`, {method: 'PATCH', body: JSON.stringify({user_id: account}), 
        headers: {'Content-type': 'application/json; charset=UTF-8',}
      });
    }
    getData()
    setFavourite(!favourite)
  };



  return (
      <Container
        className="root-pet-details"
        style={{ minHeight: '100vh - 84px - 143px', paddingBottom: '3rem' }}
      >
        <div className="">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} className="grid-container">
              {/* Add pet details */}
              <div className="flex-container" style={{marginBottom: "1rem"}}>
                <h2>{`${petName} the ${petCategory}`}</h2>
                <Button
                  disabled={minted}
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
                  <Tooltip title="Favourite" row>
                    <IconButton aria-label="add to favorites"><FavoriteIcon onClick={handleFavourite} style={{ color: favourite ? "red" : "" }} /></IconButton>
                  </Tooltip>
                  <Tooltip title="Share" row>
                    <IconButton aria-label="share"><ShareIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="View in OpenSea" row>
                    <IconButton aria-label="launch" href={openSeaURL + '/' + tokenId}>
                      <SvgIcon viewBox="0 0 90 90">
                        <path d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z" fill="#2081E2"/>
                        <path d="M22.2011 46.512L22.3953 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z" fill="white"/>
                        <path d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1304 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.949C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3023 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.0461 56.7435 35.655 57.7283 37.3934 57.7283H43.866V52.675H37.4673C37.1391 52.675 36.9449 52.2959 37.1345 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9713 50.8257 38.8358 49.4895 39.6958 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4758 44.3438 41.5497 44.1449C41.6746 43.7936 41.804 43.4653 41.8965 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4467 40.3723 42.4467 39.3459C42.4467 38.9437 42.4282 38.523 42.3912 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4573 32.864 41.3278 32.4618C40.9626 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7619 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2857 24.6437 38.1562 24.371 38.0268 24.112C37.9343 23.9132 37.8279 23.7283 37.754 23.5434L36.9634 22.0824C36.8524 21.8836 37.0374 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2294 23.0533 42.234 23.0533L42.8859 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0034 18 46.4089 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5204 25.0968 49.562 25.1153 49.599 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.3341 25.7071 50.5329 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7706 27.8107 52.9185 27.9587C53.723 28.7076 54.6245 29.5861 55.4845 30.557C55.7249 30.8297 55.9607 31.1071 56.2011 31.3984C56.4415 31.6943 56.6958 31.9856 56.9177 32.2769C57.209 32.6652 57.5233 33.0674 57.7961 33.4882C57.9256 33.687 58.0735 33.8904 58.1984 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4097 36.2529 59.5206 36.5257C59.8489 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.3621 39.0963 60.3806 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3436 42.2956C60.2742 42.6239 60.1818 42.9336 60.0708 43.2619C59.9598 43.5763 59.8489 43.9045 59.7056 44.2143C59.4282 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4388 46.5583 58.2908 46.7802C58.129 47.016 57.9626 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.172 48.2828C56.9732 48.5556 56.7697 48.8284 56.5478 49.0688C56.2381 49.434 55.9422 49.7808 55.6324 50.1137C55.4475 50.331 55.2487 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.4581 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0896 52.638 52.9925 52.675 52.8908 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2136 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1032 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z" fill="white"/>
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                </div>

                <Typography variant="body1" color="primary">{favouriteNumber} Favourite</Typography>
              </div>

              <Typography gutterBottom variant="subtitle1" className="details-text">Pet's Details</Typography>

              <Typography variant="body2" gutterBottom className="details-text">
                Full rights and credits to the owner @{petOwner}...
              </Typography>

              <div style={{display: "flex", gap: "20px", paddingLeft: "15%"}}>
                <Chip style={{border: "1px solid #3f51b5", color: "#3f51b5", borderRadius: "16px"}} variant="outlined" label={"Type: " + petType} color="primary" clickable/>
                <Chip style={{border: "1px solid #3f51b5", color: "#3f51b5", borderRadius: "16px"}} variant="outlined" label={"Fur: " +petFur} color="primary" clickable/>
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              {/*Add Transaction Confirmation: */}

              {codeHash ? (
                <Card className="code-hash">
                  <Typography gutterBottom variant="subtitle1">Confirmation Transaction:</Typography>
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
                <Button type="submit" variant="contained" onClick={handleComment} style={{marginTop: "10px"}}>Add comment</Button>
              </form>
              
              {/* Start: List comments  */}
              {
                comments ? (
                  <List id="list">
                    {renderComments}
                  </List>
                ) : (
                  <h2>No comments</h2>
                )
              }
              {/* End: List comments */}
            </Grid>
          </Grid>
        </div>
      </Container>
  )
}

export default PetDetails
