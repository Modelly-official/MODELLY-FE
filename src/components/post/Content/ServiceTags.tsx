'use client';

import CategoryBadge from '@/src/components/common/CategoryBadge';

interface ServiceTagsProps {
  services: string[];
}

export default function ServiceTags({ services }: ServiceTagsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {services.map((service, index) => (
        <CategoryBadge key={`${service}-${index}`} label={service} />
      ))}
    </div>
  );
}

