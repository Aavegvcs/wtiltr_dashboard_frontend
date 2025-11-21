import React, { useState } from "react";

const SidebarNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const navData = [
    { title: "Dashboard", icon: "🏠", children: [] },
    { title: "Settings", icon: "⚙️", children: ["Profile", "Security"] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Collapse Button */}
      <button
        type="button" // Added type to fix ESLint error
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          marginBottom: "10px",
          padding: "8px",
          cursor: "pointer",
          background: "#ddd",
          border: "none",
          textAlign: "center",
        }}
      >
        {isCollapsed ? "➡️" : "⬅️"}
      </button>

      <nav
        style={{
          width: isCollapsed ? "60px" : "250px",
          transition: "width 0.3s",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {navData.map((item) => {
          const hasChildren = item.children.length > 0;
          const isOpen = openMenus.includes(item.title);

          return (
            <div key={item.title} style={{ marginBottom: "8px" }}>
              <div
                role="button" // Added role to make it accessible
                tabIndex={0} // Allow keyboard focus
                onClick={() => hasChildren && toggleMenu(item.title)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleMenu(item.title);
                  }
                }} // Handle keyboard interactions
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "8px",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                {item.icon}
                {!isCollapsed && (
                  <span style={{ marginLeft: "10px", flexGrow: 1 }}>
                    {item.title}
                  </span>
                )}
                {hasChildren && !isCollapsed && (
                  <span>{isOpen ? "▲" : "▼"}</span>
                )}
              </div>

              {hasChildren && isOpen && (
                <div style={{ paddingLeft: "20px" }}>
                  {item.children.map((child) => (
                    <div key={child} style={{ padding: "5px 0" }}>
                      {child}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarNav;
