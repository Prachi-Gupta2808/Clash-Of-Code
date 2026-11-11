"use client";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export const BackgroundRippleEffect = ({
  className,
  cellSize = 56,
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden",
        "[--cell-border-color:var(--color-neutral-700)]", 
        className
      )}
    >
      <DivGrid
        cellSize={cellSize}
        borderColor="var(--cell-border-color)"
        fillColor="transparent"
      />
    </div>
  );
};

const DivGrid = ({
  className,
  cellSize = 56,
  borderColor = "#3f3f46",
  fillColor = "transparent",
}) => {
  const cells = useMemo(() => Array.from({ length: 3000 }, (_, idx) => idx), []);

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, ${cellSize}px)`,
    gridAutoRows: `${cellSize}px`, // 🔥 Replaced gridTemplateRows to prevent height collapse
    width: "100%",
    height: "100%",
  };

  return (
    <div className={cn("relative h-full w-full", className)} style={gridStyle}>
      {cells.map((idx) => (
        <div
          key={idx}
          className="cell relative border-[0.5px] opacity-30"
          style={{
            backgroundColor: fillColor,
            borderColor: borderColor,
          }}
        />
      ))}
    </div>
  );
};