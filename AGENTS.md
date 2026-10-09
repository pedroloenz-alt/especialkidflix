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
- Personalization, favorites and explored modules are device-local, not authentication; never use family names as an authorization boundary or upload them to a public database.
- Serve original uploaded PDFs through Lovable Assets pointers and generated artwork through bundled imports; keep binary documents out of the repository.
- Keep distinct content views in TanStack file routes and shared navigation in the Kidflix shell; the public index is the actual library experience.
