# Per-project assets

One folder per project, named by the project's slug (the last part of its
`/work/<slug>` URL). Drop a project's real images in here and the detail page
picks them up automatically.

## Recognized files

| File                | Where it shows up                                   |
| ------------------- | --------------------------------------------------- |
| `camera.png`        | The "Camera Body" figure (Technical Breakdown).     |

If a file isn't present, the page falls back to its built-in placeholder
(e.g. the blueprint drawing for the camera).

## How to add one

- **Locally:** save the file into `public/work/<slug>/` and it appears on
  `localhost` immediately (e.g. `public/work/timmy-story/camera.png`).
- **On GitHub:** open the repo → `Add file` → `Create new file`, type
  `public/work/<slug>/camera.png` as the path (GitHub creates the folder),
  and commit.

More slots (BTS stills, poster, platform logos, doc covers) can be wired the
same way on request.
