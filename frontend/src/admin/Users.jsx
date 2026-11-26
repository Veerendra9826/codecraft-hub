import { useEffect, useState } from "react";
import { FaArrowRight, FaUserShield } from "react-icons/fa";
import API from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [busyUserId, setBusyUserId] = useState("");

  useEffect(() => {
    let active = true;
    API.get("/admin/users")
      .then((response) => {
        if (active) setUsers(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (active) setError("We couldn't load the community. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const changeRole = async (user) => {
    const role = user.role === "user" ? "admin" : "user";
    setBusyUserId(user._id);
    setError("");
    try {
      await API.put(`/admin/users/${user._id}/role`, { role });
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't update this member's role.");
    } finally {
      setBusyUserId("");
    }
  };

  return (
    <section className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">YOUR COMMUNITY</p>
          <h1>The people behind the reads.</h1>
          <p className="admin-subtitle">Manage the members and permissions for your publication.</p>
        </div>
        <span className="community-count"><FaUserShield /> {users.length} members</span>
      </header>

      {error && <p className="admin-form-message error" role="alert">{error}</p>}
      {loading ? (
        <div className="admin-loading"><span className="loading-dot" /> Loading members...</div>
      ) : users.length ? (
        <div className="admin-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr><th>Member</th><th>Email</th><th>Access</th><th>Manage access</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="member-name">
                      <span className="member-avatar">{(user.name || "?").trim().charAt(0).toUpperCase()}</span>
                      <span>{user.name || "Unnamed member"}</span>
                    </div>
                  </td>
                  <td className="member-email">{user.email}</td>
                  <td><span className={user.role === "admin" ? "role-badge admin" : "role-badge"}>{user.role}</span></td>
                  <td>
                    <button
                      className={user.role === "admin" ? "role-action remove" : "role-action"}
                      type="button"
                      onClick={() => changeRole(user)}
                      disabled={busyUserId === user._id}
                    >
                      {busyUserId === user._id ? "Updating..." : user.role === "admin" ? "Remove admin" : "Make admin"}
                      {busyUserId !== user._id && <FaArrowRight />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty-state">
          <h2>No members yet.</h2>
          <p>New readers who create an account will appear here.</p>
        </div>
      )}
    </section>
  );
}
