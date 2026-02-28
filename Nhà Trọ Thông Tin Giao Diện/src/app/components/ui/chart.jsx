"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "./utils";

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within <ChartContainer />");
  }
  return context;
}

/* ===============================
   Chart Container
================================ */

function ChartContainer({ id, className, children, config = {}, ...props }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn("w-full h-full", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/* ===============================
   Dynamic CSS Variables
================================ */

function ChartStyle({ id, config }) {
  const entries = Object.entries(config).filter(([, item]) => item?.color);

  if (!entries.length) return null;

  const css = `
[data-chart="${id}"] {
${entries.map(([key, item]) => `  --color-${key}: ${item.color};`).join("\n")}
}
`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/* ===============================
   Tooltip
================================ */

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({ active, payload, className }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "bg-background border rounded-md p-2 text-xs shadow-md",
        className,
      )}
    >
      {payload.map((item) => (
        <div key={item.dataKey} className="flex justify-between gap-4">
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ===============================
   Legend
================================ */

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({ payload, className }) {
  if (!payload?.length) return null;

  return (
    <div className={cn("flex gap-4 text-xs", className)}>
      {payload.map((item) => (
        <div key={item.value} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.value}
        </div>
      ))}
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
