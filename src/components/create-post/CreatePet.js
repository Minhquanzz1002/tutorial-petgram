import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import './CreatePet.css'
import {
  TextField,
  Container,
  StylesProvider,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Snackbar,
} from '@material-ui/core'
import { NFTStorage, File } from 'nft.storage'
import { createRef } from 'react'
import { apiKey } from '../../APIKEYS'
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

let result = 1
const img_cid = []

function CreatePet({account}) {
  const history = useHistory()
  const [image, setImage] = useState('')
  const petTypeRef = createRef()
  const petFurRef = createRef()
  const [petName, setPetName] = useState('')
  const [loading, setLoading] = useState(false)
  const [ownerName, setOwnerName] = useState('')
  const [imageName, setImageName] = useState('')
  const [imageType, setImageType] = useState('')
  const [petType, setPetType] = useState('')
  const [petFur, setPetFur] = useState('')
  const [open, setOpen] = useState(false);


  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }

      setOpen(false);
  };

  const handleImage = (event) => {
    setImage(event.target.files[0])
    setImageName(event.target.files[0].name)
    setImageType(event.target.files[0].type)
  }

  console.log(account)

  // const handleSubmit = async (event) => {
  //   event.preventDefault()
  //   try {
  //     setLoading(true)
  //     const client = new NFTStorage({ token: apiKey })
  //     const metadata = await client.store({
  //       name: petName,
  //       description: `${ownerName}, ${petType}`,
  //       image: new File([image], imageName, { type: imageType }),
  //       attributes: [
  //         {trait_type: 'Type', value: petType},
  //         {trait_type: 'Fur', value: petFur}
  //       ]
  //     })
  //     if (metadata) {
  //       history.push('/')
  //       console.log(account)
  //       await fetch(`http://localhost:8000/api/create`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({pet_id: metadata.ipnft, created: account})});
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     setLoading(false)
  //   }
  // }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      // setLoading(true)
      const client = new NFTStorage({ token: apiKey })
      const metadata = await client.store({
        name: petName,
        description: `${ownerName}, ${petType}`,
        image: new File([image], imageName, { type: imageType }),
        attributes: [
          { trait_type: 'Type', value: petType },
          { trait_type: 'Fur', value: petFur }
        ]
      })

    
    let cids = await fetch('https://api.nft.storage', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    cids = await cids.json()

    if (cids.value.length != 0) {
      img_cid.length = 0
      for (let cid of cids.value) {
        if (cid?.cid) {
          let url_metadata = `https://${cid.cid}.ipfs.nftstorage.link/metadata.json`;
          let data = await fetch(url_metadata,)
          data = await data.json()

          const getImage = (ipfsURL) => {
            if (!ipfsURL) return
            ipfsURL = ipfsURL.split('://')
            return 'https://ipfs.io/ipfs/' + ipfsURL[1]
          }

          data.image = await getImage(data.image)
          img_cid.push(data.image.split('https://ipfs.io/ipfs/')[1].split('/')[0])
        }


      }
      const get_CID_folder = Object.values(cids)[1][0].cid

      let url_metadata = `https://${get_CID_folder}.ipfs.nftstorage.link/metadata.json`;
      let data = await fetch(url_metadata,)
      data = await data.json()
      console.log(data)
      const get_CID_file = data.image.split('ipfs://')[1].split('/')[0]

      img_cid.shift()
      console.log(img_cid.length)
      if (img_cid.length > 0) {

        for (const cid of img_cid) {
          result = cid.localeCompare(get_CID_file);
          console.log(img_cid.length)
          console.log(cid)
          console.log(get_CID_file)
          console.log(result)
          if (result == 0) {
            const client = new NFTStorage({ token: apiKey })
            await client.delete(get_CID_folder)
            // setOpen(true)
            alert('Create Pet failed. Image is already exists')
            //   window.location.replace('http://localhost:3000/create-pet');
            // window.location.href = '/create-pet';
            return;
          }
        }
      }
      result = 1
      if (metadata) {
        await fetch(`http://localhost:8000/api/create`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({pet_id: metadata.ipnft, created: account})});
      }
      history.push('/')
      setLoading(true)
    }
  } catch (error) {
    console.log(error)
    history.push('/')
    setLoading(true)
  }
  }

  return (
    <StylesProvider injectFirst>
      <Container
        className="root-create-pet"
        style={{ minHeight: '80vh', paddingBottom: '3rem' }}
      >
        <div>
          <Typography className="title" color="textPrimary" gutterBottom>
            Add a photo of your pet
          </Typography>

          {/* Add Form */}
          {
            image ? (
              <img src={URL.createObjectURL(image)} alt="pet" className="img-preview" />
            ) : (
              ''
            )
          }
          <div className="form-container">
            <form className="form" noValidate autoComplete="off">
              <input
                accept="image/*"
                className="input"
                id="icon-button-photo"
                defaultValue={image}
                onChange={handleImage}
                type="file"
                required
              />
              <label htmlFor="icon-button-photo">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <TextField
                required
                fullWidth
                id="outlined-basic"
                label="Pet's name"
                variant="outlined"
                className="text-field"
                defaultValue={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
              <TextField
                required
                fullWidth
                id="outlined-basic"
                label="Owner's name"
                variant="outlined"
                className="text-field"
                defaultValue={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
              <TextField
                required
                fullWidth
                name="petType"
                select
                label="Choose type of pet"
                variant="outlined"
                className="text-field"
                onChange={(e) => setPetType(e.target.value)}
                defaultValue=""
                ref={petTypeRef}
              >
                <MenuItem value="Cat">Cat</MenuItem>
                <MenuItem value="Dog">Dog</MenuItem>
                <MenuItem value="Bird">Bird</MenuItem>
                <MenuItem value="Fish">Fish</MenuItem>
                <MenuItem value="Hamster">Hamster</MenuItem>
                <MenuItem value="Rabbit">Rabbit</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>

              <TextField
                required
                fullWidth
                name="petFur"
                select
                label="Choose fur of pet"
                variant="outlined"
                className="text-field"
                onChange={(e) => setPetFur(e.target.value)}
                defaultValue=""
                ref={petFurRef}
              >
                <MenuItem value="Black">Black</MenuItem>
                <MenuItem value="White">White</MenuItem>
                <MenuItem value="Snow">Snow</MenuItem>
                <MenuItem value="Spot">Spot</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <div
                style={{display: "flex", alignItems: "center", justifyContent: "center"}}
              >
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  style={{display: "block"}}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>

        </div>

      </Container>

      <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="error">
            Create Pet failse. Image is already exists.
        </Alert>
      </Snackbar>
    </StylesProvider>
  )
}

export default CreatePet
