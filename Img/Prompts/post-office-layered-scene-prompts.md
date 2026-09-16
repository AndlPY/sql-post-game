# Layered postal office scene

Tool: built-in ImageGen. Reference for all three calls: room v2 before removing its counter, preserved in ../../Archive/Img/Backgrounds/post-office-gameplay-room-v2-with-counter.png.

## Room update: ../Assets/Environment/post-office-gameplay-room-v2.png

Precise local edit of this game background. Remove ONLY the entire central wooden service counter AND everything resting on it (both monitors, little plant, stamp, mouse, papers, pen holder). Replace their complete silhouette and cast shadow with seamless continuation of the existing beige tiled floor, matching the floor grid and lighting. Preserve everything else exactly: identical image dimensions, crop, camera, shelving, all parcels, blank shelf plaques, wall signs and lettering, hanging lamps, edge carts, surrounding plants, foreground shelving. No new objects, no characters, no UI. The center should now be clear continuous tiled floor so a separately rendered counter sprite can be overlaid by the game engine. Do not redesign or shift any retained object.

## Clerk: ../Assets/Props/post-office-clerk-workstation.png

Create one isolated grouped desktop equipment sprite for the postal CLERK workstation, matching the equipment in the reference game image. Show the BACK of a dark navy monitor on a short pedestal, because the worker stands behind the counter facing toward the viewer and looks at the screen facing away from the viewer. Include a small mouse to its right and a compact stamp on an ink pad farther right. Arrange as a coherent small cluster ready to place on a separately rendered wooden countertop. No counter, no table, no floor, no room, no person, no plant. Actual transparent alpha background with no backdrop or colored halo. Entire cluster visible with generous transparent padding. Same elevated frontal game camera, crisp detailed warm pixel art, navy metal with warm highlights. No readable text, no UI. Keep proportions matching the original small monitors. Output a single workstation asset, not a catalog sheet.

## Instructor: ../Assets/Props/post-office-instructor-workstation.png

Create one isolated grouped desktop equipment sprite for the postal INSTRUCTOR workstation. Match the reference game's right workstation: a dark navy monitor seen from its BACK on a short pedestal, a small cream paper stack to its left, and a dark pencil cup with three blue/gold pens to its right. Worker stands behind counter facing viewer, so monitor screen faces away from viewer. Entire coherent small cluster ready to overlay on a separately rendered countertop; all object bases aligned to same implied countertop plane. Same elevated frontal game camera, crisp detailed warm pixel art, dark outlines, navy metal and warm highlights. Genuine transparent alpha background without backdrop, halos or floor. No counter, table, room, people, text or UI. Entire cluster visible with generous padding. Single workstation asset.
