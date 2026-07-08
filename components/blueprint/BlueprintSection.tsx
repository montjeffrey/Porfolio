import { fieldServiceCrm } from "@/lib/blueprint/graphs/field-service-crm";
import BlueprintCanvas from "./BlueprintCanvas";

export default function BlueprintSection() {
  return (
    <section className="relative py-20 px-6 bg-bg-elevated">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="font-mono text-sm tracking-widest uppercase mb-4"
            style={{ color: "var(--accent-primary)" }}
          >
            LIVE SYSTEM MAP
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">
            This is what your operation looks like when nothing is typed twice.
          </h2>
          <p className="text-lg text-secondary/80 max-w-2xl mx-auto leading-relaxed">
            Select any node. Everything is inspectable — that&apos;s the point.
          </p>
        </div>

        <div className="relative bg-[var(--glass-fill)] border border-[var(--stroke-glass)] backdrop-blur-md rounded-2xl p-6">
          <BlueprintCanvas graph={fieldServiceCrm} />
        </div>
      </div>
    </section>
  );
}
