import { PhotoGallery } from "../components/Gallery/PhotoGallery";
import { FullScreenStage } from "../components/Layout/FullScreenStage";

type PhotoGallerySceneProps = {
  onNext: () => void;
};

export default function PhotoGalleryScene({ onNext }: PhotoGallerySceneProps) {
  return (
    <FullScreenStage>
      <section className="mx-auto grid min-h-[86dvh] w-full content-center gap-5 pt-8 text-center sm:gap-6 sm:pt-5">
        <div className="memory-title mx-auto px-4">
          <p>우리의 장면들</p>
          <h1>사진 속 마음 꺼내보기</h1>
        </div>
        <PhotoGallery onDone={onNext} />
      </section>
    </FullScreenStage>
  );
}
