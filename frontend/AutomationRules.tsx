import { useState, useEffect } from "react";
import { fruitRecipes, type ControlMode, type DryingPhase, type FruitRecipe, type ThresholdRule, type TimeSchedule } from "../data/dryingRecipes";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Thermometer,
  Sun,
  Droplets,
  Wind,
  Flame,
  Save,
  Plus,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  Calendar,
  Zap,
  Trash2,
  Apple,
  Edit2,
  Copy,
  ArrowRight,
  Timer,
  Settings2,
  Target,
  Hand,
  Gauge,
} from "lucide-react";

function FruitSelector({
  recipes,
  selected,
  onSelect,
  search,
  onSearch,
}: {
  recipes: FruitRecipe[];
  selected: string | null;
  onSelect: (fruitId: string) => void;
  search: string;
  onSearch: (s: string) => void;
}) {
  const groupedFruits = {
    tropical: recipes.filter((f) => f.category === "tropical"),
    citrus: recipes.filter((f) => f.category === "citrus"),
  };

  const filteredFruits = {
    tropical: groupedFruits.tropical.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    ),
    citrus: groupedFruits.citrus.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    ),
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Apple size={15} className="text-emerald-500" />
          <h2 className="text-slate-800" style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
            Fruit Types
          </h2>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search fruit types..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
            style={{ fontSize: "0.78rem" }}
          />
        </div>
      </div>

      {/* Fruit List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Tropical Fruits */}
        {filteredFruits.tropical.length > 0 && (
          <div>
            <div className="px-2 py-1 mb-1">
              <span className="text-slate-400" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                TROPICAL FRUITS
              </span>
            </div>
            <div className="space-y-0.5">
              {filteredFruits.tropical.map((fruit) => (
                <button
                  key={fruit.id}
                  onClick={() => onSelect(fruit.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                    selected === fruit.id
                      ? "bg-emerald-500 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Apple size={14} className={selected === fruit.id ? "text-white" : "text-emerald-500"} />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{fruit.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        selected === fruit.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                      style={{ fontSize: "0.65rem", fontWeight: 600 }}
                    >
                      {fruit.phases.length} phases
                    </span>
                    <span
                      className={selected === fruit.id ? "text-white/70" : "text-slate-400"}
                      style={{ fontSize: "0.65rem", marginTop: "2px" }}
                    >
                      {fruit.totalTime}h total
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Citrus Fruits */}
        {filteredFruits.citrus.length > 0 && (
          <div>
            <div className="px-2 py-1 mb-1">
              <span className="text-slate-400" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                CITRUS FRUITS
              </span>
            </div>
            <div className="space-y-0.5">
              {filteredFruits.citrus.map((fruit) => (
                <button
                  key={fruit.id}
                  onClick={() => onSelect(fruit.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                    selected === fruit.id
                      ? "bg-emerald-500 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Apple size={14} className={selected === fruit.id ? "text-white" : "text-orange-500"} />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{fruit.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        selected === fruit.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                      style={{ fontSize: "0.65rem", fontWeight: 600 }}
                    >
                      {fruit.phases.length} phases
                    </span>
                    <span
                      className={selected === fruit.id ? "text-white/70" : "text-slate-400"}
                      style={{ fontSize: "0.65rem", marginTop: "2px" }}
                    >
                      {fruit.totalTime}h total
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add New Recipe */}
      <div className="p-3 border-t border-slate-100">
        <button
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-all"
          style={{ fontSize: "0.78rem", fontWeight: 600 }}
        >
          <Plus size={13} />
          Create New Recipe
        </button>
      </div>
    </div>
  );
}

function RecipeEditor({ recipe, onSave }: { recipe: FruitRecipe; onSave: (updatedRecipe: FruitRecipe) => void }) {
  const [phases, setPhases] = useState<DryingPhase[]>(recipe.phases);
  const [controlMode, setControlMode] = useState<ControlMode>(recipe.controlMode);
  const [thresholds, setThresholds] = useState<ThresholdRule[]>(recipe.thresholds);
  const [schedules, setSchedules] = useState<TimeSchedule[]>(recipe.schedules);
  const [saved, setSaved] = useState(false);

  // Update state when recipe changes
  useEffect(() => {
    setPhases(recipe.phases);
    setControlMode(recipe.controlMode);
    setThresholds(recipe.thresholds);
    setSchedules(recipe.schedules);
  }, [recipe.id]);

  const handlePhaseChange = (
    phaseId: string,
    field: keyof DryingPhase,
    value: string | number,
  ) => {
    setPhases((prev) =>
      prev.map((p) => (p.id === phaseId ? { ...p, [field]: value } : p))
    );
  };

  const handleAddPhase = () => {
    const newPhase: DryingPhase = {
      id: `p${phases.length + 1}`,
      name: `Phase ${phases.length + 1}`,
      temperature: 60,
      humidity: 45,
      light: 40,
      duration: 4,
    };
    setPhases([...phases, newPhase]);
  };

  const handleDeletePhase = (phaseId: string) => {
    if (phases.length > 1) {
      setPhases((prev) => prev.filter((p) => p.id !== phaseId));
    }
  };

  const handleThresholdChange = (id: string, field: keyof ThresholdRule, value: any) => {
    setThresholds((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleAddThreshold = () => {
    const newThreshold: ThresholdRule = {
      id: `t${thresholds.length + 1}`,
      sensor: "temperature",
      condition: "above",
      value: 70,
      action: "Turn on exhaust fan",
      enabled: true,
    };
    setThresholds([...thresholds, newThreshold]);
  };

  const handleDeleteThreshold = (id: string) => {
    setThresholds((prev) => prev.filter((t) => t.id !== id));
  };

  const handleScheduleChange = (id: string, field: keyof TimeSchedule, value: any) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAddSchedule = () => {
    const newSchedule: TimeSchedule = {
      id: `s${schedules.length + 1}`,
      name: `Schedule ${schedules.length + 1}`,
      startTime: "08:00",
      endTime: "20:00",
      active: true,
    };
    setSchedules([...schedules, newSchedule]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    const updatedRecipe: FruitRecipe = {
      ...recipe,
      phases,
      totalTime: phases.reduce((sum, p) => sum + p.duration, 0),
      controlMode,
      thresholds,
      schedules,
    };

    onSave(updatedRecipe);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalTime = phases.reduce((sum, p) => sum + p.duration, 0);

  const controlModeConfig = {
    manual: { label: "Manual", icon: <Hand size={14} />, color: "#64748b", desc: "Manually adjust all parameters" },
    threshold: { label: "Threshold-based", icon: <Gauge size={14} />, color: "#f59e0b", desc: "Automatic control based on sensor readings" },
    time: { label: "Time-based", icon: <Clock size={14} />, color: "#3b82f6", desc: "Scheduled automation at set times" },
  };

  return (
    <div className="space-y-5">
      {/* Recipe Overview */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-100">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Apple size={16} className="text-emerald-600" />
              <h3 className="text-slate-800" style={{ fontWeight: 700, fontSize: "1rem" }}>
                {recipe.name} Drying Recipe
              </h3>
            </div>
            <p className="text-slate-600" style={{ fontSize: "0.78rem" }}>
              Multi-phase drying process with automated temperature and humidity control
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-3 py-1 bg-white rounded-lg text-emerald-600 border border-emerald-200" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
              {phases.length} Phases
            </span>
            <span className="text-slate-500" style={{ fontSize: "0.72rem" }}>
              Total: {totalTime.toFixed(1)}h
            </span>
          </div>
        </div>
      </div>
      {/* Phase Flow Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Timer size={14} className="text-slate-400" />
          <span className="text-slate-700" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
            Process Flow
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {phases.map((phase, idx) => (
            <div key={phase.id} className="flex items-center gap-2">
              <div className="flex flex-col items-center min-w-[140px]">
                <div className="w-full bg-slate-50 rounded-lg border border-slate-200 p-2.5">
                  <div className="text-center mb-1.5">
                    <span className="text-slate-800" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                      {phase.name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500" style={{ fontSize: "0.68rem" }}>Temp:</span>
                      <span className="text-orange-600" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                        {phase.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500" style={{ fontSize: "0.68rem" }}>Humid:</span>
                      <span className="text-blue-600" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                        {phase.humidity}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500" style={{ fontSize: "0.68rem" }}>Light:</span>
                      <span className="text-yellow-600" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                        {phase.light}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500" style={{ fontSize: "0.68rem" }}>Time:</span>
                      <span className="text-slate-700" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                        {phase.duration}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {idx < phases.length - 1 && (
                <ArrowRight size={16} className="text-slate-300 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Phase Configuration Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-700" style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
            Phase Configuration
          </h3>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
            style={{ fontSize: "0.8125rem", fontWeight: 600 }}
          >
            {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {saved ? "Saved!" : "Save Recipe"}
          </button>
        </div>

        <div className="grid grid-flow-col auto-cols-[minmax(320px,1fr)] gap-3 overflow-x-auto pb-1">
          {phases.map((phase, idx) => (
            <div
              key={phase.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
            {/* Phase Header */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white"
                  style={{ fontSize: "0.7rem", fontWeight: 700 }}
                >
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={phase.name}
                  onChange={(e) => handlePhaseChange(phase.id, "name", e.target.value)}
                  className="bg-transparent text-slate-800 outline-none border-b border-transparent hover:border-emerald-300 focus:border-emerald-500 transition-all"
                  style={{ fontSize: "0.875rem", fontWeight: 700, width: "200px" }}
                />
              </div>
              <button
                onClick={() => handleDeletePhase(phase.id)}
                disabled={phases.length === 1}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Phase Controls */}
            <div className="p-4 space-y-4">
              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Thermometer size={14} className="text-orange-500" />
                    <span className="text-slate-700" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                      Temperature
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={phase.temperature}
                      onChange={(e) => handlePhaseChange(phase.id, "temperature", Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-right"
                      style={{ fontSize: "0.8125rem", fontWeight: 700 }}
                      min={20}
                      max={100}
                    />
                    <span className="text-slate-400" style={{ fontSize: "0.78rem" }}>°C</span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400" style={{ fontSize: "0.7rem" }}>20°C</span>
                  <span className="text-slate-400" style={{ fontSize: "0.7rem" }}>100°C</span>
                </div>
              </div>

              {/* Humidity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets size={14} className="text-blue-500" />
                    <span className="text-slate-700" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                      Humidity
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={phase.humidity}
                      onChange={(e) => handlePhaseChange(phase.id, "humidity", Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-right"
                      style={{ fontSize: "0.8125rem", fontWeight: 700 }}
                      min={10}
                      max={100}
                    />
                    <span className="text-slate-400" style={{ fontSize: "0.78rem" }}>%</span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400" style={{ fontSize: "0.7rem" }}>10%</span>
                  <span className="text-slate-400" style={{ fontSize: "0.7rem" }}>100%</span>
                </div>
              </div>

              {/* Light */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sun size={14} className="text-yellow-500" />
                    <span className="text-slate-700" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                      Light Intensity
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={phase.light}
                      onChange={(e) => handlePhaseChange(phase.id, "light", Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 text-right"
                      style={{ fontSize: "0.8125rem", fontWeight: 700 }}
                      min={0}
                      max={100}
                    />
                    <span className="text-slate-400" style={{ fontSize: "0.78rem" }}>%</span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400" style={{ fontSize: "0.7rem" }}>0%</span>
                  <span className="text-slate-400" style={{ fontSize: "0.7rem" }}>100%</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-500" />
                    <span className="text-slate-700" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                      Duration
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      value={phase.duration}
                      onChange={(e) => handlePhaseChange(phase.id, "duration", Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-right"
                      style={{ fontSize: "0.8125rem", fontWeight: 700 }}
                      min={0.5}
                      max={24}
                    />
                    <span className="text-slate-400" style={{ fontSize: "0.78rem" }}>hours</span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400" style={{ fontSize: "0.7rem" }}>0.5h</span>
                  <span className="text-slate-400" style={{ fontSize: "0.7rem" }}>24h</span>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>

        {/* Add Phase Button */}
        <button
          onClick={handleAddPhase}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition-all"
        >
          <Plus size={16} />
          <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Add New Phase</span>
        </button>
      </div>
    </div>
  );
}

export function AutomationRules() {
  const [recipes, setRecipes] = useState<FruitRecipe[]>(fruitRecipes);
  const [selectedFruit, setSelectedFruit] = useState<string | null>("mango");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedRecipe = recipes.find((f) => f.id === selectedFruit);

  const handleSaveRecipe = (updatedRecipe: FruitRecipe) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Page Header */}
        <div className="mb-5">
          <h1 className="text-slate-800" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
            Drying Recipes & Schedules
          </h1>
          <p className="text-slate-400" style={{ fontSize: "0.8rem" }}>
            Configure multi-phase drying recipes for each fruit type with precise temperature, humidity, and timing control
          </p>
        </div>

        {/* Split View */}
        <div className="flex gap-5 items-start" style={{ minHeight: "calc(100vh - 220px)" }}>
          {/* Left: Fruit Selector (1/3) */}
          <div className="w-72 shrink-0" style={{ minHeight: "500px" }}>
            <FruitSelector
              recipes={recipes}
              selected={selectedFruit}
              onSelect={setSelectedFruit}
              search={searchQuery}
              onSearch={setSearchQuery}
            />
          </div>

          {/* Right: Recipe Editor (2/3) */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
              {selectedRecipe ? (
                <RecipeEditor recipe={selectedRecipe} onSave={handleSaveRecipe} />
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <Apple size={48} className="mx-auto mb-3 opacity-30" />
                  <p style={{ fontSize: "0.875rem" }}>Select a fruit type to configure its drying recipe</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
