import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Car,
  DollarSign,
  Hash,
  Calendar,
  Type,
  Activity,
  Info,
  Edit2,
  Trash2,
} from "lucide-react";
import { Vehicle } from "../types";
import { cn } from "../lib/utils";

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onEdit: () => void;
  onDelete: () => void;
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !vehicle) return null;

  const statusColors = {
    Available: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rented: "bg-brand-50 text-brand-700 border-brand-100",
    Maintenance: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                <Car size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Vehicle Details
                </h3>
                <p className="text-xs text-slate-500 font-mono uppercase">
                  ID: {vehicle.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                title="Edit Vehicle"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Vehicle"
              >
                <Trash2 size={18} />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-8 overflow-y-auto max-h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Image & Status */}
              <div className="space-y-6">
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
                  <img
                    src={vehicle.image}
                    alt={vehicle.model}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Current Status
                    </span>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border",
                        statusColors[
                          vehicle.status as keyof typeof statusColors
                        ],
                      )}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Price Per Day</span>
                      <span className="font-bold text-slate-800">
                        Rs.{vehicle.pricePerDay}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">License Plate</span>
                      <span className="font-mono font-bold text-slate-800">
                        {vehicle.licensePlate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Specifications */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Info size={16} className="text-brand-600" />
                    General Information
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Make
                      </p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {vehicle.make}
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Model
                      </p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {vehicle.model}
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Year
                      </p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {vehicle.year}
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Type
                      </p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {vehicle.type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <button
              onClick={onDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
              <Trash2 size={16} />
              Remove Vehicle
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onEdit}
                className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit Details
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VehicleDetailsModal;
