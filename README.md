# Tideline Shells

A dark, gallery-style shop for collector specimen shells, based in New Zealand.

There's no card checkout. Customers add shells to a cart and send an **order request**. You get it by email, confirm stock, and reply with bank transfer or stablecoin (USDC/USDT) payment details.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Catalog with search, family, size filters and sorting |
| `shell.html?id=…` | Species page: photo gallery with zoom, size, stock, add to cart. Sold-out species show a "Notify me" form |
| `order.html` | Order request form (address + bank/crypto choice) with order summary |
| `how-to-order.html` | The 3-step ordering process and FAQ |
| `thanks.html` | Confirmation after an order or notify-me sign-up |

## Updating the shop

All the shop data is in two files:

- **`data/shells.js`**: every species, with its price, size, stock and photos. Set `stock: 0` to show *Sold out*.
- **`data/config.js`**: flat shipping rate, hold period, contact email.

Photos go in `assets/img/shells/` and are listed in each shell's `photos` (first photo = main image). Square images around 1200×1200 px on a dark background look best. Shells with no photos show a "Photo coming soon" placeholder.

> The 8 shells in `data/shells.js` are **sample data**. Replace them with your real stock.

## Going live on Netlify (free)

1. Create a free account at netlify.com and choose **Add new site → Import from GitHub** and pick this repo. No build settings are needed.
2. In **Site configuration → Forms**, enable form detection and redeploy. The `order` and `notify` forms will appear.
3. In **Forms → Form notifications**, add an email notification so each order request and notify-me sign-up is emailed to you.
4. Later, buy a `.co.nz` domain and connect it under **Domain management**.

Free tier: 100 form submissions per month.

## Preview locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.
