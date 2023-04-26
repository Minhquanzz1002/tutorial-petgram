import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppBar,
  Container,
  Grid,
  Link,
  Typography,
} from '@material-ui/core'
import './Footer.css'

function Footer() {
  return (
    <footer>
      <AppBar className="primary-color marginT-3 pad-2" position="static">
        <Grid component={Container} container>
          <Grid container direction="row" justifyContent="center" alignItems="center" className='footer-wrapper' >
            <Link className="link" component={RouterLink} to="/" style={{color: "white", margin: "0.7rem"}}>
              Home
            </Link>
            <span>|</span>

            <Link className="link" component={RouterLink} to="/" style={{color: "white", margin: "0.7rem"}}>
              About
            </Link>
            <span>|</span>

            <Link className="link" component={RouterLink} to="/create-pet" style={{color: "white", margin: "0.7rem"}}>
              Create a Pet
            </Link>
            <span>|</span>

            <Link className="link" component={RouterLink} to="/" style={{color: "white", margin: "0.7rem"}}>
              Get Started
            </Link>
            <span>|</span>

            <Link className="link" component={RouterLink} to="/" style={{color: "white", margin: "0.7rem"}}>
              Terms
            </Link>
            <span>|</span>

            <Link className="link" component={RouterLink} to="/" style={{color: "white", margin: "0.7rem"}}>
              Privacy
            </Link>
          </Grid>

          <Grid xs={12} direction="row" justifyContent="center" alignItems="center" container>
            <Typography className="copyright">Copyright &copy; {new Date().getFullYear()} PetGram</Typography>
          </Grid>
        </Grid>
      </AppBar>
    </footer>
  )
}

export default Footer


