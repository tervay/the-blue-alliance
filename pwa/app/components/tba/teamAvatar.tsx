import { useState } from 'react';
import { Media } from '~/api/v3';
import { cn } from '~/lib/utils';

export default function TeamAvatar({ media }: { media: Media }): JSX.Element {
  const [colorClass, setColorClass] = useState('bg-blue-500');

  if (!media.details) {
    return <></>;
  }

  const handler = () => {
    if (colorClass === 'bg-blue-500') {
      setColorClass('bg-red-500');
    } else {
      setColorClass('bg-blue-500');
    }
  };

  return (
    <img
      alt="Team Avatar"
      src={`data:image/png;base64, ${media.details['base64Image']}`}
      className={cn(
        'size-12 rounded inline mr-2 p-1 cursor-pointer',
        colorClass,
      )}
      onClick={handler}
      onKeyDown={handler}
    />
  );
}
