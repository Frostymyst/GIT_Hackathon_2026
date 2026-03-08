function AdminSectionCard({ title, children }) {
  return (
    <section className="admin-card">
      <h3 className="admin-card-title">{title}</h3>
      <div className="admin-card-body">{children}</div>
    </section>
  );
}

export default AdminSectionCard;
