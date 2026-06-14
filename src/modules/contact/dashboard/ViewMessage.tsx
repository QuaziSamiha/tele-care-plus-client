"use client";

import { IModal } from "@/types/share-component.type";
import { IContactMessage } from "../types/contact.types";

export default function ViewMessage({ data, setOpen }: IModal) {
  const msg = data as IContactMessage;

  const formattedDate = new Date(msg.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Message Detail</h2>
        <span className="text-xs text-slate-400">{formattedDate}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 font-medium">User Name</span>
          <span className="text-slate-800 font-semibold">{msg.name}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 font-medium">Phone</span>
          <span className="text-slate-800 font-semibold">
            {msg.phone ?? "—"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 font-medium">Email</span>
          <span className="text-slate-800 font-semibold">{msg.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 font-medium">Status</span>
          <span
            className={`font-semibold ${msg.isRead ? "text-green-600" : "text-amber-500"}`}
          >
            {msg.isRead ? "Read" : "Unread"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-slate-500 font-medium text-sm">Message</span>
        <p className="text-slate-700 text-sm leading-relaxed bg-neutral-50 border border-neutral-200 rounded p-4 whitespace-pre-wrap">
          {msg.message}
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => setOpen?.(false)}
          className="border border-neutral-300 text-neutral-600 font-semibold px-5 py-2.5 rounded cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
