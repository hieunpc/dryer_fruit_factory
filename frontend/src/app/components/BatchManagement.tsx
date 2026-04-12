import { useMemo, useState } from "react";
import { CheckCircle2, Layers, PencilLine } from "lucide-react";
import { fruitRecipes } from "../data/dryingRecipes";

interface BatchItem {
  id: string;
  machineId: string;
  machine: string;
  fruit: string;
  status: "active";
  activityType: "recipe" | "threshold" | "manual";
  mid: string;
  currentPhaseIndex?: number;
}

const initialBatches: BatchItem[] = [
  { id: "BATCH-046", machineId: "M04", machine: "Dryer A1", fruit: "Mango", status: "active", activityType: "recipe", mid: "M04-A", currentPhaseIndex: 1 },
  { id: "BATCH-047", machineId: "M04", machine: "Dryer A1", fruit: "Papaya", status: "active", activityType: "threshold", mid: "M04-B" },
  { id: "BATCH-048", machineId: "A2", machine: "Dryer A2", fruit: "Banana", status: "active", activityType: "manual", mid: "A2-A" },
  { id: "BATCH-049", machineId: "A2", machine: "Dryer A2", fruit: "Guava", status: "active", activityType: "recipe", mid: "A2-B", currentPhaseIndex: 0 },
  { id: "BATCH-050", machineId: "B1", machine: "Dryer B1", fruit: "Pineapple", status: "active", activityType: "threshold", mid: "B1-A" },
  { id: "BATCH-051", machineId: "B1", machine: "Dryer B1", fruit: "Orange", status: "active", activityType: "manual", mid: "B1-B" },
];

const statusStyles: Record<BatchItem["status"], string> = {
  active: "bg-emerald-100 text-emerald-700",
};

const activityTypeLabel: Record<BatchItem["activityType"], string> = {
  recipe: "Recipe",
  threshold: "Threshold-based",
  manual: "Manual",
};

const activityTypeStyles: Record<BatchItem["activityType"], string> = {
  recipe: "bg-cyan-100 text-cyan-700",
  threshold: "bg-amber-100 text-amber-700",
  manual: "bg-slate-200 text-slate-700",
};

export function BatchManagement() {
  const [batches, setBatches] = useState(initialBatches);
  const [savedBatchId, setSavedBatchId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(initialBatches[0]?.id ?? null);
  const [machineFilter, setMachineFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState<"all" | BatchItem["activityType"]>("all");

  const machineOptions = useMemo(
    () => Array.from(new Set(batches.map((batch) => batch.machine))),
    [batches],
  );

  const filteredBatches = useMemo(
    () =>
      batches.filter((batch) => {
        const machineMatched = machineFilter === "all" || batch.machine === machineFilter;
        const activityMatched = activityFilter === "all" || batch.activityType === activityFilter;
        return machineMatched && activityMatched;
      }),
    [batches, machineFilter, activityFilter],
  );

  const selectedBatch = batches.find((batch) => batch.id === selectedBatchId) ?? null;
  const selectedRecipe = selectedBatch?.activityType === "recipe"
    ? fruitRecipes.find((recipe) => recipe.id === selectedBatch.fruit.toLowerCase())
    : null;
  const selectedPhaseIndex = selectedBatch?.currentPhaseIndex ?? 0;
  const currentPhase = selectedRecipe?.phases[selectedPhaseIndex] ?? null;

  const totalCount = batches.length;
  const editableCount = batches.length;

  const handleMidChange = (batchId: string, value: string) => {
    setSavedBatchId("");
    setBatches((prev) =>
      prev.map((batch) => (batch.id === batchId ? { ...batch, mid: value } : batch)),
    );
  };

  const handleSaveBatch = (batchId: string) => {
    setSavedBatchId(batchId);
    setTimeout(() => setSavedBatchId(""), 2000);
  };

  return (
    <main className="flex-1 overflow-auto p-6 space-y-6">
      <section className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-emerald-600" />
          <h2 className="text-slate-800" style={{ fontSize: "1rem", fontWeight: 700 }}>
            Batch Management
          </h2>
        </div>
        <p className="text-slate-500 mt-1" style={{ fontSize: "0.8rem" }}>
          One machine can run multiple active batches with different activity types. Filter and update MID as needed.
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-slate-500" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Total Batches</p>
            <p className="text-slate-900" style={{ fontSize: "1.35rem", fontWeight: 700 }}>{totalCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-slate-500" style={{ fontSize: "0.75rem", fontWeight: 600 }}>MID Editable</p>
            <p className="text-slate-900" style={{ fontSize: "1.35rem", fontWeight: 700 }}>{editableCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-slate-500" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Filtered Result</p>
            <p className="text-slate-900" style={{ fontSize: "1.35rem", fontWeight: 700 }}>{filteredBatches.length}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-slate-600 block mb-1" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              Filter by Machine
            </label>
            <select
              value={machineFilter}
              onChange={(e) => setMachineFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
              style={{ fontSize: "0.78rem", fontWeight: 600 }}
            >
              <option value="all">All Machines</option>
              {machineOptions.map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3">
          <label className="text-slate-600 block mb-1" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
            Running Type Filter
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActivityFilter("manual")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activityFilter === "manual"
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
              style={{ fontSize: "0.75rem", fontWeight: 700 }}
            >
              Manual
            </button>
            <button
              onClick={() => setActivityFilter("threshold")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activityFilter === "threshold"
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
              style={{ fontSize: "0.75rem", fontWeight: 700 }}
            >
              Threshold
            </button>
            <button
              onClick={() => setActivityFilter("recipe")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activityFilter === "recipe"
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
              style={{ fontSize: "0.75rem", fontWeight: 700 }}
            >
              Recipe
            </button>
            <button
              onClick={() => setActivityFilter("all")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activityFilter === "all"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
              style={{ fontSize: "0.75rem", fontWeight: 700 }}
            >
              All
            </button>
          </div>
        </div>
      </section>

      {selectedBatch && (
        <section className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-slate-800" style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                {selectedBatch.id} details
              </p>
              <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>
                {selectedBatch.machine} • {selectedBatch.fruit}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full w-fit ${activityTypeStyles[selectedBatch.activityType]}`} style={{ fontSize: "0.7rem", fontWeight: 700 }}>
              {activityTypeLabel[selectedBatch.activityType]}
            </span>
          </div>

          {selectedBatch.activityType === "recipe" && selectedRecipe ? (
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3">
              <p className="text-cyan-700" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                CURRENT RECIPE STEP
              </p>
              <p className="text-cyan-900 mt-1" style={{ fontSize: "0.95rem", fontWeight: 800 }}>
                Step {selectedPhaseIndex + 1}/{selectedRecipe.phases.length} - {currentPhase?.name ?? "Unknown"}
              </p>
              <p className="text-cyan-700 mt-1" style={{ fontSize: "0.75rem" }}>
                Temp {currentPhase ? `${currentPhase.temperature}°C` : "—"} • Humidity {currentPhase ? `${currentPhase.humidity}%` : "—"} • Duration {currentPhase ? `${currentPhase.duration}h` : "—"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-500" style={{ fontSize: "0.78rem" }}>
              This batch is not running a recipe, so there is no recipe step to display.
            </div>
          )}
        </section>
      )}

      <section className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
          <p className="text-slate-700" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
            Batch List
          </p>
        </div>

        <div className="p-4 space-y-3">
          {filteredBatches.map((batch) => {
            const isSaved = savedBatchId === batch.id;
            const isSelected = selectedBatchId === batch.id;

            return (
              <button
                key={batch.id}
                onClick={() => setSelectedBatchId(batch.id)}
                className={`w-full rounded-lg border p-3 bg-white text-left transition-all ${
                  isSelected ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-slate-800" style={{ fontSize: "0.85rem", fontWeight: 700 }}>{batch.id}</p>
                    <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>
                      {batch.machine} ({batch.machineId}) • {batch.fruit}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full w-fit ${activityTypeStyles[batch.activityType]}`}
                      style={{ fontSize: "0.7rem", fontWeight: 700 }}
                    >
                      {activityTypeLabel[batch.activityType]}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full w-fit ${statusStyles[batch.status]}`}
                      style={{ fontSize: "0.7rem", fontWeight: 700 }}
                    >
                      ACTIVE
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {filteredBatches.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-400" style={{ fontSize: "0.8rem" }}>
              No batch matches current filters.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
