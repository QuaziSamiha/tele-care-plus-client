import Image from "next/image";
import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePhoto() {
  return (
    <section className="bg-white border border-slate-100 rounded-lg p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Profile Info Group */}
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            <Image
              src="/images/home/feedback1.jpg" // Replace with dynamic user image
              alt="Profile"
              fill
              className="rounded-full object-cover border-2 border-slate-50"
            />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Sophie Ellis</h2>
        </div>

        {/* Edit Action */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-slate-600 border-slate-200 px-4"
        >
          <PencilLine className="w-4 h-4" />
          Edit
        </Button>
      </div>
    </section>
  );
}
