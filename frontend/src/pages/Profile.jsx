import { useAuth } from "../context/AuthContext.jsx";

function Profile() {
  const { user, logout } = useAuth();

  return (
    <section className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-large">{user?.name?.slice(0, 1).toUpperCase() || "U"}</div>
        <div>
          <p className="eyebrow">Your account</p>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      </div>
      <div className="profile-info-grid">
        <article><span>Name</span><strong>{user?.name}</strong></article>
        <article><span>Email</span><strong>{user?.email}</strong></article>
        <article><span>Member Since</span><strong>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</strong></article>
      </div>
      <button className="logout-button" type="button" onClick={logout}>Logout</button>
    </section>
  );
}

export default Profile;
