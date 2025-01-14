import { Container, Sprite, Application } from "pixi.js";

export function addBackground(app: Application): void {
  // Create a background sprite.
  const background = Sprite.from("background");

  // Center background sprite anchor.
  background.anchor.set(0.5);

  /**
   * If the preview is landscape, fill the width of the screen
   * and apply horizontal scale to the vertical scale for a uniform fit.
   */
  if (app.screen.width > app.screen.height) {
    background.width = app.screen.width * 1.2;
    background.scale.y = background.scale.x;
  } else {
    /**
     * If the preview is square or portrait, then fill the height of the screen instead
     * and apply the scaling to the horizontal scale accordingly.
     */
    background.height = app.screen.height * 1.2;
    background.scale.x = background.scale.y;
  }

  // Position the background sprite in the center of the stage.
  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;

  // Add the background to the stage.
  app.stage.addChild(background);
}

export function addFishes(app: Application, fishes: Sprite[]): void {
  const fishContainer = new Container();
  app.stage.addChild(fishContainer);

  const fishCount = 20;
  const fishAssets = ["fish1", "fish2", "fish3", "fish4", "fish5"];

  for (let i = 0; i < fishCount; i++) {
    try {
      const fishAsset = fishAssets[i % fishAssets.length];
      const fish = Sprite.from(fishAsset);

      if (!fish || !fish.position) {
        console.warn(`물고기 스프라이트 생성 실패: ${fishAsset}`);
        continue;
      }

      fish.anchor.set(0.5);

      // 커스텀 프로퍼티를 타입 안전하게 추가
      const fishData = fish as Sprite & {
        direction: number;
        speed: number;
        turnSpeed: number;
      };

      fishData.direction = Math.random() * Math.PI * 2;
      fishData.speed = 2 + Math.random() * 2;
      fishData.turnSpeed = Math.random() - 0.8;

      fish.x = Math.random() * app.screen.width;
      fish.y = Math.random() * app.screen.height;
      fish.scale.set(0.5 + Math.random() * 0.2);

      fishContainer.addChild(fish);
      fishes.push(fish);
    } catch (error) {
      console.error("물고기 생성 중 오류:", error);
    }
  }
}

export function animateFishes(app: Application, fishes: Sprite[]): void {
  // Define the padding around the stage where fishes are considered out of sight.
  const stagePadding = 100;
  const boundWidth = app.screen.width + stagePadding * 2;
  const boundHeight = app.screen.height + stagePadding * 2;

  // 유효한 물고기만 필터링
  const validFishes = fishes.filter(fish => fish && fish.position);

  // fishes 배열 업데이트
  fishes.length = 0;
  fishes.push(...validFishes);

  // 유효한 물고기만 애니메이션 처리
  validFishes.forEach(fish => {
    const fishData = fish as any;

    // Animate the fish movement direction according to the turn speed.
    fishData.direction += fishData.turnSpeed * 0.01;

    // Animate the fish position according to the direction and speed.
    fish.x += Math.sin(fishData.direction) * fishData.speed;
    fish.y += Math.cos(fishData.direction) * fishData.speed;

    // Apply the fish rotation according to the direction.
    fish.rotation = -fishData.direction - Math.PI / 2;

    // Wrap the fish position when it goes out of bounds.
    if (fish.x < -stagePadding) {
      fish.x += boundWidth;
    }
    if (fish.x > app.screen.width + stagePadding) {
      fish.x -= boundWidth;
    }
    if (fish.y < -stagePadding) {
      fish.y += boundHeight;
    }
    if (fish.y > app.screen.height + stagePadding) {
      fish.y -= boundHeight;
    }
  });
}
