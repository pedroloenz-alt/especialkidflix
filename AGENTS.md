<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the catalog and educational module metadata in one browser-safe shared module; all catalog surfaces use the same source to avoid divergent resources.
- Keep locked upsell metadata separate from available educational modules in the shared catalog; an offer may carry its deliverable pointer and its Cakto buy link, but only the buy link renders on the locked card — the deliverable pointer must never be rendered, linked or downloadable from the card until purchase verification exists, so offers cannot enter PDF downloads, favorites or local completion flows.
- Personalization, favorites and explored modules are device-local, not authentication; never use family names as an authorization boundary or upload them to a public database.
- Serve original uploaded PDFs through Lovable Assets pointers and generated artwork through bundled imports; keep binary documents out of the repository.
- Keep distinct content views in TanStack file routes and shared navigation in the Kidflix shell; the public index is the actual library experience.
- Check kit purchases only from the app's own server session reading the purchase records; purchases and the unlock lookup stay closed to browser code, so a shopper's e-mail and payment status cannot be read or probed from the client.
