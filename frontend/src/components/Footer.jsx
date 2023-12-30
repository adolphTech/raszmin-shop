import React from 'react';
import{Container,Row,Col} from "react-bootstrap";


function Footer() {
    const currentYear = new Date().getFullYear()
  return (
    <footer>
        <Container>
            <Row>
            <Col className='text-center py-3'>
            <p><a href='https://adolph.vercel.app'>Adolph</a> &copy; {currentYear}</p>

            </Col>

            </Row>
        </Container>
    </footer>
  )
}

export default Footer