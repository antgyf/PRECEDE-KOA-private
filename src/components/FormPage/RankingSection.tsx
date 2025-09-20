import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Questions } from "../../models/patient/patientDetails";
import { handleRankingDragEnd, reorderItems } from "../../utils/handleRanking";

interface RankingSectionProps {
  rankingOptions: string[]; // Array of variable names (e.g., ["PainWalking", "PainStairClimbing"])
  values?: string[]; // Initial values, also variable names
  disabled: boolean;
  onSubmit: (rankedValues: string[]) => void;
}

const RankingSection: React.FC<RankingSectionProps> = ({
  rankingOptions,
  values,
  disabled,
}) => {
  // Function to get the display question for a given variable name
  const getQuestionText = (variableName: string) => {
    return (
      Questions.find((q) => q.name === variableName)?.question || variableName
    );
  };

  // Maintain ranking order as variable names, but display corresponding questions
  const [rankedValues, setRankedValues] = useState<string[]>(
    values || rankingOptions
  );

  // Preserve ranking when navigating between pages
  useEffect(() => {
    if (!values || JSON.stringify(values) === JSON.stringify(rankedValues))
      return;
    setRankedValues(values);
  }, [values]);

  // Conditionally apply sensors only when dragging is enabled
  const sensors = useSensors(
    ...(disabled
      ? [] // If disabled, don't add drag sensors
      : [
          useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
          useSensor(KeyboardSensor),
        ])
  );

  const handleDragEnd = (event: any) => {
    handleRankingDragEnd(event, disabled, setRankedValues);
  };

  return (
    <div className="bg-secondary rounded-md p-4">
      <h4 className="font-bold mb-2">
        Rank the top 5 areas in order of priority:
      </h4>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={rankedValues}
          strategy={verticalListSortingStrategy}
        >
          {rankedValues.map((variableName) => (
            <SortableItem
              key={variableName}
              id={variableName}
              displayText={getQuestionText(variableName)}
              disabled={disabled}
              moveItem={setRankedValues}
              rankedValues={rankedValues}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

interface SortableItemProps {
  id: string; // The variable name (e.g., "PainWalking")
  displayText: string; // The corresponding question (e.g., "Your pain when walking?")
  disabled: boolean;
  moveItem: React.Dispatch<React.SetStateAction<string[]>>;
  rankedValues: string[];
}

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  displayText,
  disabled,
  moveItem,
  rankedValues,
}) => {
  const index = rankedValues.indexOf(id);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled }); // Disable drag behavior when disabled

  const style = {
    transform: disabled ? "none" : CSS.Transform.toString(transform),
    transition: disabled ? "none" : transition,
    touchAction: "none", // Prevent unintended scroll/drag on touch devices
    opacity: disabled ? 0.5 : 1, // Reduce opacity if disabled
    cursor: disabled ? "not-allowed" : "grab", // Change cursor when disabled
  };

  const handleMove = (direction: "up" | "down") => {
    moveItem((prev) => reorderItems(prev, id, direction));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(disabled ? {} : attributes)}
      {...(disabled ? {} : listeners)}
      className="flex items-center bg-gray-100 p-2 rounded shadow mb-2 select-none"
    >
      <span className="w-6 font-bold">{index + 1}.</span>
      <span className="flex-grow">{displayText}</span>{" "}
      {/* Show question instead of variable name */}
      {!disabled && (
        <div className="space-x-1">
          <button
            className="px-2 py-1 bg-accent text-white rounded disabled:opacity-50"
            disabled={index === 0}
            onClick={() => handleMove("up")}
          >
            ▲
          </button>
          <button
            className="px-2 py-1 bg-accent text-white rounded disabled:opacity-50"
            disabled={index === rankedValues.length - 1}
            onClick={() => handleMove("down")}
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
};

export default RankingSection;
