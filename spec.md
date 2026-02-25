# Specification

## Summary
**Goal:** Build "Parkour Rush," a 3D parkour game website with a full obstacle course, player controls, run timer, local leaderboard, and a neon urban visual theme.

**Planned changes:**
- Create a main menu screen with Start Game, Leaderboard, and Controls buttons, and an auto-panning 3D preview of the course as the background
- Build a 3D obstacle course using React Three Fiber with 15+ platforms of varying sizes/heights, ramps, gaps, moving barriers, narrow ledges, a start zone, and a finish zone, set against a neon city skybox
- Implement player movement: WASD/arrow keys to move, spacebar for single and double jump, mouse-look camera in third-person view, collision detection, and checkpoint/fall reset
- Add a HUD run timer in MM:SS.ms format that starts at the start zone trigger and stops at the finish zone trigger, with a restart button
- Implement a local leaderboard (localStorage) storing the top 10 fastest times with player names (up to 12 characters), accessible from the main menu and post-run screen
- Apply a dark + neon (electric orange, lime green, hot pink) urban/graffiti theme across all UI and 3D elements: glowing platform edges, particle effects on jumps and landings, bold angular typography

**User-visible outcome:** Players can launch Parkour Rush, navigate the main menu, run a 3D parkour obstacle course with a live timer, compete for top times saved to a local leaderboard, and experience a high-energy neon urban visual style throughout.
