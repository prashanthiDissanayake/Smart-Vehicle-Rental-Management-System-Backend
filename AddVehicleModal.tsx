import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Car,
  DollarSign,
  Image as ImageIcon,
  Hash,
  Calendar,
  Type,
  Currency,
} from "lucide-react";
import { cn } from "../lib/utils";
import api from "../api";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (vehicle: any) => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    type: "Sedan",
    pricePerDay: "",
    licensePlate: "",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80",
    status: "Available",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pattern = /^[A-Z]{2,3}-\d{4}$/;

    if (!pattern.test(formData.licensePlate)) {
      alert("Invalid format! Use like CG-5643 or CGD-5643");
      return;
    }

    const payload = {
      ...formData,
      pricePerDay: Number(formData.pricePerDay),
    };

    try {
      onAdd(payload);

      onClose();

      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        type: "Sedan",
        pricePerDay: "",
        licensePlate: "",
        image:
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80",
        status: "Available",
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const vehicleTypes = [
    "Sedan",
    "SUV",
    "Electric",
    "Luxury",
    "Truck",
    "Van",
    "Sports",
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-600 text-white rounded-lg shadow-lg shadow-brand-200">
                <Car size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Add New Vehicle
                </h3>
                <p className="text-xs text-slate-500">
                  Enter vehicle details to add it to your fleet.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Make */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Car size={14} className="text-brand-600" />
                    Make
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Tesla, BMW, Ford"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    value={formData.make}
                    onChange={(e) =>
                      setFormData({ ...formData, make: e.target.value })
                    }
                  />
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Car size={14} className="text-brand-600" />
                    Model
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Model 3, X5, F-150"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                  />
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} className="text-brand-600" />
                    Year
                  </label>
                  <input
                    required
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Type size={14} className="text-brand-600" />
                    Vehicle Type
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* License Plate */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Hash size={14} className="text-brand-600" />
                    License Plate
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. ABC-1234"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-mono uppercase"
                    value={formData.licensePlate}
                    onChange={(e) =>
                      setFormData({ ...formData, licensePlate: e.target.value })
                    }
                  />
                </div>

                {/* Price Per Day */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Currency size={14} className="text-brand-600" />
                    Price Per Day (Rs)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    value={formData.pricePerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerDay: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
              >
                Add Vehicle
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddVehicleModal;
