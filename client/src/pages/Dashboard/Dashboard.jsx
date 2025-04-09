import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios.js";
import DashboardHeader from "./DashboardHeader.jsx";
import EmployeeFilters from "./EmployeeFilters.jsx";
import EmployeeTable from "./EmployeeTable.jsx";
import AddEditEmployeeModal from "./../../components/AddEditEmployeeModal.jsx";
import DeleteConfirmationModal from "./../../components/DeleteConfirmationModal.jsx";
import ToastNotification from "./../../components/ToastNotification.jsx";
import { format } from "date-fns";
import { useUser } from "../../context/userContext.jsx";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    position: "",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    department: "",
    position: "",
    joiningDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { isAdmin, logoutUser, user } = useUser();

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/employees", {
        params: { ...filters, sortBy: "createdAt" },
        withCredentials: true,
      });
      if (data.success) setEmployees(data.data);
      else setError(data.message);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 500);
    return () => clearTimeout(timer);
  }, [filters, navigate]);

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber || "",
      department: employee.department,
      position: employee.position,
      joiningDate: format(new Date(employee.joiningDate), "yyyy-MM-dd"),
    });
    setShowAddModal(true);
  };

  const handleAddEmployee = async () => {
    try {
      const { data } = await axios.post("/api/employees", formData, {
        withCredentials: true,
      });

      if (data.success) {
        setShowAddModal(false);
        setSuccess("Employee added successfully");
        fetchEmployees();
        resetForm();
      } else {
        setError(data.message || "Failed to add employee");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add employee. Please try again."
      );
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const { data } = await axios.put(
        `/api/employees/${selectedEmployee._id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setShowAddModal(false);
        setSuccess("Employee updated successfully");
        fetchEmployees();
        resetForm();
      } else {
        setError(data.message || "Failed to update employee");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update employee. Please try again."
      );
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      const { data } = await axios.delete(
        `/api/employees/${selectedEmployee._id}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setShowDeleteModal(false);
        setSuccess("Employee deleted successfully");
        fetchEmployees();
      } else {
        setError(data.message || "Failed to delete employee");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete employee. Please try again."
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      department: "",
      position: "",
      joiningDate: format(new Date(), "yyyy-MM-dd"),
    });
    setSelectedEmployee(null);
    setValidationErrors({});
  };

  return (
    <Container fluid className="py-4">
      <ToastNotification
        success={success}
        setSuccess={setSuccess}
        error={error}
        setError={setError}
      />

      <DashboardHeader
        userRole={isAdmin ? "admin" : "user"}
        userName={user.fullName}
        onLogout={async () => {
          try {
            await axios.post("/api/logout", {}, { withCredentials: true });
            logoutUser();
            navigate("/");
          } catch (err) {
            setError("Failed to logout");
          }
        }}
      />

      <EmployeeFilters
        filters={filters}
        setFilters={setFilters}
        onAddEmployee={() => setShowAddModal(true)}
        employees={employees}
      />

      <EmployeeTable
        employees={employees}
        loading={loading}
        userRole="admin"
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={(emp) => {
          setSelectedEmployee(emp);
          setShowDeleteModal(true);
        }}
      />

      <AddEditEmployeeModal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          resetForm();
        }}
        employee={selectedEmployee}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        onSave={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        employee={selectedEmployee}
        onConfirm={handleDeleteEmployee}
      />
    </Container>
  );
};

export default Dashboard;
