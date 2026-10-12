/* Interactive behavior for Emmanuel Oloo Baraka's portfolio. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Current year
  $("#year").textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = $("#menu-toggle");
  const navLinks = $("#nav-links");
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });
  $$(".nav-link", navLinks).forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }));

  // Theme switch; persisted in localStorage where available.
  const themeToggle = $("#theme-toggle");
  const themeIcon = $("#theme-icon");
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("eob-theme"); } catch (_) {}
  if (savedTheme === "light") document.documentElement.dataset.theme = "light";
  updateThemeButton();
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    if (next === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("eob-theme", next); } catch (_) {}
    updateThemeButton();
  });
  function updateThemeButton() {
    const light = document.documentElement.dataset.theme === "light";
    themeIcon.textContent = light ? "☾" : "☼";
    themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    themeToggle.title = light ? "Switch to dark theme" : "Switch to light theme";
  }

  // Typing animation
  const roles = ["Network Engineering", "IT Operations", "Systems Administration", "Junior DevOps", "Full-Stack Development", "IT Support"];
  const typingText = $("#typing-text");
  if (!prefersReducedMotion) {
    let roleIndex = 0, charIndex = roles[0].length, deleting = true;
    const type = () => {
      const role = roles[roleIndex];
      if (deleting) {
        charIndex--;
        typingText.textContent = role.slice(0, Math.max(0, charIndex));
        if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
        window.setTimeout(type, 45);
      } else {
        const nextRole = roles[roleIndex];
        charIndex++;
        typingText.textContent = nextRole.slice(0, charIndex);
        if (charIndex >= nextRole.length) { deleting = true; window.setTimeout(type, 1400); }
        else window.setTimeout(type, 75);
      }
    };
    window.setTimeout(type, 1500);
  }

  // Profile photo: if Dylan.png is missing, keep the initials placeholder.
  const profileImage = $("#profile-image");
  const profilePlaceholder = $("#profile-placeholder");
  profileImage.addEventListener("load", () => {
    profileImage.hidden = false;
    profilePlaceholder.hidden = true;
  });
  profileImage.addEventListener("error", () => {
    profileImage.hidden = true;
    profilePlaceholder.hidden = false;
  });

  // Scroll reveal
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Active navigation section
  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$(".nav-link").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Project filtering
  $$(".filter-button").forEach(button => button.addEventListener("click", () => {
    $$(".filter-button").forEach(item => item.classList.toggle("active", item === button));
    const filter = button.dataset.filter;
    $$(".project-card").forEach(card => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  }));

  const projectData = [
    {
      category: "NETWORK ENGINEERING",
      title: "Enterprise LAN/WLAN Network Design & Configuration",
      description: "A simulated corporate network architecture for departmental segmentation and controlled communication between teams.",
      objectives: ["Plan an IP addressing scheme and subnet departments using VLSM.", "Configure VLANs and inter-VLAN routing.", "Provide address assignment through DHCP.", "Apply ACL policies to restrict unauthorized cross-department traffic.", "Document and test the simulated network in Cisco Packet Tracer."],
      tags: ["Cisco Packet Tracer", "Cisco IOS", "VLANs", "VLSM", "DHCP", "ACLs"]
    },
    {
      category: "WEB DEVELOPMENT",
      title: "Responsive Full-Stack Personal Portfolio Website",
      description: "A responsive portfolio concept to present technical capabilities, project documentation, and a contact channel.",
      objectives: ["Create an accessible responsive interface.", "Build interactive elements with JavaScript.", "Track source changes with Git and GitHub.", "Connect a contact form after configuring a trusted provider.", "Deploy the site to a hosting platform."],
      tags: ["HTML5", "CSS3", "JavaScript", "Git", "GitHub", "Netlify / Vercel"]
    },
    {
      category: "SYSTEMS & SUPPORT",
      title: "IT Infrastructure Deployment & Hardware Diagnostics",
      description: "A workstation maintenance project outline covering device diagnostics, hardware upgrades, and operating system setup.",
      objectives: ["Inspect hardware and diagnose component issues.", "Document repairs or component replacements.", "Create bootable installation media.", "Install and configure an operating system.", "Verify updates, drivers, backups, and basic security settings."],
      tags: ["Windows", "Ubuntu Linux", "Rufus", "Hardware diagnostics", "Backup & recovery"]
    },
    {
      category: "DATABASES",
      title: "Database-Driven Inventory & Asset Management System",
      description: "A database application concept for keeping track of hardware inventory, software licenses, and assigned user assets.",
      objectives: ["Model entities and relationships using an ERD.", "Design normalized relational tables.", "Create and query inventory records.", "Track asset assignment and returns.", "Test data integrity and reporting queries."],
      tags: ["SQL", "MySQL", "PostgreSQL", "ERD", "Normalization"]
    },
    {
      category: "SECURITY",
      title: "System Hardening & Identity and Access Management",
      description: "A security project outline focused on user privileges, permissions, policy enforcement, and audit review.",
      objectives: ["Create role-based access rules.", "Apply least-privilege file and user permissions.", "Review password and account policies.", "Enable and inspect relevant audit logs.", "Document firewall and hardening checks."],
      tags: ["Linux", "Windows Server", "RBAC", "Audit logs", "Firewall"]
    }
  ];
  const modal = $("#project-modal");
  const modalTitle = $("#modal-title");
  const modalCategory = $("#modal-category");
  const modalDescription = $("#modal-description");
  const modalObjectives = $("#modal-objectives");
  const modalTags = $("#modal-tags");
  $$(".project-open").forEach(button => button.addEventListener("click", () => {
    const card = button.closest(".project-card");
    const project = projectData[Number(card.dataset.project)];
    if (!project) return;
    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalObjectives.replaceChildren(...project.objectives.map(text => {
      const li = document.createElement("li"); li.textContent = text; return li;
    }));
    modalTags.replaceChildren(...project.tags.map(text => {
      const tag = document.createElement("span"); tag.textContent = text; return tag;
    }));
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
  }));
  const closeModal = () => { if (typeof modal.close === "function") modal.close(); else modal.removeAttribute("open"); };
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-done").addEventListener("click", closeModal);
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.open) closeModal(); });

  // Contact form: submits to the supplied Formspree endpoint.
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrpeqvnd";
  const form = $("#contact-form");
  const formStatus = $("#form-status");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!FORMSPREE_ENDPOINT) {
      formStatus.textContent = "Setup needed: add your Formspree endpoint in script.js before using this form.";
      formStatus.className = "form-status error";
      showToast("Contact form is not connected yet.");
      return;
    }
    const submit = $(".form-submit", form);
    const originalText = submit.innerHTML;
    submit.disabled = true;
    submit.innerHTML = "<span>Sending…</span>";
    formStatus.textContent = "Sending your message…";
    formStatus.className = "form-status";
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });
      if (!response.ok) throw new Error("The message could not be sent. Please try again later.");
      form.reset();
      formStatus.textContent = "Thanks! Your message has been sent.";
      formStatus.className = "form-status success";
      showToast("Message sent successfully.");
    } catch (error) {
      formStatus.textContent = error.message || "Something went wrong. Please try again.";
      formStatus.className = "form-status error";
    } finally {
      submit.disabled = false;
      submit.innerHTML = originalText;
    }
  });

  // CV button explains missing asset rather than pretending a download exists.
  $("#cv-download").addEventListener("click", event => {
    // A real PDF is expected alongside this file. Missing files are handled by the browser;
    // users should add their CV before publishing.
    const link = event.currentTarget;
    if (link.dataset.ready !== "true") {
      // Do not prevent the link: once a real file is added, normal download works.
      showToast("Add your PDF CV as Emmanuel-Oloo-Baraka-CV.pdf before publishing.");
    }
  });

  // Small toast helper
  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
  }

  // Pointer glow on devices with a fine pointer.
  const cursorGlow = $(".cursor-glow");
  if (window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
    document.addEventListener("pointermove", event => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.opacity = "1";
    }, { passive: true });
    document.addEventListener("pointerleave", () => cursorGlow.style.opacity = "0");
  }

  // Lightweight network particle background.
  const canvas = $("#particle-canvas");
  const ctx = canvas.getContext && canvas.getContext("2d");
  if (ctx && !prefersReducedMotion) {
    let width = 0, height = 0, particles = [];
    const reducedCount = () => window.innerWidth < 600 ? 28 : 55;
    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width * ratio); canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: reducedCount() }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
        r: Math.random() * 1.5 + .5
      }));
    }
    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      const light = document.documentElement.dataset.theme === "light";
      const rgb = light ? "0,119,200" : "0,191,255";
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},.65)`; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 115) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${rgb},${.12 * (1 - distance / 115)})`; ctx.lineWidth = .7; ctx.stroke();
          }
        }
      });
      requestAnimationFrame(drawParticles);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    drawParticles();
  } else if (canvas) {
    canvas.hidden = true;
  }
})();