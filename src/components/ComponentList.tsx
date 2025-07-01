import React from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ComponentCard from "./ComponentCard";
import { ComponentItem } from "../types";

export interface ComponentListProps {
  components: ComponentItem[];
  /**
   * Estimated row height in pixels. Adjust to match your card height.
   * If each row is exactly the same height this is perfect. If not,
   * switch to `VariableSizeList` and measure at runtime.
   */
  itemHeight?: number;
  overscanCount?: number;
}

/**
 * Individual row renderer. It receives the `style` prop from react-window
 * which MUST be attached to the root element for correct positioning.
 */
const Row = React.memo(
  ({ index, style, data }: ListChildComponentProps<ComponentItem[]>) => {
    const item = data[index];

    return (
      <div style={style} key={item.id}>
        <ComponentCard component={item} />
      </div>
    );
  }
);
Row.displayName = "ComponentListRow";

/**
 * Virtualised list of components.
 */
export default function ComponentList({
  components,
  itemHeight = 80,
  overscanCount = 4,
}: ComponentListProps) {
  return (
    <AutoSizer disableWidth>
      {({ height }) => (
        <List
          height={height}
          width="100%"
          itemCount={components.length}
          itemSize={itemHeight}
          overscanCount={overscanCount}
          itemData={components}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
}