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

const LoginPage = () => {
  const { loginUser } = useUser();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  if (isAuthenticated) navigate("/dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const { data } = await axios.post("/api/login", { email, password });

      loginUser(data.data);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      const msg = error?.response?.data?.message || "Login failed. Try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="myMt">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4 fw-bold text-center">Login to EDS</h2>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          {success && <Alert variant="success">Login successful!</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ borderColor: "#000", color: "#000" }}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ borderColor: "#000", color: "#000" }}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="dark"
              disabled={loading}
              className="w-100"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <div className="text-center mt-3">
              Do not have an account?{" "}
              <Link
                to="/register"
                style={{ color: "black", textDecoration: "underline" }}
              >
                Register
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
