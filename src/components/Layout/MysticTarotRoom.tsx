import { useState } from "react";

export function MysticTarotRoom() {
  const [photoReady, setPhotoReady] = useState(true);
  const charms = ["☾", "✦", "♥", "✧", "☼", "✦", "☽"];
  const wallIcons = ["✦", "☾", "♡", "✧", "✦", "☽", "♡", "✧", "✦", "☾", "♡", "✧"];
  const tableCandles = [
    { className: "mini-candle tall", left: "18%", delay: "0s" },
    { className: "mini-candle", left: "22%", delay: "0.24s" },
    { className: "mini-candle small", left: "27%", delay: "0.52s" },
    { className: "mini-candle small", left: "72%", delay: "0.14s" },
    { className: "mini-candle", left: "77%", delay: "0.42s" },
    { className: "mini-candle tall", left: "82%", delay: "0.68s" },
  ];
  const smokeWisps = ["18%", "23%", "78%", "83%"];

  return (
    <div className={`mystic-room ${photoReady ? "photo-ready" : ""}`} aria-hidden="true">
      <img
        className="mystic-bg-image"
        src="/assets/background/tarot-room.png"
        alt=""
        onLoad={() => setPhotoReady(true)}
        onError={() => setPhotoReady(false)}
        draggable={false}
      />
      <div className="mystic-bg-photo" />
      <div className="room-vignette" />
      <div className="ambient-light ambient-light-left" />
      <div className="ambient-light ambient-light-right" />
      <div className="light-beam light-beam-left" />
      <div className="light-beam light-beam-center" />
      <div className="light-beam light-beam-right" />
      <div className="room-ceiling" />
      <div className="ceiling-orb">
        <span className="ceiling-chain" />
        <span className="orb-glass" />
        <span className="orb-flare" />
      </div>
      <div className="room-back-wall">
        <div className="arch-window">
          <span className="moon" />
          <span className="mountain mountain-a" />
          <span className="mountain mountain-b" />
          <span className="castle" />
          <span className="window-cross vertical" />
          <span className="window-cross horizontal" />
        </div>
        <div className="wall-pattern">
          {wallIcons.map((icon, index) => (
            <span key={index} style={{ left: `${8 + (index % 6) * 17}%`, top: `${18 + Math.floor(index / 6) * 42}%` }}>
              {icon}
            </span>
          ))}
        </div>
        <div className="neon-halo" />
        <div className="mystic-neon-sign">
          <strong>TAROT READING</strong>
          <span>강아지 타로 상담소</span>
        </div>
        <div className="hanging-charms">
          {charms.map((char, index) => (
            <span key={`${char}-${index}`} style={{ left: `${18 + index * 10}%`, animationDelay: `${index * 0.22}s` }}>
              {char}
            </span>
          ))}
        </div>
      </div>
      <div className="room-left-wall">
        <div className="wall-sconce sconce-left-a"><i /></div>
        <div className="wall-sconce sconce-left-b"><i /></div>
        <div className="deep-bookshelf left-bookshelf">
          {Array.from({ length: 16 }).map((_, index) => <span key={index} />)}
        </div>
        <div className="shelf shelf-a" />
        <div className="shelf shelf-b" />
      </div>
      <div className="room-right-wall">
        <div className="wall-sconce sconce-right-a"><i /></div>
        <div className="wall-sconce sconce-right-b"><i /></div>
        <div className="tapestry"><span /></div>
        <div className="deep-bookshelf right-bookshelf">
          {Array.from({ length: 18 }).map((_, index) => <span key={index} />)}
        </div>
        <div className="tarot-poster-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
      <div className="lamp lamp-left" />
      <div className="lamp lamp-right" />
      <div className="mystic-table">
        <span className="table-glow" />
        <span className="velvet-cloth" />
        <span className="ornate-book" />
        <span className="glass-orb" />
        <span className="potion potion-left" />
        <span className="potion potion-right" />
        <span className="crystal crystal-left" />
        <span className="crystal crystal-right" />
        <span className="candle candle-left" />
        <span className="candle candle-right" />
        <div className="candle-cluster">
          {tableCandles.map((candle) => (
            <span key={`${candle.left}-${candle.delay}`} className={candle.className} style={{ left: candle.left, animationDelay: candle.delay }} />
          ))}
        </div>
        {smokeWisps.map((left, index) => (
          <span key={left} className="smoke-wisp" style={{ left, animationDelay: `${index * 0.55}s` }} />
        ))}
      </div>
    </div>
  );
}
