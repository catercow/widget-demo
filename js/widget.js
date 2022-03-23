var LOADING_STYLES = `
.widget-overlay {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0,0,0,0.5);
  z-index: 99999;
}

.widget-overlay__inner {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}

.widget-overlay__content {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

.widget-spinner {
  width: 75px;
  height: 75px;
  display: inline-block;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.05);
  border-top-color: #fff;
  animation: spin 1s infinite linear;
  border-radius: 100%;
  border-style: solid;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}`;

window.CC_WIDGET = {
  ALLOWED_ORIGINS: ["https://www.catercow.test"],
  hasInitialized: false,
  catererSlug: null,
  init() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;
    var self = this;

    // Inject loading styles
    var styleSheet = document.createElement("style");
    styleSheet.innerText = LOADING_STYLES;
    document.head.appendChild(styleSheet);

    window.addEventListener("message", function ({ data: message, origin }) {
      if (!self.ALLOWED_ORIGINS.includes(origin)) return;
      if (message === "close") {
        self.close();
      } else if (message.startsWith("https")) {
        window.open(message);
      }
    });

    this.attachLinks();
  },
  attachLinks() {
    var self = this;
    var links = document.querySelectorAll(
      'a[href^="https://www.catercow.test/catering/"]'
    );
    [].forEach.call(links, (oldElement) => {
      // Check if we have already loaded this link
      if (oldElement.getAttribute("cc-loaded")) return;

      // Clone/replace node to strip event listeners
      var el = oldElement.cloneNode(true);
      oldElement.parentNode.replaceChild(el, oldElement);

      // Mark it as loaded so we don't keep running
      el.setAttribute("cc-loaded", "true");
      el.style.cursor = "pointer";

      // Get slug from URL
      if (!self.catererSlug)
        self.catererSlug = el.getAttribute("href").split("/")[4];

      // Add new event listeners
      el.addEventListener("mouseenter", () => el.removeAttribute("href"));
      el.addEventListener("click", () => self.open());
    });

    // Scan for new links every second, in case we are dealing with a SPA
    setTimeout(this.attachLinks, 1000);
  },
  addLoadingOverLay() {
    var overlay = document.createElement("div");
    var spinner = `<div id="widget-overlay" class="widget-overlay">
      <div class="widget-overlay__inner">
        <div class="widget-overlay__content">
          <span class="widget-spinner"></span>
        </div>
      </div>
    </div>`;

    overlay.innerHTML = spinner;
    document.body.appendChild(overlay);
  },
  open() {
    if (document.getElementById("cc-widget")) return;

    this.addLoadingOverLay();

    var child = document.createElement("div");
    // SET TO QA2 for testing
    var widgetFrame = `<iframe src="https://qa2.catercow.com/catering/${this.catererSlug}/referral?embedded=true" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; bottom: 0; right: 0; z-index: 9999999;" frameborder="0" id="cc-widget"></iframe>`;
    child.innerHTML = widgetFrame;

    child = child.firstChild;
    document.body.appendChild(child);

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
  },
  close() {
    var widget = document.getElementById("cc-widget");
    if (widget) widget.remove();

    var loadingOverlay = document.getElementById("widget-overlay");
    if (loadingOverlay) loadingOverlay.remove();

    document.body.style.overflow = "scroll";
    document.body.style.height = "auto";
  },
};

document.addEventListener("DOMContentLoaded", () => window.CC_WIDGET.init());
