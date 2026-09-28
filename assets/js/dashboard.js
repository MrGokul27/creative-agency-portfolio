document.addEventListener("DOMContentLoaded", () => {
  // Role definitions & Metadata
  const ROLES = {
    client: {
      key: "client",
      title: "Client / Brand Owner",
      shortTitle: "Client Portal",
      badgeClass: "badge-theme",
      defaultAvatar: "../assets/images/team/team-member-card-01.webp",
      views: [
        {
          id: "client-overview",
          label: "Client Overview",
          icon: "fa-solid fa-chart-pie",
          badge: "Live",
        },
        {
          id: "client-projects",
          label: "My Projects",
          icon: "fa-solid fa-folder-open",
          count: "3 Active",
        },
        {
          id: "client-approvals",
          label: "Design Approvals",
          icon: "fa-solid fa-stamp",
          badge: "2 Pending",
        },
        {
          id: "client-assets",
          label: "Brand Asset Vault",
          icon: "fa-solid fa-box-archive",
        },
        {
          id: "client-invoices",
          label: "Invoices & Billing",
          icon: "fa-solid fa-file-invoice-dollar",
        },
        {
          id: "client-messages",
          label: "Studio Messages",
          icon: "fa-solid fa-comments",
          badge: "New",
        },
      ],
    },
    designer: {
      key: "designer",
      title: "Creative Designer / UI-UX",
      shortTitle: "Design Studio",
      badgeClass: "badge-theme",
      defaultAvatar: "../assets/images/team/team-member-card-04.webp",
      views: [
        {
          id: "designer-overview",
          label: "Design Studio Hub",
          icon: "fa-solid fa-palette",
          badge: "Sprint 4",
        },
        {
          id: "designer-tasks",
          label: "Figma Sprints & Tasks",
          icon: "fa-solid fa-pen-ruler",
          badge: "4 Due",
        },
        {
          id: "designer-system",
          label: "Design System & Tokens",
          icon: "fa-solid fa-layer-group",
        },
        {
          id: "designer-reviews",
          label: "Critique & Feedback",
          icon: "fa-solid fa-comment-dots",
        },
        {
          id: "designer-moodboards",
          label: "Moodboards & 3D Assets",
          icon: "fa-solid fa-wand-magic-sparkles",
        },
      ],
    },
    developer: {
      key: "developer",
      title: "Developer / Engineer",
      shortTitle: "Dev Workspace",
      badgeClass: "badge-theme",
      defaultAvatar: "../assets/images/team/team-member-card-03.webp",
      views: [
        {
          id: "developer-overview",
          label: "Dev Command Center",
          icon: "fa-solid fa-terminal",
          badge: "v2.8.4",
        },
        {
          id: "developer-sprints",
          label: "Sprint Tickets & PRs",
          icon: "fa-solid fa-code-pull-request",
          badge: "5 Open",
        },
        {
          id: "developer-ci",
          label: "Deployments & CI/CD",
          icon: "fa-solid fa-server",
        },
        {
          id: "developer-performance",
          label: "Lighthouse & Vitals",
          icon: "fa-solid fa-gauge-high",
        },
        {
          id: "developer-api",
          label: "API & Webhook Telemetry",
          icon: "fa-solid fa-network-wired",
        },
      ],
    },
    manager: {
      key: "manager",
      title: "Project Manager",
      shortTitle: "Studio Ops",
      badgeClass: "badge-theme",
      defaultAvatar: "../assets/images/team/team-member-card-02.webp",
      views: [
        {
          id: "manager-overview",
          label: "Operations Overview",
          icon: "fa-solid fa-bars-progress",
          badge: "94% On Time",
        },
        {
          id: "manager-roadmap",
          label: "Agency Project Roadmap",
          icon: "fa-solid fa-map-location-dot",
        },
        {
          id: "manager-capacity",
          label: "Team Capacity & Hours",
          icon: "fa-solid fa-users-gear",
        },
        {
          id: "manager-milestones",
          label: "Milestones & Delivery",
          icon: "fa-solid fa-calendar-check",
        },
        {
          id: "manager-budget",
          label: "Budget & Burn Rate",
          icon: "fa-solid fa-sack-dollar",
        },
      ],
    },
    admin: {
      key: "admin",
      title: "Agency Administrator",
      shortTitle: "Executive Command",
      badgeClass: "badge-theme",
      defaultAvatar: "../assets/images/team/team-member-card-06.webp",
      views: [
        {
          id: "admin-overview",
          label: "Executive Command",
          icon: "fa-solid fa-crown",
          badge: "$248k MRR",
        },
        {
          id: "admin-users",
          label: "User Directory & Access",
          icon: "fa-solid fa-users-viewfinder",
        },
        {
          id: "admin-financials",
          label: "Financials & Retainers",
          icon: "fa-solid fa-vault",
        },
        {
          id: "admin-security",
          label: "Security & Audit Logs",
          icon: "fa-solid fa-shield-halved",
        },
        {
          id: "admin-settings",
          label: "Platform Configuration",
          icon: "fa-solid fa-sliders",
        },
      ],
    },
  };

  // State
  let currentRole = "admin";
  let currentUser = {
    email: "agency.lead@stackly.design",
    username: "Alex Rivera",
    role: "admin",
    avatar: "../assets/images/team/team-member-card-06.webp",
  };

  // 1. Read User & Role State from localStorage / URL Query Params
  function initUserSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramRole = urlParams.get("role");
    const paramEmail = urlParams.get("email");
    const paramUser = urlParams.get("user");

    const savedUser = localStorage.getItem("stackly_auth_user");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.role && ROLES[parsed.role]) {
          currentUser = {
            email: parsed.email || currentUser.email,
            username:
              parsed.username ||
              (parsed.email ? parsed.email.split("@")[0] : "Studio User"),
            role: parsed.role,
            avatar: ROLES[parsed.role].defaultAvatar,
          };
          currentRole = parsed.role;
        }
      } catch (e) {
        console.error("Could not parse saved session", e);
      }
    }

    // URL params take explicit precedence if provided
    if (paramRole && ROLES[paramRole]) {
      currentRole = paramRole;
      currentUser.role = paramRole;
      currentUser.avatar = ROLES[paramRole].defaultAvatar;
      if (paramEmail) currentUser.email = paramEmail;
      if (paramUser) currentUser.username = paramUser;
      else if (paramEmail) currentUser.username = paramEmail.split("@")[0];
    }

    renderUserHeader();
    renderSidebarNav();
    showRoleSection(currentRole);
  }

  // 2. Render User Details in Topbar & Sidebar
  function renderUserHeader() {
    const roleMeta = ROLES[currentRole] || ROLES.admin;

    // Sidebar user info
    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const sidebarUserName = document.getElementById("sidebarUserName");
    const sidebarUserEmail = document.getElementById("sidebarUserEmail");
    const sidebarRoleTag = document.getElementById("sidebarRoleTag");

    if (sidebarAvatar)
      sidebarAvatar.src = currentUser.avatar || roleMeta.defaultAvatar;
    if (sidebarUserName) sidebarUserName.textContent = currentUser.username;
    if (sidebarUserEmail) sidebarUserEmail.textContent = currentUser.email;
    if (sidebarRoleTag) sidebarRoleTag.textContent = roleMeta.shortTitle;

    // Topbar user info
    const topbarAvatar = document.getElementById("topbarAvatar");
    const topbarUserName = document.getElementById("topbarUserName");
    const topbarRoleText = document.getElementById("topbarRoleText");

    if (topbarAvatar)
      topbarAvatar.src = currentUser.avatar || roleMeta.defaultAvatar;
    if (topbarUserName) topbarUserName.textContent = currentUser.username;
    if (topbarRoleText) topbarRoleText.textContent = roleMeta.title;

    // Active Role Pill in banner/topbar
    const activeRoleLabels = document.querySelectorAll(".current-role-label");
    activeRoleLabels.forEach((el) => (el.textContent = roleMeta.title));

    const activeUserEmailTags = document.querySelectorAll(
      ".current-user-email",
    );
    activeUserEmailTags.forEach((el) => (el.textContent = currentUser.email));

    const activeUserNameTags = document.querySelectorAll(".current-user-name");
    activeUserNameTags.forEach((el) => (el.textContent = currentUser.username));
  }

  // 3. Render Dynamic Sidebar Navigation based on Active Role
  function renderSidebarNav() {
    const navContainer = document.getElementById("sidebarDynamicNav");
    if (!navContainer) return;

    const roleMeta = ROLES[currentRole] || ROLES.admin;
    const views = roleMeta.views || [];

    let html = `
      <div class="dash-nav-group-title">${roleMeta.shortTitle} Menu</div>
      <ul class="dash-nav-list">
    `;

    views.forEach((item, index) => {
      const isFirst = index === 0;
      html += `
        <li class="dash-nav-item">
          <a class="dash-nav-link ${isFirst ? "active" : ""}" data-sidebar-view="${item.id}">
            <i class="${item.icon}"></i>
            <span>${item.label}</span>
            ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ""}
          </a>
        </li>
      `;
    });

    html += `</ul>`;
    navContainer.innerHTML = html;

    // Attach click listeners to sidebar links
    const links = navContainer.querySelectorAll("[data-sidebar-view]");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        const targetViewId = link.getAttribute("data-sidebar-view");
        switchSubView(targetViewId);

        // Auto close mobile drawer
        closeMobileSidebar();
      });
    });
  }

  // 4. Switch Between Role Containers
  function showRoleSection(roleKey) {
    if (!ROLES[roleKey]) roleKey = "admin";
    currentRole = roleKey;
    currentUser.role = roleKey;
    currentUser.avatar = ROLES[roleKey].defaultAvatar;

    // Update active class in Role Switcher Dropdown
    document.querySelectorAll(".role-switcher-item").forEach((item) => {
      if (item.getAttribute("data-role") === roleKey) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Toggle Role Section Containers
    document
      .querySelectorAll(".role-section-container")
      .forEach((container) => {
        if (container.getAttribute("data-role-container") === roleKey) {
          container.classList.add("active");
        } else {
          container.classList.remove("active");
        }
      });

    renderUserHeader();
    renderSidebarNav();

    // Default to first view for this role
    const defaultView = ROLES[roleKey].views[0].id;
    switchSubView(defaultView);
  }

  // 5. Switch Subpages within the Active Role
  function switchSubView(viewId) {
    if (!viewId) return;

    // Hide all subpages in current role, show matching one
    const activeRoleContainer = document.querySelector(
      `.role-section-container[data-role-container="${currentRole}"]`,
    );
    if (activeRoleContainer) {
      const subpages = activeRoleContainer.querySelectorAll(".view-subpage");
      let found = false;

      subpages.forEach((page) => {
        if (page.id === viewId) {
          page.classList.add("active");
          found = true;
        } else {
          page.classList.remove("active");
        }
      });

      // If matching view subpage wasn't found, default to first child
      if (!found && subpages.length > 0) {
        subpages[0].classList.add("active");
      }
    }

    // Scroll to top of main content smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 6. Role Switcher Dropdown Click Handlers
  document.querySelectorAll(".role-switcher-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedRole = item.getAttribute("data-role");
      if (selectedRole && ROLES[selectedRole]) {
        // Save to session
        currentUser.role = selectedRole;
        currentUser.avatar = ROLES[selectedRole].defaultAvatar;
        localStorage.setItem("stackly_auth_user", JSON.stringify(currentUser));

        showRoleSection(selectedRole);
      }
    });
  });

  // 7. Mobile Sidebar Drawer Controls
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
  const dashSidebar = document.getElementById("dashSidebar");
  const sidebarBackdrop = document.getElementById("dashSidebarBackdrop");

  function openMobileSidebar() {
    if (dashSidebar) dashSidebar.classList.add("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeMobileSidebar() {
    if (dashSidebar) dashSidebar.classList.remove("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("show");
    document.body.style.overflow = "";
  }

  if (sidebarToggleBtn)
    sidebarToggleBtn.addEventListener("click", openMobileSidebar);
  if (sidebarCloseBtn)
    sidebarCloseBtn.addEventListener("click", closeMobileSidebar);
  if (sidebarBackdrop)
    sidebarBackdrop.addEventListener("click", closeMobileSidebar);

  // 8. Logout Handling
  const logoutButtons = document.querySelectorAll(
    "#logoutBtn, [data-action='logout']",
  );
  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // Clear current auth session
      localStorage.removeItem("stackly_auth_user");
      sessionStorage.removeItem("stackly_auth_user");
      // Redirect to login page
      window.location.href = "login.html";
    });
  });

  // 9. Interactive In-Page Table Search Filter
  const searchInput = document.getElementById("dashboardSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase().trim();
      const activeRoleContainer = document.querySelector(
        `.role-section-container[data-role-container="${currentRole}"]`,
      );
      if (!activeRoleContainer) return;

      const activeSubpage = activeRoleContainer.querySelector(
        ".view-subpage.active",
      );
      if (!activeSubpage) return;

      const tableRows = activeSubpage.querySelectorAll("tbody tr");
      tableRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }

  // 10. Intercept Empty Links, # and Generic Buttons to Redirect to 404 Page (Requirement 7)
  function setupDashboard404Interception() {
    document.addEventListener("click", (e) => {
      // 1. Check if an anchor tag was clicked
      const link = e.target.closest("a");
      if (link) {
        // Excluded interactive elements
        if (
          link.hasAttribute("data-sidebar-view") ||
          link.classList.contains("role-switcher-item") ||
          link.hasAttribute("data-bs-toggle") ||
          link.hasAttribute("data-bs-target") ||
          link.hasAttribute("data-action") ||
          link.id === "logoutBtn" ||
          link.getAttribute("href") === "login.html" ||
          link.getAttribute("href") === "../index.html" ||
          link.getAttribute("href") === "404.html" ||
          link.getAttribute("href") === "../pages/404.html"
        ) {
          return;
        }

        const href = link.getAttribute("href");
        const isEmptyOrHash =
          href === null ||
          href === "" ||
          href === "#" ||
          href === "#!" ||
          href.trim() === "" ||
          href.trim() === "#" ||
          href.toLowerCase().startsWith("javascript:void");

        if (isEmptyOrHash) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = "404.html";
          return;
        }
      }

      // 2. Check if an unhandled action button was clicked
      const button = e.target.closest("button");
      if (button) {
        // Exclude handled buttons
        if (
          button.id === "sidebarToggleBtn" ||
          button.id === "sidebarCloseBtn" ||
          button.id === "logoutBtn" ||
          button.hasAttribute("data-action") ||
          button.hasAttribute("data-bs-toggle") ||
          button.hasAttribute("data-bs-dismiss") ||
          button.classList.contains("dash-sidebar-close") ||
          button.classList.contains("dash-role-switcher-btn") ||
          button.closest(".dropdown") ||
          button.type === "submit"
        ) {
          return;
        }

        // Unhandled placeholder buttons trigger 404
        if (
          button.classList.contains("btn-placeholder-action") ||
          button.getAttribute("onclick") === null
        ) {
          // If it's a dummy table action button or export button without explicit JS logic
          if (
            button.closest(".dash-table") ||
            button.classList.contains("btn-dash-primary") ||
            button.classList.contains("btn-dash-outline") ||
            button.classList.contains("btn-dash-icon")
          ) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = "404.html";
          }
        }
      }
    });
  }

  // Initialize
  initUserSession();
  setupDashboard404Interception();
});
