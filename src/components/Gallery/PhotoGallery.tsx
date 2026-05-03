import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { photoList, type PhotoMemory } from "../../content/photoList";
import { Button } from "../UI/Button";
import { SafeImage } from "../UI/SafeImage";

type PhotoGalleryProps = {
  onDone: () => void;
};

const placeholderPhotos: PhotoMemory[] = Array.from({ length: 30 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    src: `/assets/coupleimage/photo-${number}.jpg`,
    date: `장면 ${index + 1}`,
    title: `우리의 ${index + 1}번째 장면`,
    body: "사진을 누르면 테이블 위에 놓여요",
  };
});

const slotTilt = [-5, 3, -2, 5, -4, 2, -3, 4, -2, 3, -5, 2, -4, 4, -1, 3, -5, 2, -2, 5, -3, 1, -4, 4, -2, 3, -5, 2, -1, 4];

export function PhotoGallery({ onDone }: PhotoGalleryProps) {
  const photos = useMemo(() => (photoList.length > 0 ? photoList : placeholderPhotos), []);
  const [placedCount, setPlacedCount] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const total = photos.length;
  const allPlaced = placedCount >= total;
  const currentIndex = Math.min(placedCount, total - 1);
  const previewPhoto = photos[previewIndex];
  const nextPhoto = photos[currentIndex];
  const activePhoto = allPlaced ? previewPhoto : nextPhoto;

  const placeCurrentPhoto = () => {
    if (allPlaced) return;
    const nextCount = Math.min(total, placedCount + 1);
    setPlacedCount(nextCount);
    setPreviewIndex(Math.min(nextCount, total - 1));
  };

  const reopenPhoto = (index: number) => {
    if (index >= placedCount) return;
    setPreviewIndex(index);
  };

  const movePreview = (direction: -1 | 1) => {
    if (!allPlaced) return;
    setPreviewIndex((index) => Math.max(0, Math.min(total - 1, index + direction)));
  };

  const expandedPhoto = expandedIndex === null ? null : photos[expandedIndex];

  return (
    <div
      className="memory-table mx-auto grid w-full max-w-6xl gap-5 px-3 sm:gap-7"
      onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
        if (Math.abs(delta) > 52) movePreview(delta < 0 ? 1 : -1);
        setTouchStart(null);
      }}
    >
      <div className="memory-focus-area">
        <AnimatePresence mode="wait">
          <motion.button
            key={`${activePhoto.src}-${allPlaced ? previewIndex : placedCount}`}
            type="button"
            initial={{ opacity: 0, y: 24, rotate: -2, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, rotate: allPlaced ? slotTilt[previewIndex % slotTilt.length] * 0.3 : -1.5, scale: 1 }}
            exit={{ opacity: 0, y: 28, rotate: 4, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            onClick={allPlaced ? () => setExpandedIndex(previewIndex) : placeCurrentPhoto}
            className="memory-main-card group mx-auto text-left"
            aria-label={allPlaced ? `${activePhoto.title} 크게 보기` : `${activePhoto.title} 놓기`}
          >
            <SafeImage
              src={activePhoto.src}
              alt={activePhoto.title}
              fallbackLabel="여기에 둘만의 사진을 넣어주세요."
              className="memory-main-image w-full rounded-[16px] object-cover"
            />
            <div className="memory-main-caption">
              <p>{activePhoto.date}</p>
              <h3>{activePhoto.title}</h3>
              <span>{activePhoto.body}</span>
            </div>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="memory-placed-board" aria-label="놓인 추억 사진들">
        {photos.map((photo, index) => {
          const isPlaced = index < placedCount;
          const isActive = allPlaced && previewIndex === index;
          return (
            <motion.button
              key={photo.src}
              type="button"
              initial={false}
              animate={
                isPlaced
                  ? { opacity: 1, y: 0, scale: isActive ? 1.04 : 1, rotate: slotTilt[index % slotTilt.length] }
                  : { opacity: 0.42, y: 0, scale: 0.96, rotate: 0 }
              }
              whileHover={isPlaced ? { y: -8, scale: 1.04 } : undefined}
              whileTap={isPlaced ? { scale: 0.98 } : undefined}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              onClick={() => reopenPhoto(index)}
              disabled={!isPlaced}
              className={`memory-placed-card ${isPlaced ? "is-placed" : "is-empty"} ${isActive ? "is-active" : ""}`}
              aria-label={isPlaced ? `${photo.title} 다시 보기` : `비어 있는 사진 자리 ${index + 1}`}
            >
              {isPlaced ? (
                <>
                  <SafeImage src={photo.src} alt={photo.title} fallbackLabel="사진 자리" className="aspect-[4/5] w-full rounded-[9px] object-cover" />
                  <small>{photo.date}</small>
                  <span>{photo.title}</span>
                </>
              ) : (
                <span>장면 {index + 1}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="memory-controls grid gap-3 sm:mx-auto sm:w-full sm:max-w-2xl sm:grid-cols-3">
        <Button variant="soft" onClick={() => movePreview(-1)} disabled={!allPlaced || previewIndex === 0} className="memory-control-button">
          이전 장면
        </Button>
        <Button variant={allPlaced ? "primary" : "soft"} onClick={allPlaced ? onDone : placeCurrentPhoto} className={allPlaced ? "" : "memory-control-button"}>
          {allPlaced ? "마지막 축하 보기" : `이 장면 놓기 ${placedCount + 1}/${total}`}
        </Button>
        <Button variant="soft" onClick={() => movePreview(1)} disabled={!allPlaced || previewIndex === total - 1} className="memory-control-button">
          다음 장면
        </Button>
      </div>

      <AnimatePresence>
        {expandedPhoto && (
          <motion.div
            className="memory-lightbox fixed inset-0 z-50 grid place-items-center bg-[#09030f]/82 px-4 py-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedIndex(null)}
          >
            <motion.button
              type="button"
              className="absolute right-5 top-5 z-10 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl font-black text-inkWarm shadow-glow"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={(event) => {
                event.stopPropagation();
                setExpandedIndex(null);
              }}
              aria-label="크게 보기 닫기"
            >
              x
            </motion.button>
            <motion.article
              className="memory-expanded-card w-full max-w-[min(92vw,760px)] rounded-[30px] bg-[#fffaf1] p-4 text-center shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:p-6"
              initial={{ opacity: 0, scale: 0.62, rotate: -4, y: 40 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.72, rotate: 3, y: 30 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              onClick={(event) => event.stopPropagation()}
            >
              <SafeImage
                src={expandedPhoto.src}
                alt={expandedPhoto.title}
                fallbackLabel="사진 자리"
                className="max-h-[70dvh] w-full rounded-[20px] object-contain"
              />
              <div className="mt-5 grid gap-2">
                <p className="text-sm font-black text-[#a15a31]">{expandedPhoto.date}</p>
                <h3 className="text-2xl font-black leading-tight text-inkWarm sm:text-4xl">{expandedPhoto.title}</h3>
                <p className="text-base font-black leading-7 text-[#6e3a4f] sm:text-lg">{expandedPhoto.body}</p>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
