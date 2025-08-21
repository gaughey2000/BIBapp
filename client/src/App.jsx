import { Link } from "react-router-dom";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>BIB Clinic</h1>
      <p>Welcome! You can book an appointment or sign in as admin.</p>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Link to="/book"><button>Book now</button></Link>
        <Link to="/admin/login"><button>Admin login</button></Link>
      </div>
    </div>
  );
}