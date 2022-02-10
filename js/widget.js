window.CC_WIDGET = {
  hasInitialized: false,
  catererSlug: null,
  init() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;
    const self = this;

    window.addEventListener("message", function ({ data: message, origin }) {
      console.log({ origin });
      if (origin !== "https://qa2.catercow.com") return;
      if (message === "close") {
        self.close();
      } else if (message.startsWith("http")) {
        window.open(message);
      }
    });

    this.attachLinks();
  },
  attachLinks() {
    const self = this;
    const links = document.querySelectorAll(
      'a[href^="https://www.catercow.com/catering/"]'
    );
    [].forEach.call(links, (oldElement) => {
      // Check if we have already loaded this link
      if (oldElement.getAttribute("cc-loaded")) return;

      // Clone/replace node to strip event listeners
      const el = oldElement.cloneNode(true);
      oldElement.parentNode.replaceChild(el, oldElement);

      // Mark it as loaded so we don't keep running
      el.setAttribute("cc-loaded", "true");
      el.style.cursor = "pointer";

      // Get slug from URL
      if (!self.catererSlug)
        self.catererSlug = el.getAttribute("href").split("/")[4];

      // Add new event listeners
      el.addEventListener("mouseenter", () => el.removeAttribute("href"));
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        self.open();
      });
    });

    // Scan for new links every second, in case we are dealing with a SPA
    setTimeout(this.attachLinks, 1000);
  },
  open() {
    if (document.getElementById("cc-widget")) return;
    var child = document.createElement("div");
    child.innerHTML = `<iframe src="https://qa2.catercow.com/catering/${this.catererSlug}/widget"
              style="width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; z-index: 9999999;"
              frameborder="0"
              id="cc-widget"></iframe>`;
    child = child.firstChild;
    document.body.appendChild(child);
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
  },
  close() {
    const widget = document.getElementById("cc-widget");
    if (widget) widget.remove();
    document.body.style.overflow = "scroll";
    document.body.style.height = "auto";
  },
};
document.addEventListener("DOMContentLoaded", () => window.CC_WIDGET.init());
