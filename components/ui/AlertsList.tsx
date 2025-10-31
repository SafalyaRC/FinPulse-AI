"use client";

import { Button } from "@/components/ui/button";
import { getAlertText } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteAlert } from "@/lib/actions/alert.actions";
import { toast } from "sonner";
import AlertModal from "./AlertModal";

export default function AlertsList({ alertData }: AlertsListProps) {
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (alertId: string) => {
    try {
      const result = await deleteAlert(alertId);
      if (result.success) {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete alert");
    }
  };

  if (!alertData || alertData.length === 0) {
    return (
      <div className="alert-empty">
        No alerts set. Add an alert from the watchlist to get notified of price
        movements.
      </div>
    );
  }

  return (
    <div className="alerts-list">
      {alertData.map((alert) => (
        <div key={alert.id} className="alert-item">
          <div className="alert-name">{alert.alertName}</div>
          <div className="alert-details">
            <div>
              <div className="alert-company">{alert.company}</div>
              <div className="alert-symbol">{alert.symbol}</div>
            </div>
            <div className="alert-price">{getAlertText(alert)}</div>
          </div>
          <div className="alert-actions">
            <Button
              variant="ghost"
              className="alert-update-btn"
              onClick={() => {
                setEditingAlert(alert);
                setIsModalOpen(true);
              }}
            >
              <Edit2 size={16} />
            </Button>
            <Button
              variant="ghost"
              className="alert-delete-btn"
              onClick={() => handleDelete(alert.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}

      {editingAlert && (
        <AlertModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          alertId={editingAlert.id}
          alertData={{
            symbol: editingAlert.symbol,
            company: editingAlert.company,
            alertName: editingAlert.alertName,
            alertType: editingAlert.alertType,
            threshold: editingAlert.threshold.toString(),
          }}
        />
      )}
    </div>
  );
}
