import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PersonalInformation() {
  return (
    <section className="bg-white border border-slate-100 rounded-lg p-6 md:p-8 shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 text-slate-600 border-slate-200"
        >
          <PencilLine className="w-4 h-4" />
          Edit
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        {/* Name */}
        <div className="space-y-1">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">Name</p>
          <p className="text-slate-800 font-semibold">Sophie Ellis</p>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">Address</p>
          <p className="text-slate-800 font-semibold leading-relaxed">
            123 Sukhumvit Road, Khlong Toei, Bangkok 10110, Thailand
          </p>
        </div>

        {/* Separator for mobile - optional, image shows a light border/spacing */}
        <div className="md:col-span-2 border-t border-slate-50 my-2 hidden md:block" />

        {/* Email */}
        <div className="space-y-1">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">Email</p>
          <p className="text-slate-800 font-semibold">sophie@birdem.com</p>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">Phone Number</p>
          <p className="text-slate-800 font-semibold">+66 2 123 4567</p>
        </div>
      </div>
    </section>
  );
}