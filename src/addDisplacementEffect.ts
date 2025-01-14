import { Application, DisplacementFilter, Sprite, WRAP_MODES } from "pixi.js";
export function addDisplacementEffect(app: Application): void {
  // Create a sprite from the preloaded displacement asset.
  const sprite = Sprite.from("displacement");

  // Set the base texture wrap mode to repeat to allow the texture UVs to be tiled and repeated.
  sprite.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;

  // Create a displacement filter using the sprite texture.
  const filter = new DisplacementFilter(sprite);
  filter.scale.set(50, 50);

  // Add the sprite to the stage for visibility (optional).
  sprite.position.set(app.screen.width / 2, app.screen.height / 2);
  sprite.anchor.set(0.5);
  app.stage.addChild(sprite);

  // Add the displacement filter to the stage.
  app.stage.filters = [filter];
}
