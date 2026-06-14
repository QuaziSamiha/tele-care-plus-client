import Image from "next/image";
import { GoStarFill } from "react-icons/go";

const reviews = [
  {
    id: 1,
    name: "Somchai Rakdee",
    date: "Nov 27, 2025",
    avatar: "/images/home/feedback1.jpg",
    rating: 5,
    comment:
      "I've been taking the Build Biotin Hair & Skin Gummies for a few weeks now, and I'm honestly impressed. My hair feels stronger, looks shinier, and I've noticed less breakage when brushing. My skin also looks a bit smoother and brighter. The best part? They taste amazing — it actually feels like a treat instead of a supplement. Super easy to take daily, and I'm definitely sticking with them!",
  },
  {
    id: 2,
    name: "Sophie Ellis",
    date: "Nov 27, 2025",
    avatar: "/images/home/feedback1.jpg", // Ensure you have a second image or reuse the first
    rating: 5,
    comment:
      "I've been taking the Build Biotin Hair & Skin Gummies for a few weeks now, and I'm honestly impressed. My hair feels stronger, looks shinier, and I've noticed less breakage when brushing. My skin also looks a bit smoother and brighter. The best part? They taste amazing — it actually feels like a treat instead of a supplement. Super easy to take daily, and I'm definitely sticking with them!",
  },
];

export default function ProductReviews() {
  return (
    <section className="flex flex-col gap-8">
      {reviews.map((review) => (
        <div key={review.id} className="flex items-start gap-4 md:gap-6">
          {/* AVATAR: Circular as per image */}
          <div className="flex-shrink-0">
            <div className="relative w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-full border border-slate-100">
              <Image
                src={review.avatar}
                alt={review.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* CONTENT BOX: Light border and padding */}
          <div className="flex-grow border border-slate-200 rounded-sm p-5 md:p-7 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              {/* Name and Date */}
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-bold text-base">
                  {review.name}
                </span>
                <span className="text-slate-300">—</span>
                <span className="text-slate-400 text-sm">{review.date}</span>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <GoStarFill
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < review.rating ? "text-slate-900" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              {review.comment}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
// import Image from "next/image";

// export default function ProductReviews() {
//   return (
//     <section>
//       <div className="flex items-start gap-2">
//         <div>
//           <Image
//             src={"/images/home/feedback1.jpg"}
//             alt="review"
//             width={241}
//             height={245}
//             className="w-60 h-60"
//           />
//         </div>
//         <div className="border border-slate-400 rounded">
//           <div className="flex items-center">
//             <p className="text-slate-800 text-sm">Somchai Rakdee</p>{" "}
//             <span>-</span>
//             <p className="text-slate-500 text-xs">Nov 27, 2025</p>
//           </div>
//           <p className="text-sm">
//             I&apos;ve been taking the Build Biotin Hair & Skin Gummies for a few
//             weeks now, and I&apos;m honestly impressed. My hair feels stronger,
//             looks shinier, and I&apos;ve noticed less breakage when brushing. My
//             skin also looks a bit smoother and brighter. The best part? They
//             taste amazing — it actually feels like a treat instead of a
//             supplement. Super easy to take daily, and I&apos;m definitely
//             sticking with them!
//           </p>
//         </div>
//       </div>
//       <div className="flex items-start gap-2">
//         <div>
//           <Image
//             src={"/images/home/feedback1.jpg"}
//             alt="review"
//             width={241}
//             height={245}
//             className="w-60 h-60"
//           />
//         </div>
//         <div className="border border-slate-400 rounded">
//           <div className="flex items-center">
//             <p className="text-slate-800 text-sm">Somchai Rakdee</p>{" "}
//             <span>-</span>
//             <p className="text-slate-500 text-xs">Nov 27, 2025</p>
//           </div>
//           <p className="text-sm">
//             I&apos;ve been taking the Build Biotin Hair & Skin Gummies for a few
//             weeks now, and I&apos;m honestly impressed. My hair feels stronger,
//             looks shinier, and I&apos;ve noticed less breakage when brushing. My
//             skin also looks a bit smoother and brighter. The best part? They
//             taste amazing — it actually feels like a treat instead of a
//             supplement. Super easy to take daily, and I&apos;m definitely
//             sticking with them!
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }
