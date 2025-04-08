import { Card, Table, Spinner, Button } from "react-bootstrap";
import { format, parseISO } from "date-fns";

const EmployeeTable = ({
  employees,
  loading,
  userRole,
  onEditEmployee,
  onDeleteEmployee,
}) => (
  <Card className="shadow-sm">
    <Card.Body className="p-0">
      <div className="table-responsive">
        <Table striped bordered hover className="mb-0">
          <TableHeader userRole={userRole} />
          <TableBody
            employees={employees}
            loading={loading}
            userRole={userRole}
            onEditEmployee={onEditEmployee}
            onDeleteEmployee={onDeleteEmployee}
          />
        </Table>
      </div>
    </Card.Body>
  </Card>
);

const TableHeader = ({ userRole }) => (
  <thead className="bg-light">
    <tr>
      <th>Employee ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Department</th>
      <th>Position</th>
      <th>Joining Date</th>
      {userRole === "admin" && <th>Actions</th>}
    </tr>
  </thead>
);

const TableBody = ({
  employees,
  loading,
  userRole,
  onEditEmployee,
  onDeleteEmployee,
}) => {
  if (loading) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={userRole === "admin" ? 8 : 7}
            className="text-center py-5"
          >
            <Spinner animation="border" variant="primary" />
            <span className="ms-2">Loading employees...</span>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {employees.length ? (
        employees.map((emp) => (
          <tr key={emp._id}>
            <td>{emp.employeeId}</td>
            <td>{emp.name}</td>
            <td>{emp.email}</td>
            <td>{emp.phoneNumber || "-"}</td>
            <td>{emp.department}</td>
            <td>{emp.position}</td>
            <td>{format(parseISO(emp.joiningDate), "MM/dd/yyyy")}</td>
            {userRole === "admin" && (
              <td>
                <ActionButtons
                  onEdit={() => onEditEmployee(emp)}
                  onDelete={() => onDeleteEmployee(emp)}
                />
              </td>
            )}
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={userRole === "admin" ? 8 : 7}
            className="text-center py-4"
          >
            No employees found
          </td>
        </tr>
      )}
    </tbody>
  );
};

const ActionButtons = ({ onEdit, onDelete }) => (
  <>
    <Button
      variant="outline-primary"
      size="sm"
      onClick={onEdit}
      className="me-2"
    >
      Edit
    </Button>
    <Button variant="outline-danger" size="sm" onClick={onDelete}>
      Delete
    </Button>
  </>
);

export default EmployeeTable;
