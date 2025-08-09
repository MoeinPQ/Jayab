import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Villa {
  id: number;
  title: string;
  images: string;
  city: string;
  address: string;
  base_capacity: number;
  maximum_capacity: number;
  area: number;
  bed_count: number;
  has_pool: boolean;
  has_cooling_system: boolean;
  base_price_per_night: number;
  extra_person_price: number;
  rating: number;
}

interface VillaCardProps {
  villa: Villa;
  className?: string;
}

export function VillaCard({ villa, className }: VillaCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/villa/${villa.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 cursor-pointer",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src={villa.images}
          alt={villa.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-lg">★</span>
          <span className="text-sm text-gray-600">{villa.rating}</span>
        </div>

        {/* Title and City */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {villa.title}
          </h3>
          <p className="text-sm text-gray-600 truncate">{villa.city}</p>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <span className="text-lg font-bold text-gray-900">
            {villa.base_price_per_night.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600"> تومان / شب</span>
        </div>
      </div>
    </div>
  );
}
