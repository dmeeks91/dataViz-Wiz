import React from "react";
import { Col, Row, Container } from "../../components/Grid";
import Nav from "../../components/Nav";
import Jumbotron from "../../components/Jumbotron";

const NoMatch = () => (
  <div>
    <Nav title="DataViz-Wiz"/>
    <Container>
      <Row>
        <Col size="md-12">
          <Jumbotron>
            <h1>404 Page Not Found</h1>
            <h1>
              <span role="img" aria-label="Face With Rolling Eyes Emoji">
                🙄
              </span>
            </h1>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
  </div>
);

export default NoMatch;
