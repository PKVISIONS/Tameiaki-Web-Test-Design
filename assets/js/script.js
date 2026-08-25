// Emblem Tamiaki - Interactive Functionality
// Modern Greek POS Landing Page

/**
 * Initialize all interactive features when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initFAQAccordion();
  initStepAutoplay();
  initScrollAnimations();
  initSmoothScroll();
  initNavbarScroll();
  initStatsCounter();
  initDecoParallax();
  initDeviceTilt();
  initPosDeviceCarousel();
  initDemoFormSubmission();
});

/**
 * Step number autoplay
 * Cycles the active state through each step number and loops continuously
 */
function initStepAutoplay() {
  const stepNumbers = document.querySelectorAll(".step-num");

  if (stepNumbers.length < 2) {
    return;
  }

  let activeIndex = Array.from(stepNumbers).findIndex((stepNumber) =>
    stepNumber.classList.contains("active"),
  );

  if (activeIndex === -1) {
    activeIndex = 0;
    stepNumbers[activeIndex].classList.add("active");
  }

  const setActiveStep = (index) => {
    stepNumbers.forEach((stepNumber, stepIndex) => {
      stepNumber.classList.toggle("active", stepIndex === index);
    });
  };

  setInterval(() => {
    activeIndex = (activeIndex + 1) % stepNumbers.length;
    setActiveStep(activeIndex);
  }, 2500);
}

/**
 * FAQ Accordion functionality
 * Toggles FAQ items open/closed
 */
function initFAQAccordion() {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = button.querySelector('i');
            const isOpen = faqItem.classList.contains('open');

            // Close other items
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                if (openItem !== faqItem) {
                    const openAnswer = openItem.querySelector('.faq-answer');
                    const openIcon = openItem.querySelector('i');
                    openItem.classList.remove('open');
                    openAnswer.classList.remove('open');
                    openAnswer.style.maxHeight = null;
                    openAnswer.style.paddingTop = "0px";
                    openAnswer.style.paddingBottom = "0px";
                    openIcon.classList.remove('bi-dash');
                    openIcon.classList.add('bi-plus');
                }
            });

            // Toggle current
            if (!isOpen) {
                faqItem.classList.add('open');
                answer.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingTop = "16px";
                answer.style.paddingBottom = "16px";
                icon.classList.remove('bi-plus');
                icon.classList.add('bi-dash');
            } else {
                faqItem.classList.remove('open');
                answer.classList.remove('open');
                answer.style.maxHeight = null;
                answer.style.paddingTop = "0px";
                answer.style.paddingBottom = "0px";
                icon.classList.remove('bi-dash');
                icon.classList.add('bi-plus');
            }
        });
    });
}

/**
 * Mobile hamburger menu toggle
 * Opens/closes mobile navigation menu with modal overlay
 */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburgerMenu");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileLinks = document.querySelectorAll(".mobile-menu-links a");
  const body = document.body;

  if (!hamburger || !mobileMenu) {
    return;
  }

  const closeMenu = () => {
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("active");
    body.classList.remove("menu-open");
  };

  const openMenu = () => {
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("active");
    body.classList.add("menu-open");
  };

  // Toggle menu on hamburger click
  hamburger.addEventListener("click", function () {
    if (mobileMenu.classList.contains("active")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  // Close menu when a link is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  // Close menu when backdrop/overlay is clicked
  mobileMenu.addEventListener("click", function (e) {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });

  // Close menu when CTA button is clicked
  const ctaButton = document.querySelector(".nav-cta-mobile");
  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      closeMenu();
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", function () {
      closeMenu();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 932) {
      closeMenu();
    }
  });
}

/** * Scroll-triggered animations using Intersection Observer
 * Animates elements when they come into viewport
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".feature-card, .stat-card, .step, .pricing-card",
  );

  // Set initial state
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
  });

  // Create observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeUp 0.6s ease forwards";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  // Observe all animated elements
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Skip if it's just '#'
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/**
 * Navbar scroll effect
 * Adds shadow to navbar when scrolling
 */
function initNavbarScroll() {
  const navbar = document.querySelector("nav");

  if (!navbar) {
    return;
  }

  const SCROLL_THRESHOLD = 10;

  const updateNavbar = () => {
    const scrollTop = Math.max(
      window.scrollY || 0,
      document.documentElement.scrollTop || 0,
      document.body.scrollTop || 0,
    );

    if (scrollTop > SCROLL_THRESHOLD) {
      navbar.classList.add("scrolled");
      document.body.classList.remove("nav-at-top");
    } else {
      navbar.classList.remove("scrolled");
      document.body.classList.add("nav-at-top");
    }
  };

  window.addEventListener("scroll", updateNavbar, { passive: true });
  window.addEventListener("load", updateNavbar);
  window.addEventListener("pageshow", updateNavbar);
  window.addEventListener("resize", updateNavbar, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateNavbar();
    }
  });

  updateNavbar();
  requestAnimationFrame(updateNavbar);
  setTimeout(updateNavbar, 120);
}

/**
 * Button ripple effect (optional enhancement)
 */
function addButtonRipple(button, event) {
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.classList.add("ripple");

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

/**
 * Optional: Initialize button ripple effects
 */
function initButtonRipples() {
  const buttons = document.querySelectorAll(
    ".btn-primary, .btn-outline, .btn-white",
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      addButtonRipple(this, e);
    });
  });
}

/**
 * Utility: Debounce function for performance
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Optional: Count-up animation for stats
 */
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

/**
 * Stats count-up animation
 * Triggers once when stats section enters viewport
 */
function initStatsCounter() {
  const statsSection = document.querySelector(".stats");
  const statNumbers = document.querySelectorAll(".stat-num");

  if (!statsSection || statNumbers.length === 0) return;

  statNumbers.forEach((element) => {
    const rawText = element.textContent.trim();
    const numericMatch = rawText.match(/[\d.,]+/);

    if (!numericMatch) return;

    const suffix = rawText.replace(/[\d.,\s]/g, "");
    const numericPart = numericMatch[0];

    let target = 0;
    if (numericPart.includes(".") && !numericPart.includes(",")) {
      target = parseInt(numericPart.replace(/\./g, ""), 10);
    } else {
      target = parseFloat(numericPart.replace(/\./g, "").replace(",", "."));
    }

    element.dataset.target = String(target);
    element.dataset.suffix = suffix;
    element.textContent = "0" + suffix;
  });

  const runCounter = (element, duration = 1800) => {
    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || "";
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * eased);

      element.textContent = currentValue.toLocaleString("el-GR") + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        statNumbers.forEach((element, index) => {
          setTimeout(() => runCounter(element), index * 120);
        });

        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35,
    },
  );

  observer.observe(statsSection);
}

/**
 * 3D cursor-follow tilt effect for the device image
 */
function initDeviceTilt() {
  const visual = document.querySelector(".device-visual");
  const img = visual ? visual.querySelector("img") : null;
  if (!visual || !img) return;

  // Wrap in a perspective container
  visual.style.perspective = "800px";
  img.style.transition = "transform 0.12s ease-out";
  img.style.willChange = "transform";
  img.style.display = "block";

  const MAX_TILT = 5; // degrees
  const MAX_LIFT = 10; // px translateZ
  const MAX_SCALE = 1.0;

  visual.addEventListener("mousemove", (e) => {
    const rect = visual.getBoundingClientRect();
    // Normalised -1 → +1 relative to center
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    const rotateY = nx * MAX_TILT;
    const rotateX = -ny * MAX_TILT;

    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${MAX_LIFT}px) scale(${MAX_SCALE})`;
  });

  visual.addEventListener("mouseleave", () => {
    img.style.transition = "transform 0.5s ease";
    img.style.transform =
      "rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
    // Restore snappy transition after spring-back
    setTimeout(() => {
      img.style.transition = "transform 0.12s ease-out";
    }, 500);
  });
}

/**
 * Parallax scroll effect for decorative objects in Device section
 * Each object moves at a different speed/direction on scroll
 */
function initDecoParallax() {
  const section = document.querySelector(".device-section");
  const deco1 = document.querySelector(".deco-1");
  const deco2 = document.querySelector(".deco-2");
  const deco3 = document.querySelector(".deco-3");

  if (!section || !deco1 || !deco2 || !deco3) return;

  // Parallax config per object: [xFactor, yFactor]
  // Positive y → moves down on scroll-down, negative → moves up
  const configs = [
    { el: deco1, x: 0.04, y: -0.07 }, // drifts right + up
    { el: deco2, x: -0.05, y: 0.06 }, // drifts left + down
    { el: deco3, x: 0.05, y: 0.05 }, // drifts right + down
  ];

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const sectionH = section.offsetHeight;
        // progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
        const progress = 1 - rect.bottom / (sectionH + window.innerHeight);

        configs.forEach(({ el, x, y }) => {
          const tx = progress * x * window.innerWidth;
          const ty = progress * y * window.innerHeight;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  });
}

function initResponsiveLogoSlider() {
  const slider = document.querySelector(".img-slider");

  if (!slider || typeof window.jQuery === "undefined") {
    return;
  }

  const $slider = window.jQuery(slider);
  const mobileBreakpoint = 768;

  const enableCarousel = () => {
    if ($slider.hasClass("owl-loaded")) {
      return;
    }

    $slider.owlCarousel({
      items: 1,
      loop: true,
      margin: 0,
      autoplay: true,
      autoplayTimeout: 2600,
      autoplayHoverPause: true,
      nav: false,
      dots: true,
      center: false,
      stagePadding: 0,
      autoWidth: false,
      touchDrag: true,
      mouseDrag: true,
    });
  };

  const disableCarousel = () => {
    if (!$slider.hasClass("owl-loaded")) {
      return;
    }

    $slider.trigger("destroy.owl.carousel");
    $slider.removeClass("owl-loaded owl-hidden");
    slider.querySelectorAll(".owl-stage-outer, .owl-stage, .owl-item").forEach(
      (element) => {
        element.replaceWith(...element.childNodes);
      },
    );
  };

  const updateSliderMode = () => {
    if (window.innerWidth <= mobileBreakpoint) {
      enableCarousel();
      return;
    }

    disableCarousel();
  };

  updateSliderMode();
  window.addEventListener("resize", debounce(updateSliderMode, 150));
}

function initResponsivePartnersSlider() {
  const slider = document.querySelector(".partners-box");

  if (!slider || typeof window.jQuery === "undefined") {
    return;
  }

  const $slider = window.jQuery(slider);
  const mobileBreakpoint = 768;

  const enableCarousel = () => {
    if ($slider.hasClass("owl-loaded")) {
      return;
    }

    $slider.owlCarousel({
      items: 1,
      loop: true,
      margin: 0,
      autoplay: true,
      autoplayTimeout: 2400,
      autoplayHoverPause: true,
      nav: false,
      dots: false,
      center: false,
      stagePadding: 0,
      autoWidth: false,
      touchDrag: true,
      mouseDrag: true,
    });
  };

  const disableCarousel = () => {
    if (!$slider.hasClass("owl-loaded")) {
      return;
    }

    $slider.trigger("destroy.owl.carousel");
    $slider.removeClass("owl-loaded owl-hidden");
    slider.querySelectorAll(".owl-stage-outer, .owl-stage, .owl-item").forEach(
      (element) => {
        element.replaceWith(...element.childNodes);
      },
    );
  };

  const updateSliderMode = () => {
    if (window.innerWidth <= mobileBreakpoint) {
      enableCarousel();
      return;
    }

    disableCarousel();
  };

  updateSliderMode();
  window.addEventListener("resize", debounce(updateSliderMode, 150));
}

function initPosDeviceCarousel() {
  const slider = document.querySelector(".device-carousel");

  if (!slider || typeof window.jQuery === "undefined") {
    return;
  }

  const $slider = window.jQuery(slider);

  if ($slider.hasClass("owl-loaded")) {
    return;
  }

  $slider.owlCarousel({
    items: 1,
    loop: true,
    margin: 24,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    smartSpeed: 700,
    nav: false,
    dots: true,
    mouseDrag: true,
    touchDrag: true,
    responsive: {
      0: {
        stagePadding: 0,
      },
      992: {
        stagePadding: 18,
      },
    },
  });
}

function initDemoFormSubmission() {
  const form = document.querySelector(".demo-form");
  const submitButton = document.querySelector(".demo-submit");
  const phoneInput = form ? form.querySelector('#phone') : null;
  const consentCheckbox = form
    ? form.querySelector('.demo-checkbox input[type="checkbox"]')
    : null;

  if (!form || !submitButton || !consentCheckbox || !phoneInput || typeof window.jQuery === "undefined") {
    return;
  }

  phoneInput.addEventListener("input", function () {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
  });

  form.addEventListener("submit", function (event) {
    
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!consentCheckbox.checked) {
      consentCheckbox.reportValidity();
      return;
    }

    const $form = window.jQuery(form);
    const ar = $form
      .serializeArray()
      .reduce((accumulator, field) => {
        accumulator[field.name] = field.value;
        return accumulator;
      }, {});
    ar.source = "land-form-tamiaki";
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Αποστολή...";

    window.jQuery.ajax({
      type: "POST",
      url: "../landingPageForms.php?op=submitContactLandingPage",
      data: ar,
      dataType: "json",
      success(result) {
        if (result && result.msg == "ok") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Επιτυχία",
            text: "Η φόρμα επικοινωνίας υποβλήθηκε επιτυχώς",
          });
          form.reset();
          window.jQuery("#firstname").val("");
          window.jQuery("#lastname").val("");
          window.jQuery("#phone").val("");          
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Σφάλμα",
            text: "Υπήρξε ένα σφάλμα κατά την υποβολή της φόρμας. Δοκιμάστε ξανά",
          });
        }
      },
      error() {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Σφάλμα",
          text: "Υπήρξε ένα σφάλμα κατά την υποβολή της φόρμας. Δοκιμάστε ξανά",
        });
      },
      complete() {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initResponsiveLogoSlider();
  initResponsivePartnersSlider();
  initPosDeviceCarousel();
});

/**
 * Export functions for global access if needed
 */
window.EmblemTamiaki = {
  initScrollAnimations,
  initFAQAccordion,
  initSmoothScroll,
  initNavbarScroll,
  initStatsCounter,
  initPosDeviceCarousel,
  initResponsiveLogoSlider,
  initResponsivePartnersSlider,
  initDemoFormSubmission,
  animateCounter,
};
