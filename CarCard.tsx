import React from "react";
import { Users, Fuel, Gauge, Star, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface CarProps {
  id: string;
  name: string;
  type: string;
  image: string;
  price: number;
  passengers: number;
  fuel: string;
  transmission: string;
  rating: number;
  onBook: (car: any) => void;
}

export const CarCard: React.FC<CarProps> = ({
  id,
  name,
  type,
  image,
  price,
  passengers,
  fuel,
  transmission,
  rating,
  onBook,
}) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
    >
      <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[16/10]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-slate-900">{rating}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              {type}
            </p>
            <h3 className="text-xl font-bold text-slate-900">{name}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">Rs.{price}</p>
            <p className="text-xs font-medium text-slate-400">/ day</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-slate-50">
        <div className="flex flex-col items-center gap-1">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            {passengers} Seats
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Fuel className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            {fuel}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Gauge className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            {transmission}
          </span>
        </div>
      </div>

      <button
        onClick={() => onBook({ id, name, price, image })}
        className="w-full bg-slate-50 text-slate-900 group-hover:bg-indigo-600 group-hover:text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
      >
        Rent Now
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
