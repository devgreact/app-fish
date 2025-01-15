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
          src: "/assets/pond_background.jpg",
        },
        {
          alias: "fish1",
          src: "/assets/fish1.png",
        },
        {
          alias: "fish2",
          src: "/assets/fish2.png",
        },
        {
          alias: "fish3",
          src: "/assets/fish3.png",
        },
        {
          alias: "fish4",
          src: "/assets/fish4.png",
        },
        {
          alias: "fish5",
          src: "/assets/fish5.png",
        },
        {
          alias: "fish6",
          src: "/assets/fish6.png",
        },
        {
          alias: "fish7",
          src: "/assets/fish7.png",
        },
        {
          alias: "fish8",
          src: "/assets/fish8.png",
        },
        {
          alias: "overlay",
          src: "/assets/wave_overlay.png",
        },
        {
          alias: "displacement",
          src: "/assets/displacement_map.png",
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
          animateFishes(app, fishesArray);
        }
        if (waterOverlay.current) {
          animateWaterOverlay(waterOverlay.current, delta);
        }
      });

      // 모든 컨텐츠가 로드된 후
      window.onload = () => {
        // Type assertion 사용
        (window as any).ReactNativeWebView?.postMessage("loaded");
      };
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

  const [message, setMessage] = useState("");
  useEffect(() => {
    // React Native로부터 메시지 수신
    window.addEventListener("message", event => {
      try {
        const data = JSON.parse(event.data);
        setMessage(`Received from RN: ${data.payload.message}`);

        // 데이터 타입에 따른 처리
        if (data.type === "INIT_DATA") {
          // 초기 데이터 처리
          setMessage(`${data.payload.message}`);
        }
      } catch (error) {
        setMessage(`메시지 파싱 에러:, ${error}`);
      }
    });

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      window.removeEventListener("message", () => {});
    };
  }, []);

  return (
    <>
      <div>메세지 : {message}</div>
      <div ref={pixiContainer} style={{ width: "100%", height: "100vh" }}></div>
    </>
  );
};

export default PixiApp;
