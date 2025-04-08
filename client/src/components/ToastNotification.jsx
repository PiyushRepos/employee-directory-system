import { Toast } from "react-bootstrap";

const ToastNotification = ({ success, setSuccess, error, setError }) => (
  <>
    {success && (
      <Toast
        onClose={() => setSuccess(null)}
        show={!!success}
        delay={3000}
        autohide
        className="position-fixed"
        style={{ top: "20px", right: "20px", zIndex: 9999 }}
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>{success}</Toast.Body>
      </Toast>
    )}
    {error && (
      <Toast
        onClose={() => setError(null)}
        show={!!error}
        delay={3000}
        autohide
        className="position-fixed"
        style={{ top: "20px", right: "20px", zIndex: 9999 }}
        bg="danger"
      >
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{error}</Toast.Body>
      </Toast>
    )}
  </>
);

export default ToastNotification;
