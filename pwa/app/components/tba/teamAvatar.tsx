/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import { Media } from '~/api/v3';
import { cn } from '~/lib/utils';

export default function TeamAvatar({ media }: { media: Media }): JSX.Element {
  const [colorClass, setColorClass] = useState('bg-blue-500');

  return (
    <img
      alt="Team Avatar"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      src={`data:image/png;base64, ${media.details['base64Image']}`}
      className={cn(
        'size-12 rounded inline mr-2 p-1 cursor-pointer',
        colorClass,
      )}
      onClick={() => {
        if (colorClass === 'bg-blue-500') {
          setColorClass('bg-red-500');
        } else {
          setColorClass('bg-blue-500');
        }
      }}
    />
  );
}
