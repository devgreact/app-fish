import { Application, Assets, Sprite, TilingSprite } from "pixi.js";
import React, { useEffect, useRef, useState } from "react";
import { addDisplacementEffect } from "./addDisplacementEffect";
import { addBackground, addFishes, animateFishes } from "./addFishes";
import { addWaterOverlay, animateWaterOverlay } from "./addWaterOverlay";

const PixiApp: React.FC = () => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const [fishes, setFishes] = useState<Sprite[]>([]);
  const waterOverlay = useRef<TilingSprite | null>(null);

  useEffect(() => {
    const setup = async () => {
      // Create a PixiJS application.
      const app = new Application({
        background: "#1099bb",
        resizeTo: window,
      });

      appRef.current = app;

      // Append the canvas to the container div.
      // if (pixiContainer.current) {
      //   pixiContainer.current.appendChild(app.view);
      // }

      // if (pixiContainer.current) {
      //   pixiContainer.current.appendChild(app.view as unknown as Node);
      // }

      if (pixiContainer.current && app.view instanceof HTMLCanvasElement) {
        pixiContainer.current.appendChild(app.view);
      }

      // Preload assets.
      const assets = [
        {
          alias: "background",
          src: "https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg",
        },
        {
          alias: "fish1",
          src: "https://pixijs.com/assets/tutorials/fish-pond/fish1.png",
        },
        {
          alias: "fish2",
          src: "https://pixijs.com/assets/tutorials/fish-pond/fish2.png",
        },
        {
          alias: "fish3",
          src: "https://pixijs.com/assets/tutorials/fish-pond/fish3.png",
        },
        {
          alias: "fish4",
          src: "https://pixijs.com/assets/tutorials/fish-pond/fish4.png",
        },
        {
          alias: "fish5",
          src: "https://pixijs.com/assets/tutorials/fish-pond/fish5.png",
        },
        {
          alias: "overlay",
          src: "https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png",
        },
        {
          alias: "displacement",
          src: "https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png",
        },
      ];

      await Assets.load(assets);

      // Add background after assets are loaded.
      addBackground(app);

      // fishes 배열 초기화
      const fishesArray: Sprite[] = [];
      addFishes(app, fishesArray);
      setFishes(fishesArray);

      // Add water overlay.
      const overlay = addWaterOverlay(app);
      waterOverlay.current = overlay;

      // Add displacement effect.
      addDisplacementEffect(app);

      // Add the animation callbacks to the application's ticker.
      app.ticker.add(delta => {
        if (fishesArray.length > 0) {
          // 물고기가 있을 때만 애니메이션 실행
          animateFishes(app, fishesArray, { deltaTime: delta });
        }
        if (waterOverlay.current) {
          animateWaterOverlay(waterOverlay.current, delta);
        }
      });
    };

    setup();

    return () => {
      if (appRef.current) {
        // 정리 작업에서 물고기 제거
        fishes.forEach(fish => {
          if (fish && fish.parent) {
            fish.parent.removeChild(fish);
          }
        });
        setFishes([]);
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={pixiContainer} style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default PixiApp;
