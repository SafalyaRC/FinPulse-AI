"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { createAlert, updateAlert } from "@/lib/actions/alert.actions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ALERT_TYPE_OPTIONS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export default function AlertModal({
  alertId,
  alertData,
  open,
  setOpen,
}: AlertModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    alertName: string;
    alertType: "upper" | "lower";
    threshold: string;
  }>({
    alertName: "",
    alertType: "upper",
    threshold: "",
  });

  useEffect(() => {
    if (alertData) {
      setFormData({
        alertName: alertData.alertName,
        alertType: alertData.alertType,
        threshold: alertData.threshold,
      });
    }
  }, [alertData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.alertName || !formData.threshold) {
        toast.error("Please fill in all fields");
        return;
      }

      const threshold = parseFloat(formData.threshold);
      if (isNaN(threshold)) {
        toast.error("Please enter a valid price threshold");
        return;
      }

      const result = alertId
        ? await updateAlert(alertId, {
            alertName: formData.alertName,
            alertType: formData.alertType,
            threshold: threshold,
          })
        : await createAlert(
            alertData!.symbol,
            alertData!.company,
            formData.alertName,
            formData.alertType,
            threshold
          );

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred while saving the alert");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {alertId ? "Edit Alert" : "Create Alert"} for {alertData?.symbol}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Input
              type="text"
              placeholder="Alert Name"
              value={formData.alertName}
              onChange={(e) =>
                setFormData({ ...formData, alertName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Select
              value={formData.alertType}
              onValueChange={(value: string) =>
                setFormData({
                  ...formData,
                  alertType: value as "upper" | "lower",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                {ALERT_TYPE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="focus:bg-gray-600 focus:text-white"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              type="number"
              placeholder="Price Threshold"
              value={formData.threshold}
              onChange={(e) =>
                setFormData({ ...formData, threshold: e.target.value })
              }
              required
              step="0.01"
              min="0"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : alertId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
