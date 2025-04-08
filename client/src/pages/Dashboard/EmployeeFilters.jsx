import {
  Card,
  Form,
  ButtonGroup,
  Dropdown,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { CSVLink } from "react-csv";
import axios from "../../../axios.js";
import { format, parseISO } from "date-fns";
import { useUser } from "../../context/userContext.jsx";

const EmployeeFilters = ({ filters, setFilters, onAddEmployee, employees }) => {
  const { isAdmin } = useUser();
  const departments = ["Engineering", "Sales", "HR", "Marketing"];
  const positions = [
    "Intern",
    "Junior Developer",
    "Senior Developer",
    "Manager",
  ];

  const exportData = employees.map((emp) => ({
    "Employee ID": emp.employeeId,
    Name: emp.name,
    Email: emp.email,
    Phone: emp.phoneNumber || "-",
    Department: emp.department,
    Position: emp.position,
    "Joining Date": format(parseISO(emp.joiningDate), "MM/dd/yyyy"),
  }));

  const handleJsonExport = async () => {
    try {
      const response = await axios.get("/api/employees/export?type=json", {
        withCredentials: true,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employees.json");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Export failed:", err);
      throw new Error("Failed to export JSON data");
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Row className="g-3">
          {/* Search Input */}
          <Col md={6} lg={3}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name, email, or department"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </Form.Group>
          </Col>

          {/* Department Filter */}
          <Col md={6} lg={2}>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={filters.department}
                onChange={(e) =>
                  setFilters({ ...filters, department: e.target.value })
                }
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Position Filter */}
          <Col md={6} lg={2}>
            <Form.Group>
              <Form.Label>Position</Form.Label>
              <Form.Select
                value={filters.position}
                onChange={(e) =>
                  setFilters({ ...filters, position: e.target.value })
                }
              >
                <option value="">All Positions</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Sort Order Filter */}
          <Col md={6} lg={2}>
            <Form.Group>
              <Form.Label>Sort Order</Form.Label>
              <Form.Select
                value={filters.order}
                onChange={(e) =>
                  setFilters({ ...filters, order: e.target.value })
                }
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Action Buttons */}
          <Col md={12} lg={3} className="d-flex align-items-end">
            <ButtonGroup className="w-100">
              <Button variant="primary" onClick={onAddEmployee}>
                Add Employee
              </Button>
              {isAdmin && (
                <ExportDropdown
                  exportData={exportData}
                  handleJsonExport={handleJsonExport}
                />
              )}
            </ButtonGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const ExportDropdown = ({ exportData, handleJsonExport }) => (
  <Dropdown as={ButtonGroup} className="ms-2">
    <Button variant="success">Export</Button>
    <Dropdown.Toggle split variant="success" id="dropdown-export" />
    <Dropdown.Menu>
      <Dropdown.Item as="div">
        <CSVLink
          data={exportData}
          filename="employees.csv"
          className="text-decoration-none text-dark"
          style={{ display: "block", padding: "0.25rem 1.5rem" }}
        >
          Export as CSV
        </CSVLink>
      </Dropdown.Item>
      <Dropdown.Item onClick={handleJsonExport}>Export as JSON</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

export default EmployeeFilters;
