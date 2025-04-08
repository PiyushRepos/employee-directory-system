import { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import axios from "../../../axios.js";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/userContext.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const { data } = await axios.post("/api/register", form);

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const res = err?.response;
      let msg = "Something went wrong. Please try again.";

      if (res?.status === 400) {
        msg = res.data?.message || res.data?.error?.message || "Invalid input.";
      } else if (res?.status === 409) {
        msg = "User with this email already exists.";
      } else if (res?.status === 500) {
        msg = "Server error. Please try again later.";
      }

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">Register</h2>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          {success && <Alert variant="success">Registered successfully!</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
                style={{ borderColor: "#000", color: "#000" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ borderColor: "#000", color: "#000" }}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ borderColor: "#000", color: "#000" }}
              />
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              disabled={loading}
              className="w-100"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
            <div className="text-center mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ color: "black", textDecoration: "underline" }}
              >
                Login
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
