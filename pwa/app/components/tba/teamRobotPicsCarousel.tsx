import Autoplay from 'embla-carousel-autoplay';

import { Media } from '~/api/v3';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';

export default function TeamRobotPicsCarousel({
  media,
}: {
  media: Media[];
}): JSX.Element {
  return (
    <Carousel className="w-full max-w-xs" plugins={[Autoplay({ delay: 5000 })]}>
      <CarouselContent className="items-center">
        {media.map((m, index) => (
          <CarouselItem key={index}>
            <div className="rounded-lg border-4 border-neutral-600">
              <img
                className="rounded object-cover"
                src={m.direct_url}
                alt={''}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-1 flex justify-center gap-8">
        <CarouselPrevious className="relative left-0 transform-none" />
        <CarouselNext className="relative right-0 transform-none" />
      </div>
    </Carousel>
  );
}
