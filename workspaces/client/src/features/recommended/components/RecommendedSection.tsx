import { Suspense, lazy } from 'react';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

const LazyJumbotronSection = lazy(() => import('@wsh-2025/client/src/features/recommended/components/JumbotronSection').then(module => ({
  default: module.JumbotronSection
})));
const LazyCarouselSection = lazy(() => import('@wsh-2025/client/src/features/recommended/components/CarouselSection').then(module => ({
  default: module.CarouselSection
})));

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

// スケルトンコンポーネント for Jumbotron
const JumbotronSkeleton = () => (
  <div className="block flex h-[260px] w-full flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717]">
    <div className="grow-1 shrink-1 p-[24px]">
      <div className="mb-[16px] w-full text-center">
        <div className="mx-auto h-[22px] w-3/4 rounded bg-[#2a2a2a] animate-pulse"></div>
      </div>
      <div className="w-full text-center">
        <div className="mx-auto h-[14px] w-2/3 rounded bg-[#2a2a2a] animate-pulse mb-[8px]"></div>
        <div className="mx-auto h-[14px] w-1/2 rounded bg-[#2a2a2a] animate-pulse"></div>
      </div>
    </div>
    <div className="h-full w-[260px] shrink-0 grow-0 bg-[#2a2a2a] animate-pulse"></div>
  </div>
);

// スケルトンコンポーネント for Carousel
const CarouselSkeleton = () => (
  <div className="w-full">
    <div className="mb-[16px] w-3/4 h-[22px] bg-[#2a2a2a] animate-pulse rounded"></div>
    <div className="mx-[-24px] flex flex-row gap-x-[12px] overflow-x-auto overflow-y-hidden pl-[24px] pr-[56px]">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="w-[200px] shrink-0 grow-0">
          <div className="overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#2a2a2a] h-[120px] animate-pulse"></div>
          <div className="p-[8px]">
            <div className="mb-[4px] h-[14px] bg-[#2a2a2a] animate-pulse rounded w-3/4"></div>
            <div className="h-[12px] bg-[#2a2a2a] animate-pulse rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const RecommendedSection = ({ module }: Props) => {
  if (module.type === 'jumbotron') {
    return (
      <Suspense fallback={<JumbotronSkeleton />}>
        <LazyJumbotronSection module={module} />
      </Suspense>
    );
  } else {
    return (
      <Suspense fallback={<CarouselSkeleton />}>
        <LazyCarouselSection module={module} />
      </Suspense>
    );
  }
};
