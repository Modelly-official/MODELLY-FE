'use client';

interface ServiceTagsProps {
  services: string[];
}

export default function ServiceTags({ services }: ServiceTagsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {services.map((service, index) => (
        <span key={`${service}-${index}`} className="rounded bg-purple-200 px-2 py-1 text-caption-1-medium text-purple-700">
          {service}
        </span>
      ))}
    </div>
  );
}

