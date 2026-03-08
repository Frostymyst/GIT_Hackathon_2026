const iconByTitle = {
  'Category Management': 'fa-solid fa-tags',
  'Leaderboard (Completed Tasks)': 'fa-solid fa-trophy',
  'Employee Lookup': 'fa-solid fa-users-viewfinder',
  'Assign Categories to Departments': 'fa-solid fa-diagram-successor',
  'Department Management': 'fa-solid fa-building-user',
  'Import / Export': 'fa-solid fa-file-import',
};

function AdminSectionCard({ title, children }) {
  const iconClass = iconByTitle[title];

  return (
    <section className="admin-card">
      <h3 className="admin-card-title">
        {iconClass && <i className={iconClass} aria-hidden="true" />}
        <span>{title}</span>
      </h3>
      <div className="admin-card-body">{children}</div>
    </section>
  );
}

export default AdminSectionCard;
