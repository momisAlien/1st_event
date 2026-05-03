import type { GestureName, Landmark } from "../../lib/gestureUtils";

type GestureDebugPanelProps = {
  gesture: GestureName;
  landmarks: Landmark[];
};

export function GestureDebugPanel({ gesture, landmarks }: GestureDebugPanelProps) {
  return (
    <aside className="fixed bottom-3 left-3 z-50 rounded-2xl bg-inkWarm/80 p-3 text-xs font-bold text-white shadow-soft">
      <p>gesture: {gesture}</p>
      <p>landmarks: {landmarks.length}</p>
    </aside>
  );
}
