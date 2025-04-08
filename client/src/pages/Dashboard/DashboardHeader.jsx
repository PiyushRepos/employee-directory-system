import { Badge, Dropdown, Row, Col } from "react-bootstrap";

const DashboardHeader = ({ userRole, onLogout, userName }) => (
  <Row className="mb-4 align-items-center">
    <Col>
      <h2 className="mb-0">Employee Directory</h2>
      <p className="text-muted">Manage your organization's employee records</p>
    </Col>
    <Col md="auto">
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-user">
          <Badge
            bg={userRole === "admin" ? "primary" : "secondary"}
            className="me-2"
          >
            {userRole}
          </Badge>
          {userName}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Col>
  </Row>
);

export default DashboardHeader;
