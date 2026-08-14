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

## Setup steps

These require the Cloudflare dashboard after `minier.us` is on Cloudflare DNS:

1. Cloudflare → **Email** → **Email Routing** → `minier.us`
2. Add destination address: `ivanfminier@gmail.com`
3. Confirm the verification email Cloudflare sends to Gmail
4. Add custom address: `ivan` → send to `ivanfminier@gmail.com`
5. Enable Email Routing if it is not already enabled
6. Leave MX records on Cloudflare. Do not point them at another mail host unless you are replacing forwarding on purpose.

## Future full mailbox

A later option is a real provider (Fastmail, Google Workspace, iCloud Custom Email Domain, and similar) so you can send and receive as `ivan@minier.us`.

That change requires replacing Cloudflare MX records. Do not do it accidentally.

## Also listed on the site

These already exist and are only displayed, not routed by this domain:

- `ivan.minier@uvm.edu`
- `ivanfminier@gmail.com`
