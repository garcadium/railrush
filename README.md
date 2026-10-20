# Railrush

An original three-lane 3D endless runner for Garcadium. Built with a locally bundled Three.js renderer, a fixed-step simulation, and DOM menus. No install or external asset CDN is required to play.

## Run

Run `npm start` in this directory, then open http://localhost:4196. Requires Node.js. `PORT` overrides the default port.

## Play

- Left/right arrows or A/D: switch lanes.
- Up, W, or Space: jump over orange barriers.
- Down or S: slide under overhead gates.
- P or Escape: pause/resume. Hiding the tab pauses automatically.
- On phones: swipe or use the four touch buttons.
- Dodge teal trains. Gold coins unlock runners in Meet the runners: Sunny (50), Luna (100), Beats (150), Scout (225), and Nova (350). Kai is free. Prior Mint/Coral/Lilac ownership maps to Kai/Sunny/Luna without losing coins or runs.
- Blue pickups protect against one crash for up to 20 seconds; purple pickups attract coins for 12 seconds.

Distance increases speed. Every generated obstacle wave leaves a lane open. Coins and best distance are banked when a run ends, including when replacing a saved run. Active runs save once a second and on pause/page exit, including the random generator state, obstacles, pickups, and current movement. Reload resumes from the menu instead of unexpectedly starting the runner.

## Verification

`npm test` checks collisions, movement, pickups, generation, and deterministic save restoration. `node tests/browser.mjs` uses the existing workspace Playwright installation and Microsoft Edge to check desktop/mobile controls, pause, reload, and screenshots. Startup CSS was checked with the Garcadium startup validator.

## Release status

This is a local playable build, not a published Garcadium release. Browser saves work. The existing Garcadium save client is included with Railrush's save slot and restores account data before enabling play; account handoff and cross-device operation are not yet registered or verified against the live portal. Local previews do not display an unavailable account-connect link.

Before any live publication, follow `../garcadium-portal/GAME-RELEASE-STANDARD.md`: register the railrush catalogue entry, canonical origin and bounded backend save schema; verify account eligibility, conflict recovery, offline/retry, account switching, expiry and revoked consent; prepare faithful thumbnail/banner artwork; complete independent GitHub/Render hosting and portal/Arena release verification. Do not deploy this local build as a shortcut around those gates.

## Files

- `src/simulation.mjs`: serializable simulation and validated progress format.
- `src/render.js`: city, trains, runner, camera, animation, and graphics lifecycle.
- `src/game.js`: input, UI, audio, progress, and frame scheduling.
- `src/save-client.js`: inherited Garcadium account and revision-aware save transport.

Three.js is MIT licensed; its embedded copyright and license notice are retained in `vendor/three.module.js`. Game scenery and character are original procedural geometry.


## Hoverboards and character abilities

The Hoverboards menu sells permanent reusable boards: Glider (75 coins, 15 seconds), Sunburst (175 coins, 20 seconds), and Starlight (300 coins, 25 seconds). Equip an owned board, then press B or tap the board button during a run. An active board absorbs one crash before a 20-second recharge; natural expiry also starts the recharge. Boards never consume more coins after purchase. Timers and ownership survive saved-run restoration.

Use Change Character from the home or pause menu. Kai changes lanes faster; Sunny earns a bonus coin every fifth pickup; Luna jumps higher; Beats gets 18-second magnets; Scout has longer slides; Nova starts each fresh run with an 8-second shield. Switching to Nova during an existing run does not grant a new shield. Changing characters from home also updates a saved run's chosen character.

`node tests/boards-browser.mjs` checks purchase, equip, activation, character changes during a paused run, reload, and phone layouts. `npm test` covers equipment, save migration, cooldowns, collision protection, and abilities.

## Music
An original 116 BPM synth-funk soundtrack is synthesized locally with Web Audio. Tap the top-right music/sound button to enable it; your existing mute preference is preserved. Music starts during a run, pauses with the game, and stops on mute, game over, or page exit. No streamed assets or external music services are used. Run node tests/music-browser.mjs to verify audio generation, pause/resume, mute persistence, and waveform headroom.


## Volume, menu music, and achievements

The Music slider beside the sound button changes soundtrack volume from 0–100% without altering sound effects or the main mute toggle. Volume is saved with progress. When sound is enabled, a softer chord-and-melody arrangement plays on the home, shop, pause, results, and achievement screens; the full beat returns during runs. Browsers require an initial click/key interaction before playing music. Backgrounding the page silences it.

Achievements is available from the home and pause menus. Ten milestones track completed runs, distance, single-run coins, owned characters, and hoverboards. Unlocks persist, show progress bars, and notify once. Existing best distance, completed runs and ownership count immediately; historic per-run coin totals were not previously recorded, so those milestones use current/future runs. Achievements award 15–75 bonus coins each, automatically and exactly once. A saved reward ledger prevents repeated payouts after reload. Previously unlocked achievements receive any missing rewards on the next load. Each achievement card shows its bonus.

Menu music now attempts playback as soon as saves finish loading when sound is enabled. If autoplay is blocked, sound is muted, or music volume is zero, the menu offers Play menu music; clicking enables audio and restores a zero volume to 60%. Existing nonzero volume settings are kept.


## Daily challenges and pursuit

Daily Challenges is available from home and pause menus. Three tasks rotate at midnight UTC−6: accumulate distance, collect track coins, and jump or slide. Each pays 30–60 coins once per day. Progress carries across runs and reloads; bonus coins do not count as track pickups. Moving the clock backward does not reset the saved day. This local build uses the device clock; online competitive reward validation remains a release requirement.

A rail marshal follows your lane changes, closes the gap after protected collisions, and catches up when you crash. The camera frames both runners. Pausing freezes the chase.

There are now 18 achievements. Eight new milestones cover 2,000 metres, 200 coins in one run, 25 runs, six characters, 100 jumps, 5,000 lifetime metres, 20 board activations, and three daily tasks. New lifetime counters start with this update; existing best-run and ownership milestones count retroactively.

## Train roofs and catch animation

Trains now have a solid 3.06-unit roof. Yellow striped nine-unit ramps lead onto initial and generated trains. Run up a ramp without jumping, time a higher jump to land on a train, jump again from the roof, or change lanes to drop down. Roof coin trails are collected at roof height. Saved runs retain elevation and support. Jump height has increased for both normal runners and Luna; Luna retains a higher jump.

An unprotected collision settles rewards once, then plays a 1.8-second catch scene: the runner stops and looks back while the marshal closes the gap and reaches forward. Controls are disabled during this scene; results appear afterward. Reloading during the scene cannot duplicate the finished run's payout.
