# vWeaver — interactive project demonstrations

## Goal
Wrap static project pages in a Loom-style presentation experience: a presenter video in the lower-left corner, with timed clicks, highlights, and camera actions replayed on the live project. Keep the existing static hosting and previz no-outward-links convention. Source project: `/previz/crane-mounted-flag-xxl/`; experimental clone: `/previz/crane-flag-demo/`. Work branch: `feat/weavershell`.

## Part 1 — Presentation shell (complete)
Implemented: independent project clone; bottom-left 16:9 placeholder with a large PLAY DEMO button; keyboard-accessible dialog; device-local video selection and native video playback; responsive card; existing 3D controls preserved. The placeholder opens an honest empty state until a video is supplied. Local video selection does not upload or publish anything. Verify desktop/mobile layout, dialog focus, video errors, and the existing viewer. Do not merge to main as part of this initial experimental phase.

## Part 2 — Record the interaction timeline (complete)
Add a separate authoring mode with explicit start/stop and a session clock. Record stable semantic actions (view ID, measurement ID, units, visibility, wind state) rather than CSS selectors or arbitrary executable code. Capture orbit camera position, target and zoom at a throttled rate, plus normalized pointer positions and click targets. Give each recording an initial scene snapshot, project/version ID, schema version and duration. Export JSON locally. Provide a visible synchronization countdown and adjustable video/timeline offset for a separately recorded raw webcam take. No timing can be recovered reliably from webcam footage alone.

Acceptance: capture a short tour; reload; validate the export; replay its actions accurately on desktop and mobile. Click indicators track target elements or projected 3D anchors, not fixed desktop pixels. Handle absent targets without crashing. Record explicit state values so replay never relies on toggling unknown state.

## Part 3 — Synchronized interactive playback
Use video.currentTime as the playback clock. Play/pause, seek, restart, playback speed and buffering must preserve synchronization. Restore the initial state and apply actions through the seek point; interpolate camera keyframes. Show a presenter cursor and click rings without generating real user clicks or navigation. Pause the tour when the viewer takes control; offer Resume tour to restore timeline state. Honor reduced motion and support captions, keyboard use and useful error messages.

Acceptance: seeking backward and forward produces the same state as linear playback; buffering causes no drift; portrait layouts retain useful click placement; user exploration can resume the tour predictably.

## Part 4 — Webcam authoring and static publishing
Add opt-in camera/microphone capture with preview, explicit Record/Stop controls, permission-denied handling and track cleanup. Request 1920×1080 where supported and report the actual captured resolution; allow imported raw 1080p takes as the primary workflow. Browser capture format varies, so inspect support rather than assume MP4 output. Export video and timeline separately; retain the raw source outside the published bundle.

Prepare a browser-compatible delivery MP4 (H.264/AAC when appropriate), poster, optional WebVTT captions, demo.json and interactions.json. The public manifest points only to static project assets. Use preload=metadata and user-initiated playback. Production publishing remains a repository commit/deploy operation; selecting a local file never writes to the hosted site. Check asset size and host limits once actual footage is available. Keep attribution in source documentation and no outward viewer navigation.

Acceptance: a clean checkout served as static files plays the published tour with no authoring tools, backend or local file dependencies; video seeking works on the target host; no recording permissions are requested during playback.

## Proposed data boundary
demo.json: schema version, project ID/revision, video URL, poster URL, captions URL, timeline URL and sync offset. interactions.json: initial state and time-ordered allowlisted actions; camera keyframes and cursor events are separate tracks. Viewer adapter: getState(), setState(), applyAction(), ready signal and action subscription. The shell owns media and timeline playback; each project owns its scene implementation.

## Next checkpoint
Part 3 is next: video-clock playback, seeking and cursor replay. The viewer adapter and capture/export path are implemented. Keep each stage independently usable and committed. Update this roadmap with completed checks and unresolved decisions at each checkpoint. Actual webcam footage is needed for final content and synchronization QA, not for building the recorder and player.

## vWeaver authoring checkpoint

Audience route: `/previz/crane-flag-demo/`. Author route: `/previz/crane-flag-demo/?author=1`. Both remain static pages with no outward navigation. Author mode requests no camera or microphone permissions in Part 2.

1. Start an external webcam take, then click **Record interactions** and use the three-second countdown as the alignment cue.
2. Interact with the project. Orange rings make recorded clicks visible. Camera sampling is capped at 10 Hz and pointer movement at 20 Hz; semantic actions and clicks are retained individually.
3. Click **Stop**, set **Video time at track start (s)** if needed, then **Export track**. Preserve `weavershell-interactions.json` alongside the original video. The offset means `video.currentTime - syncOffset = track time` for Part 3.
4. Unsaved tracks trigger a browser leave-page prompt; switching to a hidden tab stops the track. A new take requires exporting or explicitly discarding an unsaved track. Tracks stay in memory until exported; there is no durable automatic save or upload.

Initial state and exported tracks are validated against a versioned project ID. The adapter restores explicit values and does not simulate DOM clicks. This avoids accidentally toggling the wrong state during future seeking. Capture does not yet synchronize or replay with video; local presenter playback and interaction recording are independent at this checkpoint.

Validation: Edge/WebGL loaded the clone; generated test video played from a local blob; a five-action tour exported semantic actions, camera keyframes, pointer clicks and sync offset; initial-state restoration and repeated selection were verified. Pure timeline checks cover timestamp ordering, camera throttling, state-copy isolation and invalid-action rejection. Audience mode hides author tools. Mobile author tools sit above the scene to keep the project usable.
