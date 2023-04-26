import React from 'react'
import { StylesProvider, Chip, Container } from '@material-ui/core'
import './Home.css'
import PetGallery from '../gallery/PetGallery'

function Home() {

  return (
    <StylesProvider injectFirst>
      <Container>
        <div className="label-btns">
          <Chip
            size="medium"
            label="Today NFTS"
            color="primary"
            clickable
            style={{backgroundColor: "#3f51b5", color: "white", borderRadius: "16px", marginRight: "5px"}}
          />

          <Chip
            size="medium"
            label="Last Week"
            clickable
            style={{backgroundColor: "rgb(172, 169, 169)", color: "white", borderRadius: "16px"}}
          />
        </div>
        <PetGallery />
      </Container>
    </StylesProvider>
  )
}

export default Home
