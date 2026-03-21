import { arrayMove } from "@dnd-kit/sortable";

export function handleRankingDragEnd(
  event: any,
  disabled: boolean,
  setRankedValues: React.Dispatch<React.SetStateAction<string[]>>
) {
  if (disabled) return;

  const { active, over } = event;
  if (!over || active.id === over.id) return;

  setRankedValues((prev) => {
    const oldIndex = prev.indexOf(active.id);
    const newIndex = prev.indexOf(over.id);
    return arrayMove(prev, oldIndex, newIndex);
  });
}

export function reorderItems(
  list: string[],
  id: string,
  direction: "up" | "down"
): string[] {
  const currentIndex = list.indexOf(id);
  const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (newIndex < 0 || newIndex >= list.length) return list;

  return arrayMove(list, currentIndex, newIndex);
}
