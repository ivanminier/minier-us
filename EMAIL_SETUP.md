# Email for ivan@minier.us

## Intended incoming setup

```text
ivan@minier.us
        →
ivanfminier@gmail.com
```

This uses Cloudflare Email Routing. It is forwarding, not a full mailbox.

## What forwarding can do

- People can send mail to `ivan@minier.us`
- Cloudflare delivers it to Gmail
- Replies from Gmail will show `ivanfminier@gmail.com` unless a real outbound mailbox is added later

## What forwarding cannot do

Cloudflare Email Routing does **not** create a normal outgoing inbox.

Do not assume you can send ordinary personal mail “from” `ivan@minier.us` until a mailbox provider is connected.

## Already done

- `minier.us` is already on Cloudflare DNS (`adaline.ns.cloudflare.com` / `simon.ns.cloudflare.com`).
- Destination address `ivanfminier@gmail.com` was created in this Cloudflare account.
- A verification email has been sent. Status is **pending** until Gmail confirms it.

## Remaining dashboard steps

Current public MX records still point at Namecheap forwarding (`eforward*.registrar-servers.com`). Email Routing cannot turn on until those are replaced.

1. Open Gmail for **ivanfminier@gmail.com**.
2. Find the Cloudflare Email Routing verification message and click **Verify**.
3. Open [Cloudflare Dashboard](https://dash.cloudflare.com) → **Email** → **Email Routing** → **minier.us**.
4. Click **Enable Email Routing** / **Add records and enable**.
5. When Cloudflare shows the MX change, confirm it. This replaces the Namecheap `eforward` MX records with:
   - `route1.mx.cloudflare.net`
   - `route2.mx.cloudflare.net`
   - `route3.mx.cloudflare.net`
6. Add a custom address:
   - Custom address: `ivan`
   - Destination: `ivanfminier@gmail.com`
7. Send a test message to `ivan@minier.us` and confirm it arrives in Gmail.

Do not change nameservers at Namecheap. The domain is already on Cloudflare.

## Future full mailbox

A later option is a real provider (Fastmail, Google Workspace, iCloud Custom Email Domain, and similar) so you can send and receive as `ivan@minier.us`.

That change requires replacing Cloudflare MX records. Do not do it accidentally.

## Also listed on the site

These already exist and are only displayed, not routed by this domain:

- `ivan.minier@uvm.edu`
- `ivanfminier@gmail.com`
