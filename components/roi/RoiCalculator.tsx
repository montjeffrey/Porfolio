"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRoiStore } from "@/lib/roi/store";
import { track } from "@/lib/telemetry";
import RoiSliderRow from "./RoiSliderRow";
import RoiOutputPanel from "./RoiOutputPanel";
import ShowTheMath from "./ShowTheMath";

export default function RoiCalculator() {
  const router = useRouter();
  const inputs = useRoiStore((state) => state.inputs);
  const armSnapshot = useRoiStore((state) => state.armSnapshot);
  const hasMounted = useRef(false);

  // RoiSliderRow (not in this task's file list) owns the slider onChange
  // handlers, so slider interaction is tracked here instead: any change to
  // the store's `inputs` object identity (triggered by setInput) fires this
  // effect after the initial mount.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    track("roi_calculator", "interact");
  }, [inputs]);

  const handleSendAnalysis = () => {
    armSnapshot();
    track("roi_calculator", "complete");
    router.push("/contact");
  };

  return (
    <section id="roi" className="relative py-20 px-6 bg-bg-dark">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="font-mono text-sm tracking-widest uppercase mb-4"
            style={{ color: "var(--accent-primary)" }}
          >
            ROI MODELING
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">
            Your bottleneck, priced.
          </h2>
          <p className="text-lg text-secondary/80 max-w-2xl mx-auto leading-relaxed">
            Move the sliders to match your operation. The math is shown, the assumptions are
            yours to change.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-[var(--glass-fill)] border border-[var(--stroke-glass)] backdrop-blur-md rounded-2xl p-6">
            <RoiSliderRow inputKey="technicians" label="Technicians" unit="" />
            <RoiSliderRow inputKey="jobsPerTechPerDay" label="Jobs per tech / day" unit="/day" />
            <RoiSliderRow
              inputKey="adminMinutesPerJob"
              label="Admin minutes per job"
              unit=" min"
            />
            <RoiSliderRow
              inputKey="doubleEntryRate"
              label="Double-entry rate"
              unit="%"
              format={(v) => Math.round(v * 100).toString()}
            />
            <RoiSliderRow
              inputKey="errorReworkRate"
              label="Error / rework rate"
              unit="%"
              format={(v) => Math.round(v * 100).toString()}
            />
            <RoiSliderRow
              inputKey="loadedHourlyCost"
              label="Loaded hourly cost"
              unit="/hr"
              format={(v) => `$${v}`}
            />
            <RoiSliderRow
              inputKey="workingDaysPerYear"
              label="Working days / year"
              unit=" days"
            />
          </div>

          <div className="md:col-span-4 bg-[var(--surface-1)] rounded-2xl p-6">
            <RoiOutputPanel />
            <ShowTheMath />
            <button
              type="button"
              onClick={handleSendAnalysis}
              className="w-full mt-8 px-6 py-3 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Send me this analysis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
