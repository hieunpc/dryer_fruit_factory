import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronDown,
  MoreVertical,
  Thermometer,
  Droplets,
  Sun,
  Edit2,
  Trash2,
  Cpu,
  CheckCircle,
  AlertTriangle,
  WifiOff,
  ChevronRight,
} from "lucide-react";

type MachineStatus = "running" | "offline" | "alert";
type MachineMode = "auto" | "manual";

interface Machine {
  id: string;
  name: string;
  zoneID: string;
  status: MachineStatus;
  temp: number;
  humidity: number;
  light: number;
  mode: MachineMode;
  isOn: boolean;
  fruit: string;
  runHours: number;
  batchCode: string;
  dryingStage: string;
}

const clampPercent = (value: number | undefined) => Math.max(1, Math.min(100, value ?? 1));
const randomPercent = () => Math.floor(Math.random() * 100) + 1;

const initialZoneA: Machine[] = [
  { id: "M01", name: "Dryer M01", zoneID: "a", status: "running", temp: 68, humidity: 42, light: 74, mode: "auto", isOn: true, fruit: "Mango", runHours: 14, batchCode: "MG-240326-A", dryingStage: "Mid Drying" },
  { id: "M02", name: "Dryer M02", zoneID: "a", status: "alert", temp: 77, humidity: 38, light: 88, mode: "auto", isOn: true, fruit: "Banana", runHours: 9, batchCode: "BN-240326-B", dryingStage: "Final Drying" },
  { id: "M03", name: "Dryer M03", zoneID: "a", status: "running", temp: 64, humidity: 45, light: 63, mode: "manual", isOn: true, fruit: "Pineapple", runHours: 6, batchCode: "PN-240326-A", dryingStage: "Ramp-up" },
  { id: "M04", name: "Dryer M04", zoneID: "a", status: "offline", temp: 24, humidity: 61, light: 18, mode: "manual", isOn: false, fruit: "Papaya", runHours: 0, batchCode: "PP-240325-A", dryingStage: "Maintenance" }

];

const initialZoneB: Machine[] = [
  { id: "M07", name: "Dryer M07", zoneID: "b", status: "running", temp: 65, humidity: 43, light: 71, mode: "auto", isOn: true, fruit: "Orange", runHours: 8, batchCode: "OR-240326-A", dryingStage: "Pre-heating" },
  { id: "M08", name: "Dryer M08", zoneID: "b", status: "running", temp: 67, humidity: 41, light: 66, mode: "manual", isOn: true, fruit: "Lemon", runHours: 12, batchCode: "LM-240326-A", dryingStage: "Mid Drying" },
  { id: "M09", name: "Dryer M09", zoneID: "b", status: "alert", temp: 78, humidity: 35, light: 92, mode: "auto", isOn: true, fruit: "Grapefruit", runHours: 7, batchCode: "GF-240326-B", dryingStage: "Final Drying" },
  { id: "M10", name: "Dryer M10", zoneID: "b", status: "offline", temp: 24, humidity: 63, light: 21, mode: "manual", isOn: false, fruit: "Lime", runHours: 0, batchCode: "LI-240325-B", dryingStage: "Maintenance" },
  { id: "M11", name: "Dryer M11", zoneID: "b", status: "running", temp: 69, humidity: 44, light: 58, mode: "auto", isOn: true, fruit: "Orange", runHours: 5, batchCode: "OR-240326-C", dryingStage: "Ramp-up" },
  { id: "M12", name: "Dryer M12", zoneID: "b", status: "running", temp: 66, humidity: 47, light: 69, mode: "auto", isOn: true, fruit: "Mandarin", runHours: 10, batchCode: "MD-240326-A", dryingStage: "Conditioning" },
];

const statusConfig: Record<MachineStatus, { label: string; bg: string; text: string; dot: string; icon: React.ReactNode }> = {
  running: {
    label: "Running",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: <CheckCircle size={11} />,
  },
  offline: {
    label: "Offline",
    bg: "bg-slate-100",
    text: "text-slate-500",
    dot: "bg-slate-400",
    icon: <WifiOff size={11} />,
  },
  alert: {
    label: "Alert",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
    icon: <AlertTriangle size={11} />,
  },
};

function ToggleSwitch({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex items-center w-10 h-5 rounded-full transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${checked ? "bg-emerald-500" : "bg-slate-300"}`}
    >
      <span
        className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transform transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function MachineCard({
  machine,
  onToggle,
  onViewDetails,
}: {
  machine: Machine;
  onToggle: (id: string) => void;
  onViewDetails: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const s = statusConfig[machine.status];
   const navigate = useNavigate();
  const lightPercent = clampPercent(machine.light);
  return (
    <div
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-visible relative ${
        machine.status === "alert" ? "border-red-200" : "border-slate-200"
      }`}
    >
      {/* Alert glow top strip */}
      {machine.status === "alert" && (
        <div className="h-0.5 w-full bg-gradient-to-r from-red-400 to-orange-400 rounded-t-xl" />
      )}

      {/* Card Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              machine.isOn ? "bg-slate-800" : "bg-slate-100"
            }`}
          >
            <Cpu size={16} className={machine.isOn ? "text-emerald-400" : "text-slate-400"} />
          </div>
          <div>
            <p className="text-slate-800" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
              {machine.name}
            </p>
            <p className="text-slate-400" style={{ fontSize: "0.7rem" }}>
              {machine.fruit} Drying
            </p>
          </div>
        </div>

        {/* Three-dot menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-36">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 transition-all"
                style={{ fontSize: "0.8rem" }}
              >
                <Edit2 size={13} className="text-slate-400" />
                Edit Machine
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-red-500 hover:bg-red-50 transition-all"
                style={{ fontSize: "0.8rem" }}
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="px-4 pb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}
          style={{ fontSize: "0.7rem", fontWeight: 600 }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${machine.status === "alert" ? "animate-pulse" : ""}`} />
          {s.icon}
          {s.label}
        </span>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-3 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-2.5 py-2 border border-orange-100">
          <Thermometer size={13} className="text-orange-500 shrink-0" />
          <div>
            <p className="text-slate-400" style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.03em" }}>
              TEMP
            </p>
            <p className="text-orange-700" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
              {machine.isOn ? `${machine.temp}°C` : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-2.5 py-2 border border-blue-100">
          <Droplets size={13} className="text-blue-500 shrink-0" />
          <div>
            <p className="text-slate-400" style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.03em" }}>
              HUMIDITY
            </p>
            <p className="text-blue-700" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
              {machine.isOn ? `${machine.humidity}%` : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-2.5 py-2 border border-yellow-100">
          <Sun size={13} className="text-yellow-500 shrink-0" />
          <div>
            <p className="text-slate-400" style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.03em" }}>
              LIGHT
            </p>
            <p className="text-yellow-700" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
              {machine.isOn ? `${lightPercent}%` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Master Power Toggle */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div>
          <p className="text-slate-600" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
            Master Power
          </p>
          <p className="text-slate-400" style={{ fontSize: "0.68rem" }}>
            {machine.isOn ? `Active • ${machine.runHours}h runtime` : "Powered off"}
          </p>
        </div>
        <ToggleSwitch checked={machine.isOn} onChange={() => onToggle(machine.id)} />
      </div>

      {/* Card Footer */}
      <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between bg-slate-50 rounded-b-xl">
        <span className="text-slate-500" style={{ fontSize: "0.7rem" }}>
          <span className="text-slate-400">Mode: </span>
          <span
            className={machine.mode === "auto" ? "text-emerald-600" : "text-amber-600"}
            style={{ fontWeight: 700 }}
          >
            {machine.mode === "auto" ? "Auto" : "Manual"}
          </span>
        </span>
        <button
          onClick={() => machine.isOn ? onViewDetails(machine.id) : null}
          className="flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 transition-all"
          style={{ fontSize: "0.7rem", fontWeight: 600 }}
      >
          Details <ChevronRight size={11}  />
        </button>
      </div>
    </div>
  );
}

function ZoneSection({
  title,
  subtitle,
  machines,
  onToggle,
  onViewDetails,
  show,
}: {
  title: string;
  subtitle: string;
  machines: Machine[];
  onToggle: (id: string) => void;
  onViewDetails: (id: string) => void;
  show: boolean;
}) {
  const runningCount = machines.filter((m) => m.status === "running").length;
  const alertCount = machines.filter((m) => m.status === "alert").length;

  if (!show) return null;

  return (
    <div className="space-y-3">
      {/* Zone Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-slate-800" style={{ fontWeight: 700, fontSize: "1rem" }}>
            {title}
          </h2>
          <span className="px-2.5 py-0.5 bg-slate-100 rounded-full text-slate-500" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
            {machines.length} Machines
          </span>
          {runningCount > 0 && (
            <span className="px-2.5 py-0.5 bg-emerald-50 rounded-full text-emerald-700 border border-emerald-100" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
              {runningCount} Active
            </span>
          )}
          {alertCount > 0 && (
            <span className="px-2.5 py-0.5 bg-red-50 rounded-full text-red-600 border border-red-100 animate-pulse" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
              {alertCount} Alert
            </span>
          )}
        </div>
        <p className="text-slate-400" style={{ fontSize: "0.75rem" }}>
          {subtitle}
        </p>
      </div>

      {/* Machine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {machines.map((m) => (
          <MachineCard key={m.id} machine={m} onToggle={onToggle} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
}

export function DevicesManagement() {
  const navigate = useNavigate();
  const [zoneAMachines, setZoneAMachines] = useState(initialZoneA);
  const [zoneBMachines, setZoneBMachines] = useState(initialZoneB);
  const [zoneFilter, setZoneFilter] = useState("all");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [showAddDeviceDialog, setShowAddDeviceDialog] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showDeviceForm, setShowDeviceForm] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceMode, setDeviceMode] = useState<MachineMode>("auto");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setZoneAMachines((prev) =>
        prev.map((machine) =>
          machine.isOn
            ? {
                ...machine,
                light: randomPercent(),
              }
            : machine
        )
      );
      setZoneBMachines((prev) =>
        prev.map((machine) =>
          machine.isOn
            ? {
                ...machine,
                light: randomPercent(),
              }
            : machine
        )
      );
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  const handleToggle = (id: string) => {
    setZoneAMachines((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              isOn: !m.isOn,
              status: !m.isOn ? "running" : "offline",
              light: !m.isOn ? randomPercent() : m.light,
            }
          : m
      )
    );
    setZoneBMachines((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              isOn: !m.isOn,
              status: !m.isOn ? "running" : "offline",
              light: !m.isOn ? randomPercent() : m.light,
            }
          : m
      )
    );
  };

  const totalMachines = zoneAMachines.length + zoneBMachines.length;
  const activeMachines = [...zoneAMachines, ...zoneBMachines].filter((m) => m.isOn).length;
  const alertMachines = [...zoneAMachines, ...zoneBMachines].filter((m) => m.status === "alert").length;

  const handleViewDetails = (id: string) => {
    const machine = [...zoneAMachines, ...zoneBMachines].find((m) => m.id === id) ?? null;

    if (machine && !machine.isOn) {
      navigate("/settings");
      return;
    }

    setSelectedMachine(machine);
  };

  const handleAddDevice = () => {
    setShowAddDeviceDialog(true);
    setSelectedRegion(null);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setShowAddDeviceDialog(false);
    setShowDeviceForm(true);
    setDeviceName("");
    setDeviceMode("auto");
  };

  const handleSubmitDevice = () => {
    if (!deviceName.trim() || !selectedRegion) {
      return;
    }

    // Create new machine object
    const newMachine: Machine = {
      id: `M${Date.now()}`,
      name: deviceName,
      zoneID: selectedRegion,
      status: "running",
      temp: 0,
      humidity: 0,
      light: 50,
      mode: deviceMode,
      isOn: false,
      fruit: "",
      runHours: 0,
      batchCode: "",
      dryingStage: "Standby",
    };

    // Add machine to appropriate zone
    if (selectedRegion === "a") {
      setZoneAMachines((prev) => [...prev, newMachine]);
    } else {
      setZoneBMachines((prev) => [...prev, newMachine]);
    }

    // Reset form and close
    setShowDeviceForm(false);
    setDeviceName("");
    setDeviceMode("auto");
    setSelectedRegion(null);
  };

  const handleCancelForm = () => {
    setShowDeviceForm(false);
    setDeviceName("");
    setDeviceMode("auto");
    setSelectedRegion(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-screen-xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-slate-800" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
              Device Management
            </h1>
            <p className="text-slate-400" style={{ fontSize: "0.8rem" }}>
              Monitor, configure and control all drying machines across factory zones
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Zone Filter */}
            <div className="relative flex items-center">
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 cursor-pointer hover:border-slate-300 transition-all"
                style={{ fontSize: "0.8125rem", fontWeight: 500 }}
              >
                <option value="all">All Zones</option>
                <option value="a">Zone A Only</option>
                <option value="b">Zone B Only</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 text-slate-400 pointer-events-none" />
            </div>
            {/* Add Machine Button */}
            <button 
              onClick={handleAddDevice}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-150">
              <Plus size={16} />
              <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Add New Machine</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Machines", value: totalMachines, color: "text-slate-800", bg: "bg-white" },
            { label: "Active / Running", value: activeMachines, color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "Machines with Alert", value: alertMachines, color: "text-red-600", bg: "bg-red-50" },
          ].map((item) => (
            <div key={item.label} className={`${item.bg} rounded-xl border border-slate-200 px-5 py-3.5 flex items-center justify-between shadow-sm`}>
              <span className="text-slate-500" style={{ fontSize: "0.8125rem" }}>{item.label}</span>
              <span className={`${item.color}`} style={{ fontWeight: 800, fontSize: "1.5rem" }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Zone Sections */}
        <ZoneSection
          title="Zone A — Tropical Fruits"
          subtitle="High-temp drying line"
          machines={zoneAMachines}
          onToggle={handleToggle}
          onViewDetails={handleViewDetails}
          show={zoneFilter === "all" || zoneFilter === "a"}
        />

        <ZoneSection
          title="Zone B — Citrus Fruits"
          subtitle="Mid-temp drying line"
          machines={zoneBMachines}
          onToggle={handleToggle}
          onViewDetails={handleViewDetails}
          show={zoneFilter === "all" || zoneFilter === "b"}
        />

        {selectedMachine && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-slate-800" style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {selectedMachine.name}
                  </p>
                  <p className="text-slate-400" style={{ fontSize: "0.75rem" }}>
                    {selectedMachine.id} • {selectedMachine.fruit} line
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMachine(null)}
                  className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  style={{ fontSize: "0.78rem", fontWeight: 600 }}
                >
                  Close
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <p className="text-emerald-700" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                    CURRENT BATCH
                  </p>
                  <p className="text-emerald-900" style={{ fontSize: "1.05rem", fontWeight: 800 }}>
                    {selectedMachine.batchCode}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-blue-700" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                    DRYING STAGE
                  </p>
                  <p className="text-blue-900" style={{ fontSize: "1.05rem", fontWeight: 800 }}>
                    {selectedMachine.dryingStage}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
                    <p className="text-orange-700" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                      TEMPERATURE
                    </p>
                    <p className="text-orange-900" style={{ fontSize: "1.05rem", fontWeight: 800 }}>
                      {selectedMachine.isOn ? `${selectedMachine.temp}°C` : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-blue-700" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                      HUMIDITY
                    </p>
                    <p className="text-blue-900" style={{ fontSize: "1.05rem", fontWeight: 800 }}>
                      {selectedMachine.isOn ? `${selectedMachine.humidity}%` : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3">
                    <p className="text-yellow-700" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                      LIGHT INTENSITY
                    </p>
                    <p className="text-yellow-900" style={{ fontSize: "1.05rem", fontWeight: 800 }}>
                      {selectedMachine.isOn ? `${clampPercent(selectedMachine.light)}%` : "—"}
                    </p>
                  </div>
                </div>

                <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>
                  Batch và giai đoạn được cập nhật theo ca vận hành gần nhất của máy.
                </p>
              </div>
            </div>
          </div>
        )}

        {showAddDeviceDialog && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl">
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-slate-800" style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  Select Region
                </p>
                <p className="text-slate-400" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  Choose which zone to add the new device
                </p>
              </div>

              <div className="p-5 space-y-3">
                {/* Zone A Option */}
                <button
                  onClick={() => handleRegionSelect("a")}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-150 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-slate-800 group-hover:text-emerald-700" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                        Zone A — Tropical Fruits
                      </p>
                      <p className="text-slate-400 group-hover:text-slate-500" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                        High-temp drying line • {zoneAMachines.length} machines
                      </p>
                    </div>
                    <div className="ml-3 w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-emerald-400 group-hover:bg-emerald-400 transition-all flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </button>

                {/* Zone B Option */}
                <button
                  onClick={() => handleRegionSelect("b")}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-150 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-slate-800 group-hover:text-blue-700" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                        Zone B — Citrus Fruits
                      </p>
                      <p className="text-slate-400 group-hover:text-slate-500" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                        Mid-temp drying line • {zoneBMachines.length} machines
                      </p>
                    </div>
                    <div className="ml-3 w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-400 group-hover:bg-blue-400 transition-all flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </button>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowAddDeviceDialog(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                  style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeviceForm && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl">
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-slate-800" style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  Add New Device
                </p>
                <p className="text-slate-400" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  Zone {selectedRegion?.toUpperCase()} • Enter device details
                </p>
              </div>

              <div className="p-5 space-y-4">
                {/* Device Name Input */}
                <div>
                  <label className="block text-slate-700" style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Device Name
                  </label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="e.g., Dryer M13"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                    style={{ fontSize: "0.8125rem" }}
                  />
                </div>

                {/* Mode Selection */}
                <div>
                  <label className="block text-slate-700" style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                    Operating Mode
                  </label>
                  <div className="space-y-2">
                    {/* Auto Mode */}
                    <button
                      onClick={() => setDeviceMode("auto")}
                      className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                        deviceMode === "auto"
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${deviceMode === "auto" ? "text-emerald-700" : "text-slate-700"}`} style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                            Automatic Mode
                          </p>
                          <p className={`${deviceMode === "auto" ? "text-emerald-600" : "text-slate-400"}`} style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                            AI-controlled drying process
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          deviceMode === "auto"
                            ? "border-emerald-400 bg-emerald-400"
                            : "border-slate-300"
                        }`}>
                          {deviceMode === "auto" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                    </button>

                    {/* Manual Mode */}
                    <button
                      onClick={() => setDeviceMode("manual")}
                      className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                        deviceMode === "manual"
                          ? "border-amber-400 bg-amber-50"
                          : "border-slate-200 bg-white hover:border-amber-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${deviceMode === "manual" ? "text-amber-700" : "text-slate-700"}`} style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                            Manual Mode
                          </p>
                          <p className={`${deviceMode === "manual" ? "text-amber-600" : "text-slate-400"}`} style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                            Operator-controlled drying process
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          deviceMode === "manual"
                            ? "border-amber-400 bg-amber-400"
                            : "border-slate-300"
                        }`}>
                          {deviceMode === "manual" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={handleCancelForm}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                  style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitDevice}
                  disabled={!deviceName.trim()}
                  className={`px-4 py-2 text-white rounded-lg transition-all ${
                    deviceName.trim()
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                  style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                >
                  Add Device
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
