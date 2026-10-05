(function () {
  "use strict";

  var CFG = window.SHOP_CONFIG;
  var SHELLS = window.SHELLS || [];
  var PLACEHOLDER = "assets/img/placeholder.svg";
  var CART_KEY = "tideline-cart";

  // ---------- helpers ----------

  function $(sel, root) { return (root || document).querySelector(sel); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function money(n) {
    return "NZ$" + Number(n).toFixed(2).replace(/\.00$/, "");
  }

  function findShell(id) {
    for (var i = 0; i < SHELLS.length; i++) if (SHELLS[i].id === id) return SHELLS[i];
    return null;
  }

  // Small italic scientific-name line, only when one is known.
  function sciHtml(shell, tag) {
    return shell.scientific ? "<" + tag + ' class="sci-sub">' + esc(shell.scientific) + "</" + tag + ">" : "";
  }

  function photo(shell, i) {
    return (shell.photos && shell.photos[i || 0]) || PLACEHOLDER;
  }

  function stockLabel(shell) {
    if (shell.stock <= 0) return { text: "Sold out", cls: "out" };
    if (shell.stock <= 2) return { text: "Only " + shell.stock + " left", cls: "low" };
    return { text: shell.stock + " in stock", cls: "" };
  }

  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  // ---------- cart (stored in the browser) ----------

  function readCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY)) || {};
      // Drop items that no longer exist and clamp to current stock.
      var clean = {};
      Object.keys(raw).forEach(function (id) {
        var s = findShell(id);
        if (s && s.stock > 0) clean[id] = Math.min(raw[id], s.stock);
      });
      return clean;
    } catch (e) {
      return {};
    }
  }

  function writeCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* private mode */ }
    renderCart();
    document.dispatchEvent(new CustomEvent("cart:change"));
  }

  function addToCart(id, qty) {
    var s = findShell(id);
    if (!s || s.stock <= 0) return;
    var cart = readCart();
    var next = Math.min((cart[id] || 0) + qty, s.stock);
    if (next === cart[id]) { toast("You already have all " + s.stock + " in your cart"); return; }
    cart[id] = next;
    writeCart(cart);
    toast(s.name + " added to cart");
  }

  function setQty(id, qty) {
    var s = findShell(id);
    var cart = readCart();
    if (!s || qty <= 0) delete cart[id];
    else cart[id] = Math.min(qty, s.stock);
    writeCart(cart);
  }

  function cartLines() {
    var cart = readCart();
    return Object.keys(cart).map(function (id) {
      var s = findShell(id);
      return { shell: s, qty: cart[id], total: s.price * cart[id] };
    });
  }

  function cartTotals() {
    var lines = cartLines();
    var subtotal = lines.reduce(function (sum, l) { return sum + l.total; }, 0);
    var count = lines.reduce(function (sum, l) { return sum + l.qty; }, 0);
    var shipping = count > 0 ? CFG.shippingFlatRate : 0;
    return { lines: lines, count: count, subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
  }

  // ---------- shared header / footer / drawer ----------

  function renderChrome() {
    var page = document.body.getAttribute("data-page");
    var header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML =
      '<div class="wrap">' +
        '<a class="logo" href="index.html">Tideline <span>Shells</span></a>' +
        '<nav class="nav">' +
          '<a href="index.html#catalog"' + (page === "shop" ? ' class="active"' : "") + ">Shop</a>" +
          '<a class="hide-sm" href="how-to-order.html"' + (page === "how" ? ' class="active"' : "") + ">How to order</a>" +
          '<button class="cart-btn" type="button" id="cart-open" aria-label="Open cart">Cart <span class="cart-count" id="cart-count">0</span></button>' +
        "</nav>" +
      "</div>";
    document.body.insertBefore(header, document.body.firstChild);

    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="wrap">' +
        "<div>&copy; " + new Date().getFullYear() + " " + esc(CFG.name) + " &middot; Collector shells from Aotearoa New Zealand</div>" +
        '<div><a href="how-to-order.html">How to order &amp; FAQ</a> &nbsp;&middot;&nbsp; <a href="mailto:' + esc(CFG.contactEmail) + '">' + esc(CFG.contactEmail) + "</a></div>" +
      "</div>";
    document.body.appendChild(footer);

    var drawer = document.createElement("div");
    drawer.innerHTML =
      '<div class="drawer-backdrop" id="drawer-backdrop"></div>' +
      '<aside class="drawer" id="drawer" aria-label="Cart" aria-hidden="true">' +
        '<div class="drawer-head"><h2>Your cart</h2><button class="icon-btn" id="cart-close" aria-label="Close cart">&times;</button></div>' +
        '<div class="drawer-items" id="drawer-items"></div>' +
        '<div class="drawer-foot" id="drawer-foot"></div>' +
      "</aside>" +
      '<div class="toast" id="toast" role="status" aria-live="polite"></div>';
    document.body.appendChild(drawer);

    $("#cart-open").addEventListener("click", openDrawer);
    $("#cart-close").addEventListener("click", closeDrawer);
    $("#drawer-backdrop").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

    $("#drawer-items").addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-act]");
      if (!btn) return;
      var id = btn.getAttribute("data-id");
      var cart = readCart();
      var act = btn.getAttribute("data-act");
      if (act === "inc") setQty(id, (cart[id] || 0) + 1);
      if (act === "dec") setQty(id, (cart[id] || 0) - 1);
      if (act === "rm") setQty(id, 0);
    });

    renderCart();
  }

  function openDrawer() {
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#drawer-backdrop").classList.add("open");
  }

  function closeDrawer() {
    $("#drawer").classList.remove("open");
    $("#drawer").setAttribute("aria-hidden", "true");
    $("#drawer-backdrop").classList.remove("open");
  }

  function totalsHtml(t) {
    return '<div class="totals">' +
      "<div><span>Subtotal</span><span>" + money(t.subtotal) + "</span></div>" +
      "<div><span>Shipping (NZ, flat rate)</span><span>" + money(t.shipping) + "</span></div>" +
      '<div class="grand"><span>Total</span><span>' + money(t.total) + "</span></div>" +
    "</div>";
  }

  function renderCart() {
    var t = cartTotals();
    var countEl = $("#cart-count");
    if (countEl) countEl.textContent = t.count;
    var items = $("#drawer-items");
    var foot = $("#drawer-foot");
    if (!items) return;

    if (!t.lines.length) {
      items.innerHTML = '<p class="empty">Your cart is empty.</p>';
      foot.innerHTML = '<a class="btn btn-ghost btn-block" href="index.html#catalog">Browse shells</a>';
      return;
    }

    items.innerHTML = t.lines.map(function (l) {
      var s = l.shell;
      return '<div class="line-item">' +
        '<img src="' + esc(photo(s)) + '" alt="">' +
        "<div>" +
          '<a class="title" href="shell.html?id=' + encodeURIComponent(s.id) + '">' + esc(s.name) + "</a>" +
          '<div class="line-controls">' +
            '<button type="button" data-act="dec" data-id="' + esc(s.id) + '" aria-label="One less">&minus;</button>' +
            "<span>" + l.qty + "</span>" +
            '<button type="button" data-act="inc" data-id="' + esc(s.id) + '" aria-label="One more"' + (l.qty >= s.stock ? " disabled" : "") + ">+</button>" +
            '<button type="button" class="remove" data-act="rm" data-id="' + esc(s.id) + '">Remove</button>' +
          "</div>" +
        "</div>" +
        "<div>" + money(l.total) + "</div>" +
      "</div>";
    }).join("");

    foot.innerHTML = totalsHtml(t) +
      '<a class="btn btn-block" href="order.html">Request order</a>' +
      '<p class="fine">No payment is taken online. We confirm stock, then email bank transfer or crypto details.</p>';
  }

  // ---------- catalog page ----------

  function cardHtml(s) {
    var st = stockLabel(s);
    return '<a class="card" href="shell.html?id=' + encodeURIComponent(s.id) + '">' +
      '<div class="card-img">' +
        '<img loading="lazy" src="' + esc(photo(s)) + '" alt="' + esc(s.name) + '">' +
        (st.cls ? '<span class="badge ' + st.cls + '">' + st.text + "</span>" : "") +
      "</div>" +
      '<div class="card-body">' +
        '<div class="meta">' + esc(s.type) + "</div>" +
        '<div class="title">' + esc(s.name) + "</div>" +
        sciHtml(s, "div") +
        '<div class="card-foot"><span class="price">' + money(s.price) + "</span>" +
        '<span class="stock-note">' + s.sizeMm + " mm</span></div>" +
      "</div>" +
    "</a>";
  }

  function initCatalog() {
    var grid = $("#grid");
    var q = $("#f-search"), fam = $("#f-type"), size = $("#f-size"), sort = $("#f-sort"), inStock = $("#f-instock");

    var types = SHELLS.map(function (s) { return s.type; })
      .filter(function (f, i, a) { return f && a.indexOf(f) === i; })
      .sort();
    fam.innerHTML = '<option value="">All types</option>' +
      types.map(function (f) { return '<option value="' + esc(f) + '">' + esc(f) + "</option>"; }).join("");

    function apply() {
      var term = q.value.trim().toLowerCase();
      var sizeRange = size.value ? size.value.split("-").map(Number) : null;
      var list = SHELLS.filter(function (s) {
        if (fam.value && s.type !== fam.value) return false;
        if (inStock.checked && s.stock <= 0) return false;
        if (sizeRange && (s.sizeMm < sizeRange[0] || s.sizeMm > sizeRange[1])) return false;
        if (term) {
          var hay = [s.name, s.scientific, s.type].join(" ").toLowerCase();
          if (hay.indexOf(term) === -1) return false;
        }
        return true;
      });

      var key = sort.value;
      list.sort(function (a, b) {
        if (key === "price-asc") return a.price - b.price;
        if (key === "price-desc") return b.price - a.price;
        if (key === "size-asc") return a.sizeMm - b.sizeMm;
        if (key === "size-desc") return b.sizeMm - a.sizeMm;
        if (key === "type") return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
        return a.name.localeCompare(b.name);
      });

      $("#result-count").textContent = list.length + " of " + SHELLS.length + " species";
      grid.innerHTML = list.length
        ? list.map(cardHtml).join("")
        : '<p class="empty">No shells match those filters.</p>';
    }

    [q, fam, size, sort, inStock].forEach(function (el) {
      el.addEventListener(el.tagName === "INPUT" && el.type === "search" ? "input" : "change", apply);
    });
    apply();
  }

  // ---------- product page ----------

  function initProduct() {
    var id = new URLSearchParams(location.search).get("id");
    var s = findShell(id);
    var root = $("#product");
    if (!s) {
      root.innerHTML = '<div><h1>Shell not found</h1><p><a href="index.html#catalog">Back to the shop</a></p></div>';
      $("#notify-section").classList.add("hidden");
      return;
    }

    document.title = s.name + " | " + CFG.name;
    var photos = s.photos && s.photos.length ? s.photos : [PLACEHOLDER];
    var st = stockLabel(s);

    root.innerHTML =
      "<div>" +
        '<div class="gallery-main" id="gallery-main"><img id="main-img" src="' + esc(photos[0]) + '" alt="' + esc(s.name) + '"></div>' +
        (photos.length > 1
          ? '<div class="thumbs" id="thumbs">' + photos.map(function (p, i) {
              return '<button type="button" data-i="' + i + '" aria-current="' + (i === 0) + '"><img src="' + esc(p) + '" alt="View ' + (i + 1) + '"></button>';
            }).join("") + "</div>"
          : "") +
      "</div>" +
      "<div>" +
        '<p class="eyebrow">' + esc(s.type) + "</p>" +
        "<h1>" + esc(s.name) + "</h1>" +
        sciHtml(s, "p") +
        '<div class="price">' + money(s.price) + ' <span class="fine">each</span></div>' +
        (s.description ? "<p>" + esc(s.description) + "</p>" : "") +
        '<dl class="specs">' +
          "<dt>Type</dt><dd>" + esc(s.type) + "</dd>" +
          (s.scientific ? '<dt>Scientific</dt><dd><em>' + esc(s.scientific) + "</em></dd>" : "") +
          "<dt>Size</dt><dd>" + s.sizeMm + " mm</dd>" +
          '<dt>Stock</dt><dd class="stock-note ' + st.cls + '">' + st.text + "</dd>" +
        "</dl>" +
        (s.stock > 0
          ? '<div class="buy-row">' +
              '<div class="qty"><button type="button" id="q-dec" aria-label="One less">&minus;</button>' +
              '<input id="q-val" type="number" min="1" max="' + s.stock + '" value="1" aria-label="Quantity">' +
              '<button type="button" id="q-inc" aria-label="One more">+</button></div>' +
              '<button class="btn" type="button" id="add">Add to cart</button>' +
            "</div>"
          : "") +
        '<a class="back" href="index.html#catalog">&larr; Back to all shells</a>' +
      "</div>";

    var main = $("#main-img");
    var thumbs = $("#thumbs");
    if (thumbs) {
      thumbs.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-i]");
        if (!b) return;
        main.src = photos[+b.getAttribute("data-i")];
        Array.prototype.forEach.call(thumbs.children, function (c) { c.setAttribute("aria-current", String(c === b)); });
      });
    }

    var lb = $("#lightbox");
    $("#gallery-main").addEventListener("click", function () {
      $("#lightbox-img").src = main.src;
      lb.classList.add("open");
    });
    lb.addEventListener("click", function () { lb.classList.remove("open"); });

    if (s.stock > 0) {
      var qv = $("#q-val");
      function clamp(n) { return Math.max(1, Math.min(s.stock, n || 1)); }
      $("#q-dec").addEventListener("click", function () { qv.value = clamp(+qv.value - 1); });
      $("#q-inc").addEventListener("click", function () { qv.value = clamp(+qv.value + 1); });
      qv.addEventListener("change", function () { qv.value = clamp(+qv.value); });
      $("#add").addEventListener("click", function () { addToCart(s.id, clamp(+qv.value)); openDrawer(); });
      $("#notify-section").classList.add("hidden");
    } else {
      $("#notify-species").value = s.name + " (" + s.id + ")";
      $("#notify-name").textContent = s.name;
    }
  }

  // ---------- order page ----------

  function initOrder() {
    var form = $("#order-form");

    function refresh() {
      var t = cartTotals();
      $("#order-summary").innerHTML = t.lines.length
        ? t.lines.map(function (l) {
            return '<div class="line-item" style="grid-template-columns:48px 1fr auto">' +
              '<img src="' + esc(photo(l.shell)) + '" alt="" style="width:48px;height:48px">' +
              '<div><span class="title" style="font-size:1rem">' + esc(l.shell.name) + '</span><div class="fine">Qty ' + l.qty + " &times; " + money(l.shell.price) + "</div></div>" +
              "<div>" + money(l.total) + "</div></div>";
          }).join("") + '<div style="margin-top:16px">' + totalsHtml(t) + "</div>"
        : '<p class="empty">Your cart is empty. <a href="index.html#catalog">Browse shells</a></p>';

      $("#submit-order").disabled = !t.lines.length;

      // Plain-text copy of the order that gets emailed to you.
      $("#order-field").value = t.lines.map(function (l) {
        return l.qty + " x " + l.shell.name + (l.shell.scientific ? " (" + l.shell.scientific + ")" : "") + " [" + l.shell.id + "] @ " + money(l.shell.price) + " = " + money(l.total);
      }).join("\n") +
        "\n\nSubtotal: " + money(t.subtotal) +
        "\nShipping: " + money(t.shipping) +
        "\nTOTAL: " + money(t.total);
      $("#total-field").value = money(t.total);
    }

    document.addEventListener("cart:change", refresh);
    refresh();

    form.addEventListener("submit", function (e) {
      if (!cartTotals().lines.length) { e.preventDefault(); return; }
      refresh();
      // Clear the cart once the order request has been handed to Netlify.
      try { sessionStorage.setItem("tideline-just-ordered", "1"); } catch (err) { /* ignore */ }
    });
  }

  function initThanks() {
    var flag = null;
    try { flag = sessionStorage.getItem("tideline-just-ordered"); } catch (e) { /* ignore */ }
    if (flag) {
      try { sessionStorage.removeItem("tideline-just-ordered"); } catch (e) { /* ignore */ }
      writeCart({});
    }
  }

  // ---------- fill config values into static pages ----------

  function fillConfig() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-cfg]"), function (el) {
      var key = el.getAttribute("data-cfg");
      var v = CFG[key];
      if (key === "shippingFlatRate") v = money(v);
      el.textContent = v;
    });
  }

  // ---------- boot ----------

  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    fillConfig();
    var page = document.body.getAttribute("data-page");
    if (page === "shop") initCatalog();
    if (page === "product") initProduct();
    if (page === "order") initOrder();
    if (page === "thanks") initThanks();
  });
})();
