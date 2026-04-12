import { useEffect, useState } from "react";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  pageTitle: string;
}

interface ThresholdNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isManualControl: boolean;
  handledStatus?: "resolved" | "pending";
  reportNote?: string;
}

interface ManualAlertReportEntry {
  id: string;
  notificationId: string;
  title: string;
  message: string;
  time: string;
  status: "resolved" | "pending";
  note: string;
  createdAt: string;
  updatedBy: string;
}

const MANUAL_ALERT_REPORTS_KEY = "manual-alert-reports";

interface ThresholdAlertEventDetail {
  level: "warning" | "critical";
  device: string;
  status: string;
  time: string;
  isManualControl?: boolean;
}

export function Header({ pageTitle }: HeaderProps) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<ThresholdNotification[]>([
    {
      id: "seed-1",
      title: "Threshold Exceeded",
      message: "M01-BayA: Temp exceeded 70°C",
      time: "10:05 AM",
      isManualControl: false,
    },
    {
      id: "seed-2",
      title: "Threshold Warning",
      message: "M03-BayA: Humidity dropped to 32%",
      time: "09:52 AM",
      isManualControl: true,
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [selectedNotification, setSelectedNotification] = useState<ThresholdNotification | null>(null);
  const [reportStatus, setReportStatus] = useState<"resolved" | "pending">("pending");
  const [reportNote, setReportNote] = useState("");
  const [reportError, setReportError] = useState("");
  const userEmail = localStorage.getItem("userEmail") || "User";
  const userName = userEmail.split("@")[0] || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const onThresholdAlert = (event: Event) => {
      const customEvent = event as CustomEvent<ThresholdAlertEventDetail>;
      const detail = customEvent.detail;
      if (!detail) {
        return;
      }

      const newNotification: ThresholdNotification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: detail.level === "critical" ? "Critical Threshold Exceeded" : "Threshold Warning",
        message: `${detail.device}: ${detail.status}`,
        time: detail.time,
        isManualControl: Boolean(detail.isManualControl),
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 8));
      setUnreadCount((prev) => Math.min(prev + 1, 9));
    };

    window.addEventListener("threshold-alert", onThresholdAlert);

    return () => {
      window.removeEventListener("threshold-alert", onThresholdAlert);
    };
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => {
      const next = !prev;
      if (next) {
        // Calculate unread count from notifications
        const pendingCount = notifications.filter(
          (n) => n.isManualControl && n.handledStatus !== "resolved"
        ).length;
        setUnreadCount(pendingCount);
      }
      return next;
    });
  };

  const handleOpenManualAlert = (notification: ThresholdNotification) => {
    if (!notification.isManualControl) {
      return;
    }

    setSelectedNotification(notification);
    setReportStatus(notification.handledStatus ?? "pending");
    setReportNote(notification.reportNote ?? "");
    setReportError("");
  };

  const handleCloseManualAlert = () => {
    setSelectedNotification(null);
    setReportError("");
  };

  const handleSaveManualAlertReport = () => {
    if (!selectedNotification) {
      return;
    }

    const trimmedNote = reportNote.trim();
    if (!trimmedNote) {
      setReportError("Please enter a report note before saving.");
      return;
    }

    const nowIso = new Date().toISOString();
    const nextEntry: ManualAlertReportEntry = {
      id: `${selectedNotification.id}-${Date.now()}`,
      notificationId: selectedNotification.id,
      title: selectedNotification.title,
      message: selectedNotification.message,
      time: selectedNotification.time,
      status: reportStatus,
      note: trimmedNote,
      createdAt: nowIso,
      updatedBy: userName,
    };

    const existingRaw = localStorage.getItem(MANUAL_ALERT_REPORTS_KEY);
    let existingEntries: ManualAlertReportEntry[] = [];
    try {
      existingEntries = existingRaw ? (JSON.parse(existingRaw) as ManualAlertReportEntry[]) : [];
    } catch {
      existingEntries = [];
    }

    const nextEntries = [nextEntry, ...existingEntries].slice(0, 100);
    localStorage.setItem(MANUAL_ALERT_REPORTS_KEY, JSON.stringify(nextEntries));
    window.dispatchEvent(new CustomEvent("manual-alert-report-updated"));

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === selectedNotification.id
          ? {
              ...item,
              handledStatus: reportStatus,
              reportNote: trimmedNote,
            }
          : item
      )
    );

    // Update unreadCount based on new status
    if (reportStatus === "resolved" && selectedNotification.handledStatus !== "resolved") {
      // Changed from pending/undefined to resolved - decrease count
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } else if (reportStatus !== "resolved" && selectedNotification.handledStatus === "resolved") {
      // Changed from resolved to pending - increase count
      setUnreadCount((prev) => prev + 1);
    }

    handleCloseManualAlert();
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-slate-800" style={{ fontWeight: 700, fontSize: "1.125rem" }}>
          {pageTitle}
        </h1>
        <p className="text-slate-400" style={{ fontSize: "0.75rem" }}>
          Thursday, March 12, 2026 — Factory Line A
        </p>
      </div>

      {/* Right: Search + Notif + User */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={handleToggleNotifications}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-all"
          >
          <Bell size={20} className="text-slate-500" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center" style={{ fontSize: "0.6rem", fontWeight: 700 }}>
              {unreadCount}
            </span>
          )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-slate-800" style={{ fontSize: "0.8125rem", fontWeight: 700 }}>
                  Notifications
                </span>
                <span className="text-slate-400" style={{ fontSize: "0.7rem" }}>
                  {notifications.length} alerts
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-400" style={{ fontSize: "0.75rem" }}>
                    No threshold alerts
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-slate-100 last:border-b-0 ${
                        notification.isManualControl ? "bg-red-50/60 cursor-pointer hover:bg-red-100/70" : ""
                      }`}
                      onClick={() => handleOpenManualAlert(notification)}
                    >
                      <p
                        className={notification.isManualControl ? "text-red-700" : "text-slate-800"}
                        style={{ fontSize: "0.75rem", fontWeight: 700 }}
                      >
                        {notification.title}
                      </p>
                      <p
                        className={`mt-1 ${notification.isManualControl ? "text-red-600 animate-pulse" : "text-slate-600"}`}
                        style={{ fontSize: "0.72rem" }}
                      >
                        {notification.message}
                      </p>
                      {notification.isManualControl && (
                        <>
                          <p className="text-red-500 mt-1" style={{ fontSize: "0.68rem", fontWeight: 600 }}>
                            This machine is on manual mode, please check this device
                          </p>
                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                                notification.handledStatus === "resolved"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                              style={{ fontSize: "0.65rem", fontWeight: 700 }}
                            >
                              {notification.handledStatus === "resolved" ? "Handled" : "Pending"}
                            </span>
                            <span className="text-red-500" style={{ fontSize: "0.65rem", fontWeight: 700 }}>
                              Click to update report
                            </span>
                          </div>
                        </>
                      )}
                      <p className="text-slate-400 mt-1" style={{ fontSize: "0.68rem" }}>
                        {notification.time}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shrink-0">
              <span className="text-white" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                {userInitials}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-slate-800" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                {userName}
              </p>
              <p className="text-slate-400" style={{ fontSize: "0.7rem" }}>
                {userEmail}
              </p>
            </div>
            <ChevronDown
              size={14}
              className="text-slate-400 hidden md:block"
              style={{
                transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all first:rounded-t-lg last:rounded-b-lg"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {selectedNotification && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-4">
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-slate-800" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  Manual Alert Handling
                </h3>
                <p className="mt-1 text-slate-500" style={{ fontSize: "0.75rem" }}>
                  {selectedNotification.message}
                </p>
              </div>

              <div className="space-y-4 px-5 py-4">
                <div>
                  <p className="mb-2 text-slate-700" style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                    Handling status
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setReportStatus("pending")}
                      className={`rounded-lg border px-3 py-2 text-left transition-all ${
                        reportStatus === "pending"
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"
                      }`}
                      style={{ fontSize: "0.78rem", fontWeight: 700 }}
                    >
                      Not yet handled
                    </button>
                    <button
                      onClick={() => setReportStatus("resolved")}
                      className={`rounded-lg border px-3 py-2 text-left transition-all ${
                        reportStatus === "resolved"
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
                      }`}
                      style={{ fontSize: "0.78rem", fontWeight: 700 }}
                    >
                      Handled
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-slate-700" style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                    Report note
                  </p>
                  <textarea
                    value={reportNote}
                    onChange={(e) => {
                      setReportNote(e.target.value);
                      if (reportError) {
                        setReportError("");
                      }
                    }}
                    placeholder="Describe what was checked, actions taken, and current machine state..."
                    className="min-h-28 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-slate-700 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
                    style={{ fontSize: "0.78rem" }}
                  />
                  {reportError && (
                    <p className="mt-1 text-red-600" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                      {reportError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
                <button
                  onClick={handleCloseManualAlert}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50"
                  style={{ fontSize: "0.78rem", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveManualAlertReport}
                  className="rounded-lg bg-emerald-500 px-3 py-2 text-white hover:bg-emerald-600"
                  style={{ fontSize: "0.78rem", fontWeight: 700 }}
                >
                  Save to report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
