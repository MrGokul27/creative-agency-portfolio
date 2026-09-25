// Global Component Loader
document.addEventListener("DOMContentLoaded", () => {
  const isRoot =
    !window.location.pathname.includes("/pages/") &&
    !window.location.pathname.includes("\\pages\\");
  const componentBase = isRoot ? "pages/components/" : "../pages/components/";

  const headerPlaceholder = document.getElementById("header-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");

  const loads = [];

  if (headerPlaceholder) {
    loads.push(
      fetch(componentBase + "header.html")
        .then((res) => res.text())
        .then((html) => {
          headerPlaceholder.innerHTML = html;
        }),
    );
  }

  if (footerPlaceholder) {
    loads.push(
      fetch(componentBase + "footer.html")
        .then((res) => res.text())
        .then((html) => {
          footerPlaceholder.innerHTML = html;
        }),
    );
  }

  Promise.all(loads).then(() => setupInteractiveFeatures());
});

function setupInteractiveFeatures() {
  // 1. STICKY HEADER
  const mainHeader = document.querySelector(".main-header");
  const handleStickyHeader = () => {
    if (!mainHeader) return;
    if (window.scrollY > 40) {
      mainHeader.classList.add("scrolled");
    } else {
      mainHeader.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleStickyHeader, { passive: true });
  handleStickyHeader();

  // 2. FULLSCREEN MOBILE NAVIGATION
  const mobileToggleBtn = document.querySelector(".mobile-toggle-btn");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileNavClose = document.querySelector(".mobile-nav-close");

  if (mobileToggleBtn && mobileNavOverlay) {
    mobileToggleBtn.addEventListener("click", () => {
      mobileNavOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    if (mobileNavClose) {
      mobileNavClose.addEventListener("click", () => {
        mobileNavOverlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    }

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNavOverlay.classList.contains("active")) {
        mobileNavOverlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Close when clicking internal links
    const mobileLinks = mobileNavOverlay.querySelectorAll(
      ".mobile-nav-link:not(.dropdown-toggle)",
    );
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNavOverlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // 3. SCROLL TO TOP BUTTON
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  if (scrollToTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 350) {
          scrollToTopBtn.classList.add("show");
        } else {
          scrollToTopBtn.classList.remove("show");
        }
      },
      { passive: true },
    );

    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 4. HIGHLIGHT ACTIVE NAV ITEM
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(
    ".nav-link, .dropdown-item-custom, .mobile-nav-link",
  );

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href) {
      const linkFile = href.split("/").pop().split("#")[0];
      if (
        linkFile === currentPath ||
        (currentPath === "" && linkFile === "index.html")
      ) {
        link.classList.add("active");
      }
    }
  });

  // 5. PORTFOLIO FILTER FUNCTIONALITY
  const filterButtons = document.querySelectorAll(".portfolio-filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-filter-item");

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        filterButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");

        portfolioItems.forEach((item) => {
          if (
            filterValue === "all" ||
            item.getAttribute("data-category") === filterValue
          ) {
            item.style.display = "block";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }, 50);
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.95)";
            setTimeout(() => {
              item.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  // 6. ANIMATED NUMBER COUNTERS (FOR STATS)
  const counters = document.querySelectorAll(".stat-counter");
  let countersStarted = false;

  const runCounters = () => {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = target;
          clearInterval(timer);
        } else {
          counter.innerText = Math.floor(current);
        }
      }, stepTime);
    });
  };

  if (counters.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            runCounters();
          }
        });
      },
      { threshold: 0.3 },
    );

    const statsSection = document.querySelector(".stats-section-observer");
    if (statsSection) {
      observer.observe(statsSection);
    } else if (counters[0]) {
      observer.observe(counters[0].parentElement);
    }
  }

  // 7. VIDEO MODAL FUNCTIONALITY
  const videoTriggers = document.querySelectorAll(".video-play-btn");
  const videoModal = document.getElementById("videoModal");
  const videoFrame = document.getElementById("videoFrame");

  if (videoTriggers.length > 0 && videoModal && videoFrame) {
    videoTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const videoSrc =
          trigger.getAttribute("data-video") ||
          "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1";
        videoFrame.setAttribute("src", videoSrc);
      });
    });

    videoModal.addEventListener("hidden.bs.modal", () => {
      videoFrame.setAttribute("src", "");
    });
  }

  // 8. BLOG CATEGORY FILTER FUNCTIONALITY
  const blogFilterBtns = document.querySelectorAll(".blog-category-pill");
  const blogItems = document.querySelectorAll(".blog-filter-item");

  if (blogFilterBtns.length > 0 && blogItems.length > 0) {
    blogFilterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        blogFilterBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");

        blogItems.forEach((item) => {
          const itemCategories = (
            item.getAttribute("data-category") || ""
          ).split(" ");
          const isMatch =
            filterValue === "all" || itemCategories.includes(filterValue);

          if (isMatch) {
            item.style.display = "";
            requestAnimationFrame(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1) translateY(0)";
            });
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.95) translateY(10px)";
            setTimeout(() => {
              if (item.style.opacity === "0") {
                item.style.display = "none";
              }
            }, 300);
          }
        });
      });
    });
  }
}
