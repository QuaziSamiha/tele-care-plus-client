import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpdatePassword() {
  return (
    <section className="bg-white border border-slate-100 rounded-lg p-6 md:p-8 shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-800">Update Password</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 text-slate-600 border-slate-200 px-4"
        >
          <PencilLine className="w-4 h-4" />
          Change Password
        </Button>
      </div>

      {/* Password Display */}
      <div className="space-y-1">
        <p className="text-sm text-slate-400 font-medium tracking-wide">
          Your Password
        </p>
        <p className="text-slate-800 font-bold tracking-[0.2em] text-lg">
          **********
        </p>
      </div>
    </section>
  );
}