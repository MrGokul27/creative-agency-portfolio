// Global Component Loader
document.addEventListener("DOMContentLoaded", () => {
  initPreloader();

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
          normalizeComponentPaths(headerPlaceholder, isRoot);
        }),
    );
  }

  if (footerPlaceholder) {
    loads.push(
      fetch(componentBase + "footer.html")
        .then((res) => res.text())
        .then((html) => {
          footerPlaceholder.innerHTML = html;
          normalizeComponentPaths(footerPlaceholder, isRoot);
        }),
    );
  }

  Promise.all(loads).then(() => setupInteractiveFeatures());
});

// ==========================================================================
// CREATIVE AGENCY THEME PRELOADER (2-Second Duration Experience)
// ==========================================================================
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const percentEl = document.getElementById("preloaderPercent");
  const barEl = document.getElementById("preloaderBar");
  const statusEl = document.getElementById("preloaderStatus");

  // Prevent background scrolling during loading
  document.body.style.overflow = "hidden";

  const totalDuration = 2000; // Exact 2 seconds
  const startTime = performance.now();

  const statusMessages = [
    { threshold: 0, text: "Initializing Studio Engine..." },
    { threshold: 25, text: "Loading Creative Assets..." },
    { threshold: 58, text: "Rendering Visual Components..." },
    { threshold: 86, text: "Finalizing Digital Showcase..." },
    { threshold: 100, text: "Welcome to Stackly." },
  ];

  function getStatusText(progressPercent) {
    let current = statusMessages[0].text;
    for (let i = 0; i < statusMessages.length; i++) {
      if (progressPercent >= statusMessages[i].threshold) {
        current = statusMessages[i].text;
      }
    }
    return current;
  }

  function frame(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(elapsed / totalDuration, 1);

    // Smooth cubic ease-out curve for natural loading progress
    const easedProgress = 1 - Math.pow(1 - rawProgress, 2.5);
    const percent = Math.min(100, Math.floor(easedProgress * 100));

    if (percentEl) {
      percentEl.textContent = percent;
    }
    if (barEl) {
      barEl.style.width = `${percent}%`;
    }
    if (statusEl) {
      statusEl.textContent = getStatusText(percent);
    }

    if (rawProgress < 1) {
      requestAnimationFrame(frame);
    } else {
      if (percentEl) percentEl.textContent = "100";
      if (barEl) barEl.style.width = "100%";
      if (statusEl) statusEl.textContent = "Welcome to Stackly Studio.";

      preloader.classList.add("is-loaded");
      document.body.style.overflow = "";

      // Completely hide after curtain transition
      setTimeout(() => {
        preloader.classList.add("is-finished");
        preloader.style.display = "none";
      }, 850);
    }
  }

  requestAnimationFrame(frame);
}

function normalizeComponentPaths(container, isRoot) {
  if (!container) return;

  // Normalize image paths
  const imgs = container.querySelectorAll("img");
  imgs.forEach((img) => {
    const src = img.getAttribute("src");
    if (src && src.startsWith("/assets/")) {
      img.setAttribute("src", isRoot ? src.substring(1) : ".." + src);
    }
  });

  // Normalize anchor links
  const links = container.querySelectorAll("a");
  links.forEach((a) => {
    const href = a.getAttribute("href");
    if (href) {
      if (href === "/index.html" || href === "/") {
        a.setAttribute("href", isRoot ? "index.html" : "../index.html");
      } else if (href.startsWith("/pages/")) {
        const pageName = href.replace("/pages/", "");
        a.setAttribute("href", isRoot ? "pages/" + pageName : pageName);
      } else if (href.startsWith("/assets/")) {
        a.setAttribute("href", isRoot ? href.substring(1) : ".." + href);
      }
    }
  });
}

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

  // 9. AUTOMATIC REDIRECTION FOR EMPTY & '#' LINKS TO 404 PAGE
  setupEmptyLinksRedirection();

  // 10. CONTACT FORM INPUT RESTRICTIONS & VALIDATION
  setupContactFormValidation();

  // 11. FOOTER & NEWSLETTER FORMS REDIRECTION TO 404
  setupNewsletterFormRedirection();
}

// Global click interceptor for empty and placeholder '#' links
function setupEmptyLinksRedirection() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    // Check if link is explicitly exempted (e.g. Bootstrap modal/collapse toggle)
    if (
      link.hasAttribute("data-bs-toggle") ||
      link.hasAttribute("data-bs-target") ||
      link.hasAttribute("data-no-404")
    ) {
      return;
    }

    const rawHref = link.getAttribute("href");

    // Identify if the href is empty, '#', or standard placeholder
    const isEmptyOrHash =
      rawHref === null ||
      rawHref === "" ||
      rawHref === "#" ||
      rawHref === "#!" ||
      rawHref.trim() === "" ||
      rawHref.trim() === "#" ||
      rawHref.toLowerCase() === "javascript:void(0)" ||
      rawHref.toLowerCase() === "javascript:void(0);" ||
      rawHref.toLowerCase() === "javascript:;";

    if (isEmptyOrHash) {
      e.preventDefault();
      e.stopPropagation();

      const isInsidePagesDir =
        window.location.pathname.includes("/pages/") ||
        window.location.pathname.includes("\\pages\\");

      const target404 = isInsidePagesDir ? "404.html" : "pages/404.html";
      window.location.href = target404;
    }
  });
}

// Setup typing restrictions for Contact Form inputs
function setupContactFormValidation() {
  const nameInput =
    document.getElementById("contactName") ||
    document.querySelector('input[placeholder*="Full Name"]');
  const phoneInput =
    document.getElementById("contactPhone") ||
    document.querySelector('input[type="tel"]') ||
    document.querySelector('input[placeholder*="Phone Number"]');

  const controlKeys = [
    "Backspace",
    "Tab",
    "Enter",
    "Escape",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Delete",
    "Home",
    "End",
  ];

  // 1. Username / Name field: Prevent typing numbers and special characters
  if (nameInput && !nameInput.dataset.restricted) {
    nameInput.dataset.restricted = "true";

    // Block keystrokes that are not letters or spaces
    nameInput.addEventListener("keydown", (e) => {
      if (controlKeys.includes(e.key)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.length === 1 && !/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
      }
    });

    // Handle beforeinput for virtual keyboards & IME
    nameInput.addEventListener("beforeinput", (e) => {
      if (e.data && !/^[a-zA-Z]+$/.test(e.data)) {
        e.preventDefault();
      }
    });

    // Immediate sanitization on input
    nameInput.addEventListener("input", function () {
      const sanitized = this.value.replace(/[^a-zA-Z]/g, "");
      if (this.value !== sanitized) {
        this.value = sanitized;
      }
    });

    // Handle paste event
    nameInput.addEventListener("paste", function (e) {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData("text");
      const sanitized = pasted.replace(/[^a-zA-Z]/g, "");
      const start = this.selectionStart;
      const end = this.selectionEnd;
      const val = this.value;
      this.value = val.substring(0, start) + sanitized + val.substring(end);
      this.selectionStart = this.selectionEnd = start + sanitized.length;
      this.dispatchEvent(new Event("input"));
    });
  }

  // 2. Number / Phone field: Prevent typing alphabets and special characters
  if (phoneInput && !phoneInput.dataset.restricted) {
    phoneInput.dataset.restricted = "true";

    // Block keystrokes that are not digits
    phoneInput.addEventListener("keydown", (e) => {
      if (controlKeys.includes(e.key)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    });

    // Handle beforeinput for virtual keyboards & IME
    phoneInput.addEventListener("beforeinput", (e) => {
      if (e.data && !/^[0-9]+$/.test(e.data)) {
        e.preventDefault();
      }
    });

    // Immediate sanitization on input
    phoneInput.addEventListener("input", function () {
      const sanitized = this.value.replace(/[^0-9]/g, "");
      if (this.value !== sanitized) {
        this.value = sanitized;
      }
    });

    // Handle paste event
    phoneInput.addEventListener("paste", function (e) {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData("text");
      const sanitized = pasted.replace(/[^0-9]/g, "");
      const start = this.selectionStart;
      const end = this.selectionEnd;
      const val = this.value;
      this.value = val.substring(0, start) + sanitized + val.substring(end);
      this.selectionStart = this.selectionEnd = start + sanitized.length;
      this.dispatchEvent(new Event("input"));
    });
  }
}

// Global Newsletter / Footer form redirect to 404 page
function setupNewsletterFormRedirection() {
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (
      form.classList.contains("footer-newsletter-form") ||
      form.closest(".footer-newsletter-form")
    ) {
      e.preventDefault();
      const isInsidePagesDir =
        window.location.pathname.includes("/pages/") ||
        window.location.pathname.includes("\\pages\\");

      const target404 = isInsidePagesDir ? "404.html" : "pages/404.html";
      window.location.href = target404;
    }
  });
}

// Ensure handlers are registered immediately on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  setupContactFormValidation();
  setupNewsletterFormRedirection();
});

// Ensure redirection is registered immediately
setupEmptyLinksRedirection();
