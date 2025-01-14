import { Application, Texture, TilingSprite } from "pixi.js";

// Adds a water overlay to the PixiJS application.
export function addWaterOverlay(app: Application): TilingSprite {
  // Create a water texture object.
  const texture = Texture.from("overlay");

  // Create a tiling sprite with the water texture and specify the dimensions.
  const overlay = new TilingSprite(
    texture,
    app.screen.width,
    app.screen.height,
  );

  // Add the overlay to the stage.
  app.stage.addChild(overlay);

  return overlay;
}

// Animates the water overlay.
export function animateWaterOverlay(
  overlay: TilingSprite,
  delta: number,
): void {
  // Animate the overlay.
  overlay.tilePosition.x -= delta;
  overlay.tilePosition.y -= delta;
}
