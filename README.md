CS 335 Final Project: RayPainter
Overview

This project implements an interactive 3D texture painting system in the browser using Three.js and WebGL. Users can paint directly onto 3D objects in real time using multiple brush types and adjustable settings.

The application supports:
Real-time painting via raycasting and UV mapping
Multiple brush types (soft, hard, spray, smudge)
Adjustable brush size, color, and opacity
Multiple 3D shapes (cube, sphere, cylinder, cone, torus)
Texture presets and custom texture upload
Undo/redo functionality
Exporting textures as images and scenes as .glb files

For full implementation details, see the project report.

Setup Instructions
npm install
npm run dev

Then open:

http://localhost:5173

Tested using Node.js and Vite development server.

Running the Application
The application runs in the browser after starting the dev server.

Basic Usage
Select a shape from the dropdown
Choose a brush/tool type
Adjust brush settings (size, color, opacity)
Click and drag on the object to paint
Rotate the object using arrow keys
Controls
Ctrl + Z → Undo
Ctrl + Shift + Z → Redo
Ctrl + S → Save texture
Additional Features
Clear canvas button
Texture preset buttons
Custom texture upload
Export scene as .glb

Notes for Grading
The project runs entirely in the browser using WebGL
No additional setup beyond npm install is required
All features are accessible through the UI panel

For visual results, demonstrations, and detailed explanations of implementation (including painting, interpolation, and history system), please refer to the project report.
